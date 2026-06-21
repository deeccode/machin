// @ts-nocheck 
import { LS } from "../utils/storage";
import { fmt, fmtDate } from "../utils/format";
//  Component declaration 
export const DashboardScreen = ({ settings }) => { 
  const cur = settings.currency || "₦"; 

  const getTxnTime = (txn) => {
    const time = Number(txn?.timestamp);

    if (Number.isFinite(time)) return time;
    const parsed = Date.parse(txn?.timestamp);
    return Number.isFinite(parsed)
     ? parsed : 0;
  };
  const txns = LS.get("pos_transactions", [])
  .sort((a, b) => getTxnTime(b) - getTxnTime(a));
  // show the newest first  
  const products =
   LS.get("pos_products", []); 
  const today = new Date();
   today.setHours(0, 0, 0, 0); 
  const sevenDaysStart = new Date(today); sevenDaysStart.setDate(sevenDaysStart.getDate() - 6); 

  const todayTxns =
   txns.filter(t => getTxnTime(t) >= today.getTime()); 
  const todayRevenue = 
  todayTxns.reduce((s, t) => s + t.total, 0); 
  // add all sales 
  const todayCost =
   todayTxns.reduce((s, t) => s + (t.items || []).reduce((a, i) => a + (i.cost || 0) * i.qty, 0), 0); 
  //  Calculate how much those products cost the store

  const monthStart = new Date();
   monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0); 
  const monthTxns = txns.filter(t => getTxnTime(t) >= monthStart.getTime()); 
  // keep only this month's sales

  const monthRevenue = 
  // find product running low 
  monthTxns.reduce((s, t) => s + t.total, 0); 
  const lowStockItems = products.filter(
    p =>
     p.stock > 0 &&
     p.stock <= p.minStock
  ); 

  const outStockItems = 
  products.filter(p => p.stock === 0); 
  // product completly finisined

  const stockAlerts =
   [...outStockItems, ...lowStockItems].sort((a, b) => a.stock - b.stock); 
   // combine both lists 
  const lowStock = lowStockItems.length;
  const outStock = outStockItems.length; 
  // count these products 

  // Top products 
  const salesMap = {};
  // empty score board  

  txns.forEach(
    // look at each transation 
    t =>
       (t.items || []).forEach(
        i => { 
          salesMap[i.name] =
           (salesMap[i.name] || 0)
            + i.qty;
           })); 
          //  then add quantity sold 

  const topProducts = 
  Object.entries(salesMap)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5); 

  // Last 7 days revenue and calculate 
  const daily =
   Array.from({ length: 7 }, 
    (_, i) => { 

    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0); 

    const end = new Date(d); end.setHours(23, 59, 59, 999); 

    const rev = txns.filter(t => getTxnTime(t) >= d.getTime() && getTxnTime(t) <= end.getTime()).reduce((s, t) => s + t.total, 0); 

    return { label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()], value: rev }; 

  }); 

  const maxDaily = 
  Math.max(...daily.map(d => d.value), 1
); 
// then find the biggest day 
  const recentTxns =
   txns.filter(t => getTxnTime(t) >= sevenDaysStart.getTime()); 

  const stats = [ 
    { label: "Today's Revenue",
       value: fmt(todayRevenue, cur), 
     sub: `${todayTxns.length} transactions`, 
      color: "#22c55e",
       icon: "💰" }, 

    { label: "Today's Profit",
       value: fmt(todayRevenue - todayCost, cur), 
       sub: "After cost of goods", 
       color: "#3b82f6", icon: "📈" }, 

    { label: "Monthly Revenue",
       value: fmt(monthRevenue, cur),
        sub: `${monthTxns.length} transactions`, 
        color: "#a855f7", 
        icon: "📅" }, 

    { label: "Stock Alerts", 
      value: lowStock + outStock,
      sub: `${outStock} out, ${lowStock} low`,
      color: "#f59e0b",
       icon: "⚠️" }, 
  ]; 
  return ( 

    <div className="dashboard-page"
     style={{ 
      height: "100%",
       overflowY: "auto", 
       background: "#0f172a", 
       padding: 24 
       }}> 

      <div className="dashboard-container" 
      style={{
         maxWidth: 1200
          }}> 

        <h2 className="dashboard-heading"
         style={{ 
          color: "#fff",
           fontSize: 22,
            fontWeight: 700,
             margin: "0 0 24px" 
             }}>Dashboard Overview</h2> 

        {/* Stats */} 
        <div className="dashboard-stats"
         style={{ 
          display: "grid",
           gridTemplateColumns: "repeat(4, 1fr)", 
           gap: 16, 
           marginBottom: 24
            }}> 

          {stats.map(s => ( 
            <div className="dashboard-card"
             key={s.label}
              style={{ 
                background: "#1e293b",
                 borderRadius: 16,
                  padding: 20,
                   border: "1px solid rgba(255,255,255,0.06)" 
            }}> 
              <div 
              style={{
                 fontSize: 28,
                  marginBottom: 10 
                  }}>
                    {s.icon}
                </div> 
              <div 
              style={{
                 color: "#64748b",
                  fontSize: 12,
                   marginBottom: 4
                    }}>
                      {s.label}
                </div> 
              <div 
              style={{
                 color: s.color,
                  fontSize: 22,
                   fontWeight: 800
                    }}>
                      {s.value}
                </div> 
              <div 
              style={{ 
                color: "#475569",
                 fontSize: 11,
                  marginTop: 4 
                  }}>
                    {s.sub}
                </div> 
            </div> 
          ))} 
        </div> 
        <div className="dashboard-grid" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr",
           gap: 20 
        }}> 
          {/* Revenue Chart */} 
          <div className="dashboard-card" 
          style={{ 
            background: "#1e293b",
           borderRadius: 16, 
           padding: 20, 
           border: "1px solid rgba(255,255,255,0.06)" 
          }}> 
            <div 
            style={{ 
              color: "#fff", 
              fontWeight: 700, 
              marginBottom: 16 
              }}>
                Last 7 Days Revenue
              </div> 
            <div style={{ 
                display: "flex", 
                alignItems: "flex-end", 
               gap: 8, 
                height: 120 
            }}> 

              {daily.map((d, i) => ( 
                <div key={i} style={{ 
                  flex: 1, 
                  display: "flex", 
                  flexDirection: "column", alignItems: "center", 
                  gap: 4
                   }}> 

                  <div style={{
                     width: "100%", 
                     background: d.value > 0 ? "linear-gradient(180deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.05)", borderRadius: "4px 4px 0 0", height: `${(d.value / maxDaily) * 90 + 2}px`, minHeight: 2, transition: "height 0.3s"
                      }} /> 
                  <div style={{ color: "#475569", fontSize: 10 
                  }}>{d.label}
                  </div> 
                </div> 
              ))} 
            </div> 
          </div> 
          {/* Top Products */} 
          <div className="dashboard-card" 
          style={{ 
            background: "#1e293b", 
            borderRadius: 16, 
            padding: 20, 
            border: "1px solid rgba(255,255,255,0.06)" 
            }}> 

            <div 
            style={{
               color: "#fff",
                fontWeight: 700, 
              marginBottom: 16
               }}>
                Top Selling Products
                </div> 
            {topProducts.length === 0 ? <div style={{
               color: "#334155", 
               fontSize: 13 
              }}>No sales yet
              </div> 
              : topProducts.map(([name, qty], i) => ( 

              <div key={name} 
              style={{ 
                display: "flex",
                 alignItems: "center",
                  gap: 10, 
                  marginBottom: 12 
                  }}> 

                <div 
                style={{ 
                  width: 24,
                   height: 24,
                    borderRadius: 6,
                     background: "rgba(34,197,94,0.15)",
                      color: "#22c55e",
                       fontSize: 11, 
                       fontWeight: 700,
                        display: "flex",
                         alignItems: "center", justifyContent: "center"
                          }}>{i + 1}</div> 

                <div 
                style={{
                   flex: 1
                    }}> 

                  <div
                   style={{ 
                    color: "#e2e8f0",
                     fontSize: 13, 
                     fontWeight: 500
                      }}>{name}</div> 

                  <div 
                  style={{
                 background: "rgba(255,255,255,0.05)", borderRadius: 4, 
                 height: 4,
                  marginTop: 4
                   }}> 

                    <div
                     style={{ 
                      background: "#22c55e", borderRadius: 4,
                       height: 4,
     width: `${(qty / (topProducts[0][1] || 1)) * 100}%` }} 
     /> 

                  </div> 
                </div> 
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{qty} sold</div> 

              </div> 

            ))} 

          </div> 
          
          {/* Stock Alerts */} 
          <div className="dashboard-card" style={{ 
            background: "#1e293b", 
            borderRadius: 16, 
            padding: 20, 
            border: "1px solid rgba(255,255,255,0.06)" 
            }}> 

            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 16 }}>
              Stock Alerts ⚠️
            </div> 
            {stockAlerts.length === 0 ? 
            <div
             style={{
               color: "#334155", 
               fontSize: 13 
              }}>
                All products are stocked
              </div> 
              // else 
              : stockAlerts.map(product => ( 
              <div className="stock-alert-row" key={product.id} 
              style={{ 
                display: "flex",
                 alignItems: "center",
                  justifyContent: "space-between", 
                  gap: 12, marginBottom: 12, paddingBottom: 12, 
                  borderBottom: "1px solid rgba(255,255,255,0.05)" 
                  }}> 

                <div 
                style={{ minWidth: 0 }}> 
                  <div 
                  style={{ 
                    color: "#e2e8f0", 
                    fontSize: 13,
                     fontWeight: 600,
                      overflow: "hidden",
                       textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                         }}>{product.name}
                         </div> 
                  <div
                   style={{ 
                    color: "#64748b",
                     fontSize: 11 
                     }}>{product.category} · Min: {product.minStock}
                     </div> 
                </div> 

                <div 
                style={{ 
                  color: product.stock === 0 ? "#f87171"
                  // else  
                  : "#fbbf24",
                   fontSize: 13, 
                   fontWeight: 800, 
                   flexShrink: 0 
                   }}>
                  {product.stock} remaining
                </div> 
              </div> 
            ))} 

          </div> 
          {/* Recent Transactions */} 
          <div
           className="dashboard-card dashboard-wide-card"
            style={{
               background: "#1e293b",
                borderRadius: 16,
                 padding: 20,
                  border: "1px solid rgba(255,255,255,0.06)", 
                  gridColumn: "1/-1" 
                  }}> 

            <div
             style={{ 
              color: "#fff", 
              fontWeight: 700,
               marginBottom: 16
                }}>Recent Transactions
                </div> 

            {recentTxns.length === 0 ? 
            <div 
            style={{
               color: "#334155",
                fontSize: 13 
              }}>No transactions in the last 7 days
              </div> :
            recentTxns.map(t => ( 

              <div className="transaction-row" key={t.id} 
              style={{ 
                display: "flex",
                 alignItems: "center",
                  gap: 14, 
                  padding: "10px 0",
                   borderBottom: "1px solid rgba(255,255,255,0.05)"
                    }}> 

                <div 
                style={{
                   width: 36, 
                   height: 36,
                    borderRadius: 10,
                     background: "rgba(34,197,94,0.1)",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                       color: "#22c55e", 
                       fontSize: 16 }}>🧾</div> 

                <div 
                style={{ flex: 1 }}> 

                  <div 
                  style={{
                     color: "#e2e8f0",
                      fontSize: 13,
                       fontWeight: 600
                        }}>{t.id}
                        </div> 
                  <div style={{
                     color: "#64748b", 
                     fontSize: 11 
                     }}>
                    {fmtDate(t.timestamp)} · {t.cashierName} · {t.method}
                    </div> 
                </div> 
                <div 
                style={{ 
                  color: "#22c55e",
                   fontWeight: 700, 
                   fontSize: 14 
                   }}>{fmt(t.total, cur)}
                   </div> 
                <div 
                style={{
                   padding: "3px 10px",
                    borderRadius: 6,
                     background: "rgba(34,197,94,0.1)",
                      color: "#22c55e", 
                      fontSize: 11, 
                      fontWeight: 600 
                      }}>{t.status}
                      </div> 
              </div> 
            ))} 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
