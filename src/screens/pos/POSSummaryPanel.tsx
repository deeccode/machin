// @ts-nocheck
import { Icon } from "../../components/Icon";
import { fmt } from "../../utils/format";
import { SummaryRow } from "./SummaryRow";

export const POSSummaryPanel = ({
  cart,
  cur,
  settings,
  subtotal,
  discount,
  discountType,
  discountAmt,
  taxAmt,
  total,
  onDiscountChange,
  onDiscountTypeChange,
  onStartPayment,
}) => (
  <div className="pos-summary-panel"
   style={{
     width: 300,
      borderLeft: "1px solid rgba(255,255,255,0.06)", 
      background: "#1a2540",
       display: "flex",
        flexDirection: "column" 
        }}>
    <div 
    style={{
       padding: 16, 
       borderBottom: "1px solid rgba(255,255,255,0.06)" 
       }}>
      <div 
      style={{
         color: "#94a3b8",
          fontSize: 11,
           fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1.5 
            }}>
              Order Summary
            </div>
    </div>

    <div
     style={{ 
      flex: 1, 
      padding: 16,
       overflowY: "auto"
        }}>
      <div
       style={{ 
        display: "flex",
         flexDirection: "column",
          gap: 12 
          }}>
            {/* Subtotal Row  */}
        <SummaryRow label="Subtotal" value={fmt(subtotal, cur)} 
        />
        <div>
          <div 
          style={{ 
            color: "#64748b",
             fontSize: 12,
              marginBottom: 6 
              }}>Discount</div>
          <div 
          style={{
             display: "flex",
              gap: 6 
              }}>
            <select value={discountType} onChange={(event) => onDiscountTypeChange(event.target.value)} 
            style={{ 
              padding: "6px 8px", 
              borderRadius: 8,
               border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                 color: "#94a3b8", 
                 fontSize: 12 
                 }}>

              <option value="percent" 
              style={{
                 background: "#1e293b" }}>%</option>
              <option value="flat" 
              style={{
                 background: "#1e293b"
                  }}>Flat</option>
            </select>
            <input
              type="number"
              value={discount}
              min="0"
              onChange={(event) => onDiscountChange(
                Math.max(0, Number(event.target.value))
              )
            }
              style={{ 
                flex: 1,
                 minWidth: 0, 
                 padding: "6px 10px",
                  borderRadius: 8,
                   border: "1px solid rgba(255,255,255,0.1)", 
                   background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                     fontSize: 13,
                      outline: "none"
                     }}
            />
          </div>
          {discountAmt > 0 && 
          <div 
          style={{ 
            color: "#f87171",
             fontSize: 12,
              marginTop: 4 }}>
                -{fmt(discountAmt, cur)}
              </div>}
        </div>

        <SummaryRow
        // Displays tax percentage 
         label={`Tax (${settings.taxRate || 0}%`} value={fmt(taxAmt, cur)} muted />
        <div 
        style={{
   borderTop: "1px solid rgba(255,255,255,0.1)", 
           paddingTop: 12
            }}
            >
          <div
           style={{ 
            display: "flex",
             justifyContent: "space-between",
              alignItems: "center", 
              gap: 12
               }}>
            <span
             style={{
               color: "#fff",
                fontWeight: 700,
                 fontSize: 15 
                 }}>TOTAL</span>
<span 
            style={{ 
              color: "#22c55e",
               fontWeight: 800,
                fontSize: 22, 
                textAlign: "right" 
                }}>
                  {fmt(total, cur)}
</span>
          </div>
        </div>
      </div>
    </div>

    <div 
    style={{ 
      padding: 16,
       borderTop: "1px solid rgba(255,255,255,0.06)" 
       }}>
      <button onClick={onStartPayment} 
      disabled={cart.length === 0}
       style={{ 
        width: "100%",
         padding: "14px",
          borderRadius: 12,
           border: "none",
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
             fontWeight: 800,
              fontSize: 16,
             background:
            cart.length === 0 ? "#1e293b" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: cart.length === 0 ? "#334155" : "#fff",
                 transition: "all 0.2s"
                  }}>
        <div
         style={{ 
          display: "flex",
           alignItems: "center",
            justifyContent: "center",
             gap: 8
              }}>
          <Icon name="money" size={18} /> Process Payment
        </div>
      </button>
    </div>
  </div>
);
