// @ts-nocheck
import { useState } from "react";
import { LS } from "../utils/storage";
import { fmt } from "../utils/format";

export const ReportsScreen = ({ settings }) => { 
  const cur = settings.currency || "₦"; 

  const [period, setPeriod] = useState("week"); 

  const txns = LS.get("pos_transactions", []); 

  const products = LS.get("pos_products", []); 
 
  const now = Date.now(); 

  const ranges = {
     day: 86400000,
      week: 604800000,
       month: 2592000000,
        year: 31536000000 }; 

  const filtered = txns.filter(
    t =>
       t.status !== "refunded" &&
     now - t.timestamp <= ranges[period]
    ); 
// check all the transaction and only keep sales of the period 

  const revenue =
   filtered.reduce(
    (s, t) => s + t.total, 
    0); 
    // add all the sales 

  const cost =
   filtered.reduce(
    (s, t) =>
       s + 
    t.items.reduce(
      (a, i) =>
         a + (i.cost || 0) * i.qty,
       0
      ), 
      0
    ); 

  const profit = revenue - cost; 


  const margin = 
  revenue > 0 
  ? ((profit / revenue) * 100).toFixed(1) 
  : 0; 

  const txnCount = filtered.length; 

  const avgOrder = 
  txnCount > 0
   ? revenue / txnCount 
   : 0; 

  // Category breakdown 
  const catMap = {}; 

  filtered.forEach(
    t =>
   t.items.forEach(i => 
    { catMap[i.category] = 
      (catMap[i.category] || 0)
       +
        i.price * i.qty; })); 

  const cats = 
  Object.entries(catMap)
  .sort((a, b) => b[1] - a[1]); 
// sort the biggest first 
 

  // count Payment methods 
  const methodMap = {}; 
  filtered.forEach(t => { 
  methodMap[t.method] = 
  (methodMap[t.method] || 0) + 1; 
}); 

  return ( 

    <div style={{ height: "100%", overflowY: "auto", background: "#0f172a", padding: 24 }}> 

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}> 

        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Sales Reports</h2> 

        <div style={{ display: "flex", gap: 6 }}> 

          {["day", "week", "month", "year"].map(p => ( 

            <button key={p} onClick={() => setPeriod(p)} 
            style={{
               padding: "7px 14px",
                borderRadius: 8, 
                border: `1px solid ${period === p 
                  ? "#22c55e" 
                  : "rgba(255,255,255,0.1)"}`,
                   background: period === p ? "rgba(34,197,94,0.15)" : "transparent",
                    color: period === p ? "#22c55e" : "#64748b",
                     fontWeight: 600,
                      fontSize: 12,
                       cursor: "pointer",
                        textTransform: "capitalize" }}>{p}
                        </button> 
          ))} 
        </div> 
      </div> 
      {/* KPI Cards */} 

      <div
       style={{ 
        display: "grid",
         gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14, 
          marginBottom: 24 }}> 
        {[ 
          { l: "Revenue", 
            v: fmt(revenue, cur),
             c: "#22c55e", i: "💰" }, 

          { l: "Profit",
             v: fmt(profit, cur),
              c: "#3b82f6", i: "📈" }, 

          { l: "Margin", v: `${margin}%`, 
          c: "#a855f7", i: "%" }, 

          { l: "Transactions", v: txnCount, c: "#f59e0b", i: "🧾" }, 

          { l: "Avg Order", v: fmt(avgOrder, cur), c: "#06b6d4", i: "📊" }, 

        ].map(s => ( 

          <div key={s.l}
           style={{ 
            background: "#1e293b",
             borderRadius: 14,
              padding: "16px", 
              border: "1px solid rgba(255,255,255,0.06)" }}> 

            <div 
            style={{ 
              fontSize: 24, 
              marginBottom: 8 }}>{s.i}
              </div> 

            <div 
            style={{
               color: "#64748b",
                fontSize: 11 }}>{s.l}
                </div> 

            <div 
            style={{ 
              color: s.c,
               fontWeight: 800,
                fontSize: 18,
                 marginTop: 2 }}>{s.v}
                 </div> 
          </div> 
        ))} 
      </div> 
      <div 
      style={{
         display: "grid",
          gridTemplateColumns: "1fr 1fr",
           gap: 20 }}> 

        {/* Category Breakdown */} 

        <div 
        style={{ 
          background: "#1e293b",
           borderRadius: 16,
            padding: 20,
             border: "1px solid rgba(255,255,255,0.06)" }}> 

          <div
           style={{
             color: "#fff",
              fontWeight: 700,
               marginBottom: 16 
               }}>Revenue by Category
               </div> 

          {cats.length === 0 ?
           <div 
           style={{
             color: "#334155",
              fontSize: 13 }}>No data</div> : cats.map(([cat, rev]) => ( 

            <div key={cat} 
            style={{ marginBottom: 12 }}> 

              <div
               style={{ 
                display: "flex",
                 justifyContent: "space-between",
                  marginBottom: 4 }}> 

                <span
                 style={{ 
                  color: "#e2e8f0",
                   fontSize: 13 }}>{cat}
                   </span> 

                <span
                 style={{
                   color: "#22c55e",
                    fontSize: 13,
                     fontWeight: 600
                      }}>{fmt(rev, cur)}
                      </span> 
              </div> 

              <div 
              style={{
                 background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 6 
                 }}> 

                <div
                 style={{
                   background: "#22c55e",
                    borderRadius: 4,
                     height: 6, 
                     width: `${(rev / cats[0][1]) * 100}%`, transition: "width 0.5s" }} /> 

              </div> 
            </div> 
          ))} 

        </div> 
        {/* Payment Methods */} 

        <div 
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
                }}>Payment Methods</div> 

          {Object.entries(methodMap).length === 0 ? 
          <div 
          style={{
             color: "#334155", 
             fontSize: 13 }}>No data</div> : Object.entries(methodMap).map(([m, c]) => ( 

            <div key={m} 
            style={{
               display: "flex",
                alignItems: "center",
                 gap: 12,
                  marginBottom: 12
                   }}> 

              <div 
              style={{
                 width: 36,
                  height: 36,
                   borderRadius: 8,
                    background: "rgba(59,130,246,0.1)", display: "flex",
                     alignItems: "center",
                      justifyContent: "center", 
                      fontSize: 16 
                      }}> 

                {m === "cash" ? "💵" : m === "card" ? "💳" : m === "transfer" ? "🏦" : "📱"} 
              </div> 

              <div style={{ flex: 1 }}> 

                <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{m}</div> 

                <div style={{ color: "#475569", fontSize: 11 }}>{c} transactions</div> 
              </div> 
              <div style={{ color: "#22c55e", fontWeight: 700 }}>{((c / txnCount) * 100).toFixed(0)}%</div> 

            </div> 

          ))} 

        </div> 

        {/* Inventory Value */} 

        <div style={{ background: "#1e293b", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,0.06)", gridColumn: "1/-1" }}> 

          <div 
          style={{ 
            color: "#fff",
             fontWeight: 700, 
             marginBottom: 16 
             }}>Inventory Summary
             </div> 
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}> 

            {[ 

              { l: "Total Products", v: products.length }, 

              { l: "Total Stock Value",
                 v: fmt(products.reduce((s, p) => s + p.cost * p.stock, 0),
                  cur) }, 

              { l: "Retail Value",
                 v: fmt(products.reduce((s, p) => s + p.price * p.stock, 0), 
                 cur) }, 

              { l: "Potential Profit", 
                v: fmt(products.reduce((s, p) => s + (p.price - p.cost) * p.stock, 0), 
                cur) }, 

            ].map(s => ( 
              <div key={s.l} style={{
                 background: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                   padding: 14
                    }}> 

                <div style={{ 
                  color: "#64748b",
                   fontSize: 11
                    }}>{s.l}</div> 

                <div style={{
                   color: "#e2e8f0", 
                  fontWeight: 700, 
                  fontSize: 16,
                   marginTop: 4 
                   }}>{s.v}</div> 
              </div> 
            ))} 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 