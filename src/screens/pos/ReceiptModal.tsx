// @ts-nocheck
import { Icon } from "../../components/Icon";
import { fmt, fmtDate } from "../../utils/format";

export const ReceiptModal = ({
   txn, settings, onClose }) => {
  const cur = settings.currency || "\u20a6";
  const handlePrint = () => window.print();

  return (
 <div 
    className="pos-modal-backdrop"
     style={{
       position: "fixed",
        inset: 0,
         background: "rgba(0,0,0,0.8)",
          zIndex: 1001,
           display: "flex", 
           alignItems: "center",
            justifyContent: "center", 
            overflowY: "auto", 
            padding: 12 
            }}>
              {/* Receipt Card */}
<div
       className="receipt-modal-card" 
      style={{ 
        width: 380, 
        background: "#fff", 
        borderRadius: 16,
         overflow: "hidden",
          margin: 20 
          }}>
            {/* Receipt Content makes everything printable */}
        <div
         id="receipt-content" 
         style={{
           padding: 24, 
           fontFamily: "monospace",
            color: "#000" 
            }}>
          <div
           style={{ 
            textAlign: "center", marginBottom: 16 }}>
            <div 
            style={{ 
              fontSize: 20, 
              fontWeight: 900 
              }}>
                {settings.storeName}
                </div>
<div 
            style={{ 
              fontSize: 11,
               color: "#666", 
               lineHeight: 1.5 
               }}>{settings.storeAddress}<br />{settings.storePhone} | {settings.storeEmail}
               </div>
            <div
             style={{ 
              borderTop: "1px dashed #999", margin: "12px 0"
               }} 
               />
            <div 
            style={{ 
              fontSize: 12 
              }}>
                Receipt No: <strong>{txn.id}</strong></div>
            <div 
            style={{ 
              fontSize: 11,
               color: "#666" 
               }}>{fmtDate(txn.timestamp)}
               </div>
            <div 
            style={{
               fontSize: 11,
                color: "#666"
                 }}>Cashier: {txn.cashierName}
                 </div>
            <div 
            style={{ 
              fontSize: 11, 
              color: "#666" 

            }}>
              Payment: {txn.method.toUpperCase()}</div>
          </div>

          <div
           style={{ 
            borderTop: "1px dashed #999", borderBottom: "1px dashed #999", padding: "10px 0",
             margin: "10px 0" 
             }}>
            {txn.items.map((item, index) => (
              <div key={index} 
              style={{
                 display: "flex",
               justifyContent: "space-between", gap: 10,
                fontSize: 12, 
                marginBottom: 4
                 }}>
                <div>
                  <div>{item.name}</div>
                  <div 
                  style={{ 
                    color: "#666"
                     }}>{item.qty} x {fmt(item.price, cur)}
                     </div>
                </div>
                <div 
                style={{
                   fontWeight: 700 }}>{fmt(item.price * item.qty, cur)}
                   </div>
              </div>
            ))}
          </div>
{/* Subtotal  */}
          <div
           style={{ fontSize: 12 }}>
            <div
             style={{
               display: "flex", 
               justifyContent: "space-between", marginBottom: 4 }}><span>Subtotal</span><span>{fmt(txn.subtotal, cur)}</span></div>
            {txn.discount > 0 && 
            <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", marginBottom: 4,
               color: "#dc2626" }}><span>Discount</span><span>-{fmt(txn.discount, cur)}</span></div>}
            <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", marginBottom: 8 }}><span>Tax</span><span>{fmt(txn.tax, cur)}</span></div>
            <div
             style={{ 
              display: "flex",
               justifyContent: "space-between", fontWeight: 900,
                fontSize: 16,
                 borderTop: "1px dashed #999", paddingTop: 8 }}><span>TOTAL</span><span>{fmt(txn.total, cur)}</span>
                 </div>
                 {/* Cash Payment */}
            {txn.method === "cash" &&
             <div 
             style={{
               display: "flex", 
               justifyContent: "space-between", marginTop: 6, 
               color: "#666" }}><span>Paid</span><span>{fmt(txn.amountPaid, cur)}</span></div>}
            {txn.change > 0 && 
            <div 
            style={{ 
              display: "flex",
               justifyContent: "space-between",
               color: "#16a34a" }}><span>Change</span><span>{fmt(txn.change, cur)}</span></div>}
          </div>

          <div
           style={{ 
            textAlign: "center",
             marginTop: 16,
            fontSize: 11,
             color: "#666" 
             }}>
            <div 
            style={{ 
              borderTop: "1px dashed #999", paddingTop: 12 
              }}>
                {settings.receiptFooter || "Thank you for your purchase!"}
                </div>
            <div 
            style={{ marginTop: 6 }}>*****</div>
          </div>
        </div>

        <div
         style={{ 
          padding: "12px 20px", 
          borderTop: "1px solid #e5e7eb", display: "flex",
           gap: 8 
           }}>
          <button onClick={handlePrint} 
          style={{
             flex: 1,
              padding: "10px",
               borderRadius: 10,
                border: "1px solid #22c55e", background: "rgba(34,197,94,0.1", 
                color: "#16a34a", 
                fontWeight: 700,
                 cursor: "pointer",
                  display: "flex",
                   alignItems: "center", justifyContent: "center", 
                   gap: 6 
                   }}>
            <Icon name="print" size={16} /> Print
          </button>
          <button onClick={onClose}
           style={{ 
            flex: 1,
             padding: "10px", 
             borderRadius: 10,
              border: "1px solid #e5e7eb", background: "#f9fafb", 
              color: "#374151", 
              fontWeight: 700,
               cursor: "pointer" 
               }}>New Sale</button>
        </div>
      </div>
    </div>
  );
};
