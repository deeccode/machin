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

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const scanningRef = useRef(false);
  const lastBarcodeRef = useRef("");

  const cur = settings.currency || "\u20a6";
  const tax = (settings.taxRate || 0) / 100;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmt = discountType === "percent"
   ? subtotal * (discount / 100) 
   : Math.min(discount, subtotal);
  const taxAmt = (subtotal - discountAmt) * tax;
  const total = subtotal - discountAmt + taxAmt;

  const searchProducts = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      // if seach box is empty then clear result 
      return;
    }

    const q = query.toLowerCase();
    const products = LS.get("pos_products", []);
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(q) ||
      product.barcode.includes(query) ||
      product.category.toLowerCase().includes(q)
    );

    setSearchResults(results.slice(0, 8));
  };

  const addToCart = (product) => {
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

    setSearchQuery("");
    setSearchResults([]);
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

  const handleBarcodeDetected = (code) => {
    const products = LS.get("pos_products", []);
    const product = products.find((item) => item.barcode === code);

    if (product) {
      addToCart(product);
      notify(`Added: ${product.name}`, "success");
      return;
    }

    notify(`Barcode ${code} not found in system`, "error");
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
            if (code && code !== lastBarcodeRef.current) {
              lastBarcodeRef.current = code;
              setLastBarcode(code);
              handleBarcodeDetected(code);
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
    setScanning(false);
    setLastBarcode("");
  };

  const handleManualBarcode = (event) => {
    if (event.key !== "Enter") return;

    const code = searchQuery.trim();
    const products = LS.get("pos_products", []);
    const product = products.find((item) => item.barcode === code);

    if (product) {
      addToCart(product);
      setSearchQuery("");
      setSearchResults([]);
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
