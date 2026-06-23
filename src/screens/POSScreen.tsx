// @ts-nocheck
import { useEffect, useRef, useState } from "react";
// use reference is used to keep and update a value later 
import { LS } from "../utils/storage";
import { POSCartPanel } from "./pos/POSCartPanel";
import { POSSearchPanel } from "./pos/POSSearchPanel";
import { POSSummaryPanel } from "./pos/POSSummaryPanel";
import { PaymentModal } from "./pos/PaymentModal";
import { ReceiptModal } from "./pos/ReceiptModal";

export const POSScreen = ({ user, settings, notify }) => { 
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percent");
  const [paymentMode, setPaymentMode] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [lastBarcode, setLastBarcode] = useState("");
  const [lastScannedProduct, setLastScannedProduct] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const scanningRef = useRef(false);
  const lastBarcodeRef = useRef("");
  const lastScanTimeRef = useRef(0);
  const lastScanFoundRef = useRef(false);

  const cur = settings.currency || "\u20a6";
  const tax = (settings.taxRate || 0) / 100;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmt = discountType === "percent"
   ? subtotal * (discount / 100) 
   : Math.min(discount, subtotal);
  const taxAmt = (subtotal - discountAmt) * tax;
  const total = subtotal - discountAmt + taxAmt;

  const normalizeBarcode = (code = "") => String(code).replace(/\D/g, "");

  const findProductByBarcode = (code) => {
    const scannedCode = normalizeBarcode(code);
    if (!scannedCode) return null;
    const products = LS.get("pos_products", []);

    return products.find((item) => {
      const productCode = normalizeBarcode(item.barcode);
      return productCode === scannedCode ||
        productCode === scannedCode.replace(/^0/, "") ||
        productCode.replace(/^0/, "") === scannedCode;
    });
  };

  const searchProducts = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      // if seach box is empty then clear result 
      return;
    }

    const q = query.toLowerCase();
    const barcodeQuery = normalizeBarcode(query);
    const products = LS.get("pos_products", []);
    const results = products.filter((product) =>
      String(product.name || "").toLowerCase().includes(q) ||
      (barcodeQuery && normalizeBarcode(product.barcode).includes(barcodeQuery)) ||
      String(product.category || "").toLowerCase().includes(q)
    );

    setSearchResults(results.slice(0, 8));
  };

  const addToCart = (product, options = {}) => {
    const shouldClearSearch = options.clearSearch !== false;

    if (product.stock <= 0) {
      notify("Out of stock!", "error");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (!existing) return [...prev, { ...product, qty: 1 }];

      if (existing.qty >= product.stock) {
        notify("Max stock reached", "error");
        return prev;
      }

      return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    });

    if (shouldClearSearch) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  // remove item and keep the selected item  

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.id !== id) return item;

      const newQty = item.qty + delta;
      if (newQty <= 0)
         return null;

      if (newQty > item.stock) {
        notify("Max stock reached", "error");
        return item;
      }
      // sharppppppppppp

      return { ...item, qty: newQty };
    }).filter(Boolean));
  };

  const showScannedProduct = (code, product) => {
    setLastBarcode(code);
    setLastScannedProduct(product);
    setSearchQuery(product.barcode || code);
    setSearchResults([product]);
  };

  const handleBarcodeDetected = (code) => {
    const product = findProductByBarcode(code);

    if (product) {
      showScannedProduct(code, product);
      addToCart(product, { clearSearch: false });
      notify(`Added: ${product.name} - ${cur}${product.price}`, "success");
      return true;
    }

    setLastBarcode(code);
    setLastScannedProduct(null);
    setSearchQuery(code);
    setSearchResults([]);
    notify(`Barcode ${code} not found in system`, "error");
    return false;
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      scanningRef.current = true;

if (videoRef.current) videoRef.current.srcObject = stream;
// Show camera video inside this video tag
      setScanning(true);

      if ("BarcodeDetector" in window) {
        const detector = new window.BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "qr_code", "code_39"],
        });

        const detect = async () => {
          if (!videoRef.current || !scanningRef.current) return;

          try {
            const barcodes = await detector.detect(videoRef.current);
            if (!barcodes.length) return;

            const code = barcodes[0].rawValue;
            const normalizedCode = normalizeBarcode(code);
            const now = Date.now();
            const isSameBarcode = normalizedCode && normalizedCode === lastBarcodeRef.current;
            const shouldRetryMissingBarcode = isSameBarcode && !lastScanFoundRef.current && now - lastScanTimeRef.current > 1800;

            if (normalizedCode && (!isSameBarcode || shouldRetryMissingBarcode)) {
              lastBarcodeRef.current = normalizedCode;
              lastScanTimeRef.current = now;
              lastScanFoundRef.current = handleBarcodeDetected(code);
            }
          } catch {}
        };

   scanIntervalRef.current = setInterval(detect, 500);
  //  the scanner ckecks bacodes every sec 
      } else {
        notify("BarcodeDetector not supported. Use manual search or type barcode.", "error");
      }
    } catch {
      scanningRef.current = false;
      notify("Camera access denied or unavailable.", "error");
    }
  };

  const stopScanning = () => {
    scanningRef.current = false;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;
    lastBarcodeRef.current = "";
    lastScanTimeRef.current = 0;
    lastScanFoundRef.current = false;
    setScanning(false);
    setLastBarcode("");
    setLastScannedProduct(null);
  };

  const handleManualBarcode = (event) => {
    if (event.key !== "Enter") return;

    const code = searchQuery.trim();
    const product = findProductByBarcode(code);

    if (product) {
      showScannedProduct(code, product);
      addToCart(product, { clearSearch: false });
      notify(`Added: ${product.name} - ${cur}${product.price}`, "success");
      return;
    }

    searchProducts(code);
  };

  useEffect(() => () => stopScanning(), []);

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPaymentMode(false);
  };

  return (
    <div className="pos-layout" style={{ display: "flex", height: "100%", background: "#0f172a" }}>
      <POSSearchPanel
        cur={cur}
        searchQuery={searchQuery}
        searchResults={searchResults}
        scanning={scanning}
        lastBarcode={lastBarcode}
        lastScannedProduct={lastScannedProduct}
        videoRef={videoRef}
        onSearch={searchProducts}
        onManualBarcode={handleManualBarcode}
        onToggleScanning={scanning ? stopScanning : startScanning}
        onAddToCart={addToCart}
      />

      <POSCartPanel
        cart={cart}
        cur={cur}
        user={user}
        onClearCart={clearCart}
        onRemoveFromCart={removeFromCart}
        onUpdateQty={updateQty}
      />

      <POSSummaryPanel
        cart={cart}
        cur={cur}
        settings={settings}
        subtotal={subtotal}
        discount={discount}
        discountType={discountType}
        discountAmt={discountAmt}
        taxAmt={taxAmt}
        total={total}
        onDiscountChange={setDiscount}
        onDiscountTypeChange={setDiscountType}
        onStartPayment={() => cart.length > 0 && setPaymentMode(true)}
      />

      {paymentMode && (
        <PaymentModal
          cart={cart}
          subtotal={subtotal}
          discountAmt={discountAmt}
          taxAmt={taxAmt}
          total={total}
          settings={settings}
          user={user}
          onSuccess={(txn) => {
            setReceipt(txn);
            setCart([]);
            setDiscount(0);
            setPaymentMode(false);
            notify("Payment successful! Receipt generated.", "success");
          }}
          onClose={() => setPaymentMode(false)}
        />
      )}

      {receipt && <ReceiptModal txn={receipt} settings={settings} onClose={() => setReceipt(null)} />}

      <style>{`
        @keyframes scan-line { from { top: 30%; } to { top: 68%; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};
