// @ts-nocheck 

import { useState } from "react";
import { LS } from "../utils/storage";
import { fmt, fmtDate } from "../utils/format";
import { Icon } from "../components/Icon";
const SummaryRow = ({ label, value, muted }) => (
  <div
   style={{
     display: "flex", 
     justifyContent: "space-between",
      alignItems: "center"
       }}>
    <span 
    style={{ 
      color: "#64748b",
       fontSize: 13 
       }}>{label}
       </span>
    <span
     style={{
       color: muted ? "#64748b" : "#e2e8f0",
        fontSize: 13, 
        fontWeight: 600 
        }}>{value}
        </span>
  </div>
);
const getTxnTime = (txn) => {
  const time = Number(txn?.timestamp);
  if (Number.isFinite(time)) return time;
  const parsed = Date.parse(txn?.timestamp);
  return Number.isFinite(parsed) ? parsed : 0;
};
export const TransactionsScreen = ({ settings, user, notify }) => { 
  const cur = settings.currency || "₦"; 
  const [txns, setTxns] = useState(() => LS.get("pos_transactions", []).sort((a, b) => getTxnTime(b) - getTxnTime(a))); 
  const [selected, setSelected] = useState(null); 
  const [search, setSearch] = useState(""); 
  const filtered = txns
    .slice()
    .sort((a, b) => getTxnTime(b) - getTxnTime(a))
    .filter(t => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return String(t.id || "").toLowerCase().includes(term)
        || String(t.cashierName || "").toLowerCase().includes(term)
        || String(t.method || "").toLowerCase().includes(term);
    }); 
  const handleRefund = (txn) => { 
    if (!confirm(`Refund transaction ${txn.id}? Stock will be restored.`)) return; 
    const products = LS.get("pos_products", []); 
    const restored = products.map(p => { 
      const item = txn.items.find(i => i.id === p.id); 
      return item ? { ...p, stock: p.stock + item.qty } : p; 
    }); 
    LS.set("pos_products", restored); 
    const updated = txns.map(t => t.id === txn.id ? { ...t, status: "refunded" } : t).sort((a, b) => getTxnTime(b) - getTxnTime(a)); 
    LS.set("pos_transactions", updated); 
    setTxns(updated); 
    setSelected(null); 
    notify("Refund processed, stock restored", "success"); 
  }; 
  return ( 
    <div className="transactions-page" 
    style={{ height: "100%",
     display: "flex", 
     background: "#0f172a" 
     }}> 
      {/* List */} 
      <div className="transactions-list-panel"
       style={{ width: 380,
        borderRight: "1px solid rgba(255,255,255,0.06)", 
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
          color: "#fff",
           fontWeight: 700,
            fontSize: 16,
             marginBottom: 10 
             }}>Transaction History
             </div> 
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, cashier, method..." 
          style={{
             width: "100%",
              padding: "8px 12px",
               borderRadius: 8, 
               border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", 
                color: "#fff", 
                fontSize: 13, 
                outline: "none", 
                boxSizing: "border-box"
                 }} /> 
        </div> 
        <div
         style={{ 
          flex: 1,
           overflowY: "auto"
            }}> 
          {filtered.length === 0 ? 
          <div
           style={{
             padding: 40, 
             textAlign: "center",
              color: "#334155" 
            }}>No transactions
            </div> : filtered.map(t => ( 
            <button className="transactions-list-item" key={t.id} onClick={() => setSelected(t)}
             style={{
               width: "100%", 
               padding: "14px 16px", 
               borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: selected?.id === t.id ? "rgba(34,197,94,0.08)" : "transparent",
                 border: "none", 
                 cursor: "pointer", 
                 textAlign: "left",
                  display: "flex", 
                  justifyContent: "space-between",
                   alignItems: "flex-start"
                    }}> 
              <div> 
                <div 
                style={{
                   color: "#e2e8f0", 
                   fontSize: 13,
                    fontWeight: 600 
                    }}>{t.id}
                    </div> 
                <div 
                style={{ 
                  color: "#475569", 
                  fontSize: 11, 
                  marginTop: 2
                   }}>{fmtDate(t.timestamp)}
                   </div> 
                <div
                 style={{ 
                  color: "#475569", 
                  fontSize: 11 
                  }}>{t.cashierName} · {t.method}
                  </div> 
              </div> 
              <div
               style={{
                 display: "flex", 
                 flexDirection: "column",
                  alignItems: "flex-end", 
                  gap: 4
                   }}> 
                <span 
                style={{ 
                  color: "#22c55e",
                   fontWeight: 700,
                    fontSize: 14 
                    }}>{fmt(t.total, cur)}
                    </span> 
                <span
                 style={{
                   padding: "2px 8px",
                    borderRadius: 5,
                     background: t.status === "refunded" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: t.status === "refunded" ? "#f87171" : "#4ade80", 
                     fontSize: 10, fontWeight: 700
                      }}>{t.status}
                      </span> 
              </div>
            </button> 
          ))} 
        </div> 
      </div> 
      {/* Detail */} 
      <div className="transactions-detail-panel" 
      style={{ 
        flex: 1,
         overflowY: "auto",
          padding: 24 }}> 
        {!selected ? ( 
          <div
           style={{ 
            display: "flex",
             flexDirection: "column", 
             alignItems: "center",
              justifyContent: "center",
               height: "100%",
                color: "#1e3a5f"
                 }}> 
            <Icon name="history" size={60} />
            <div 
            style={{
               color: "#334155", 
               fontSize: 15,
                marginTop: 16 
                }}>Select a transaction to view details
                </div> 
          </div> 
        ) : ( 
          <div> 
            <div 
            style={{
               display: "flex",
                alignItems: "center",
                 justifyContent: "space-between", 
                 marginBottom: 20 
                 }}> 
              <div> 
                <div style={{ 
                  color: "#fff",
                   fontWeight: 700,
                    fontSize: 18 }}>
                      {selected.id}
                      </div> 
                <div
                 style={{ 
                  color: "#64748b",
                   fontSize: 13 }}>{fmtDate(selected.timestamp)}
                   </div> 
              </div> 
              <div
               style={{ 
                display: "flex",
                 gap: 8
                  }}> 
                {selected.status !== "refunded" && user.role === "admin" && ( 
                  <button onClick={() => handleRefund(selected)}
                   style={{
                     padding: "8px 14px", 
                     borderRadius: 8,
                      border: "1px solid rgba(239,68,68,0.3)", 
                      background: "rgba(239,68,68,0.1)", 
                      color: "#f87171", fontWeight: 700,
                       cursor: "pointer", fontSize: 13,
                        display: "flex",
                         alignItems: "center",
                         gap: 6
                          }}> 

                    <Icon name="refund" size={14} /> Refund 

                  </button> 
                )} 

              </div> 
            </div>
            <div
             className="transactions-summary-grid" 
            style={{
               display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                 gap: 12, marginBottom: 20 
                 }}> 

              {[["Cashier", 
              selected.cashierName], 
              ["Payment", selected.method.toUpperCase()],
               ["Status", selected.status]].map(([l, v]) => ( 

                <div key={l} 
                style={{
                   background: "#1e293b",
                    borderRadius: 12,
                     padding: "14px 16px" 
                     }}> 

                  <div
                   style={{
                     color: "#64748b",
                      fontSize: 11 }}>{l}
                      </div> 

                  <div
                   style={{
                     color: "#e2e8f0",
                      fontWeight: 600,
                       fontSize: 14, 
                       marginTop: 2
                        }}>{v}
                        </div> 

                </div> 

              ))} 

            </div> 
            <div 
            style={{
               background: "#1e293b",
                borderRadius: 16,
                 overflow: "hidden", 
                 marginBottom: 16
                  }}> 

              <div 
              style={{ 
                padding: "12px 16px", 
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                 color: "#fff",
                  fontWeight: 700 
                  }}>Items Purchased
                  </div> 

              {selected.items.map((item, i) => ( 

                <div key={i}
                 style={{
                   padding: "12px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)", 
                    display: "flex", 
                    justifyContent: "space-between"
                     }}> 

                  <div>
                    <div
                   style={{ 
                    color: "#e2e8f0", 
                    fontSize: 13 }}>{item.name}
                    </div>
                    <div
                     style={{ 
                      color: "#475569",
                     fontSize: 11 }}>{item.qty} × {fmt(item.price, cur)}</div>
                     </div> 
                  <div 
                  style={{ 
                    color: "#22c55e",
                     fontWeight: 700 
                     }}>{fmt(item.price * item.qty, cur)}
                     </div> 
                </div> 
              ))} 
            </div> 
            <div 
            style={{
               background: "#1e293b",
                borderRadius: 16,
                 padding: 16
                  }}> 
              <div 
              style={{ 
                display: "flex",
                 flexDirection: "column",
                  gap: 8
                   }}> 
                <SummaryRow label="Subtotal" value={fmt(selected.subtotal, cur)} /> 
                {selected.discount > 0 && <SummaryRow label="Discount" value={`-${fmt(selected.discount, cur)}`} />} 
                <SummaryRow label="Tax" value={fmt(selected.tax, cur)} muted /> 
                <div
                 style={{
                   borderTop: "1px solid rgba(255,255,255,0.08)", 
                  paddingTop: 10, 
                  display: "flex",
                   justifyContent: "space-between" }}> 
                  <span
                   style={{
                     color: "#fff",
                      fontWeight: 700 
                      }}>Total
                      </span> 
                  <span
                   style={{ 
                    color: "#22c55e",
                     fontWeight: 800,
                      fontSize: 18 }}>{fmt(selected.total, cur)}
                      </span> 
                </div> 
                {selected.method === "cash" && <SummaryRow label="Paid" value={fmt(selected.amountPaid, cur)}
                 />} 
                {selected.change > 0 && <SummaryRow label="Change" value={fmt(selected.change, cur)} />} 
              </div> 
            </div> 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
}; 
