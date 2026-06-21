// @ts-nocheck
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { LS } from "../../utils/storage";
import { genId, fmt } from "../../utils/format";

export const PaymentModal = ({
   cart,
   subtotal,
    discountAmt,
     taxAmt, 
     total,
      settings,
       user, 
       onSuccess, 
       onClose 
      }) => {
  const [method, setMethod] =  useState("cash");
  const [amountPaid, setAmountPaid] = useState(total.toFixed(2));
  const [reference, setReference] = useState("");
  const [processing, setProcessing] = useState(false);
  const cur = settings.currency || "\u20a6";
  const  change = Math.max(0, Number(amountPaid) - total);
  const processPayment = () => {
    if (method === "cash" && Number(amountPaid) < total) {
      alert("Insufficient amount");
      return;
    } 

    if (method !== "cash" && method !== "card" && !reference) {
      alert("Please enter a reference");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const txnId = "TXN" + genId();
      const products = LS.get("pos_products", []);
      const updatedProducts = products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        return cartItem ? { ...product, stock: Math.max(0, product.stock - cartItem.qty) } : product;
      });

      LS.set( "pos_products", updatedProducts);

      const txn = {
        id: txnId,
        cashierId: user.id,
        cashierName: user.name,
        items: cart.map((item) => ({ ...item })),
        subtotal,
        discount: discountAmt,
        tax: taxAmt,
        total,
        method,
        amountPaid: Number(amountPaid),
        change: method === "cash" ? change : 0,
        reference,
        status: "completed",
        timestamp: Date.now(),
      };

      const txns = LS.get("pos_transactions", []);
      LS.set("pos_transactions", [txn, ...txns]);
      onSuccess(txn);
    }, 800);
  };

  const methods = [
     { 
      id: "cash", 
      label: "Cash" 
     },
      { 
      id: "card",
       label: "Card"
       },
      {
       id: "transfer",
        label: "Bank Transfer"
       },
      { 
      id: "mobile",
       label: "Mobile Pay" 
      },
  ];

  return (
<div className="pos-modal-backdrop" 
  style={{ 
      position: "fixed", 
     inset: 0, 
     background: "rgba(0,0,0,0.75)",
     zIndex: 1000, 
     display: "flex", 
     alignItems: "center",
      justifyContent: "center",
       padding: 12 
}}>
      <div className="payment-modal-card" 
        style={{
         width: 460, 
         background: "#1e293b",
          borderRadius: 20,
           border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden"
       }}>
          <div 
           style={{ 
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)", 
            display: "flex",
            justifyContent: "space-between",
             alignItems: "center",
              gap: 16
               }}>
          <div>
              <div 
              style={{
              color: "#fff", 
              fontWeight: 700, 
              fontSize: 18 
              }}>
                Process Payment
               </div>
            <div 
             style={{
               color: "#64748b", 
               fontSize: 12 
               }}>
                Select payment method
            </div>
          </div>
          <button onClick={onClose} 
          style={{ 
            color: "#64748b",
             background: "transparent", 
             border: "none", 
             cursor: "pointer"
              }}>
              <Icon name="x" size={20} />
              </button>
        </div>

        <div 
        style={{
           padding: 24 
           }}>
          <div 
          style={{
             textAlign: "center",
              background: "rgba(34,197,94,0.1)", borderRadius: 12,
               padding: 16,
                marginBottom: 20
                 }}>
          <div style={{ 
              color: "#64748b",
               fontSize: 12 
               }}>
                Total Amount Due
           </div>
            <div style={{ 
              color: "#22c55e",
               fontSize: 32, 
               fontWeight: 800
                }}>{fmt(total, cur)}
              </div>
          </div>

     <div className="payment-method-grid" style={{ 
         display: "grid",
             gridTemplateColumns: "1fr 1fr",
              gap: 8,
               marginBottom: 20
               }}>
            {methods.map((item) => (
//  .map creates buutons for CashCardBank TransferMobile Pay
              <button key={item.id} onClick={() => setMethod(item.id)} 
              style={{ 
                padding: "12px",
                 borderRadius: 10, 
              border: `2px solid ${method === item.id ? "#22c55e" : "rgba(255,255,255,0.08)"}`,
               background: method === item.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", 
              color: method === item.id ? "#22c55e" : "#94a3b8",
               cursor: "pointer",
                fontWeight: 600, 
                fontSize: 14,
                 transition: "all 0.15s"
                  }}>
                {item.label}
              </button>
            ))}
       </div>

          {method === "cash" && (
            <div style={{ 
              marginBottom: 16 
              }}>
          <label
           style={{ 
                color: "#64748b",
                 fontSize: 12,
                  display: "block", 
                  marginBottom: 6 
                  }}>Amount Tendered
               </label>
              <input type="number" value={amountPaid} onChange={(event) => setAmountPaid(event.target.
              // this Updates amount entered 
              value)}
               style={{
                 width: "100%", 
                 padding: "12px", 
                 borderRadius: 10, 
                 border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                  color: "#fff", 
                  fontSize: 18,
                   fontWeight: 700, 
                   outline: "none", 
                   boxSizing: "border-box"
                    }} />
              {change > 0 && <div style={{ 
                marginTop: 8,
                 padding: "10px 14px", 
                borderRadius: 10,
                 background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                   fontWeight: 700,
                    display: "flex",
                     justifyContent: "space-between",
                      gap: 12 
                      }}>
                <span>
                  Change to Return
                  </span><span>{fmt(change, cur)}
                  </span>
              </div>}
            </div>
          )}

          {(method === "transfer" || method === "mobile") && (
            <div style={{
               marginBottom: 16 
               }}>
            <label style={{
                 color: "#64748b", 
                 fontSize: 12, 
                 display: "block", 
                 marginBottom: 6 
                 }}>Transaction Reference
              </label>
              <input type="text" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Enter reference number" 
              style={{ width: "100%",
                 padding: "10px 12px",
                  borderRadius: 10,
                   border: "1px solid rgba(255,255,255,0.1)", 
                   background: "rgba(255,255,255,0.05)", color: "#fff", 
                   fontSize: 14, 
                   outline: "none", 
                   boxSizing: "border-box" 
                   }} />
            </div>
          )}

          <button onClick={processPayment} 
          // this prevent multiple cliks 
          disabled={processing}
           style={{
             width: "100%",
              padding: "14px",
               borderRadius: 12, 
               border: "none",
                cursor: processing ? "not-allowed" : "pointer", 
                fontWeight: 800, 
                fontSize: 16,
                 background: processing ? "#334155" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff",
                  marginTop: 8 
                  }}>
            {processing ? "Processing..." : `Confirm Payment - ${fmt(total, cur)}`}
          </button>
        </div>
      </div>
    </div>
  );
};
