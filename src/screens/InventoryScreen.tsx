// @ts-nocheck 
import { useState } from "react";
import { LS } from "../utils/storage";
import { fmt } from "../utils/format";
import { Icon } from "../components/Icon";

export const InventoryScreen = ({ settings, notify }) => { 
  const cur = settings.currency || "₦";

  const [products, setProducts] = 
  useState(LS.get("pos_products", [])); 

  const [editId, setEditId] =
   useState(null); 
  //  remember any product that is edit 
  const [editStock, setEditStock] = useState("");
   //  remember what user type 
  const low = 
  products.filter(p => p.stock > 0 && 
    p.stock <= 
    p.minStock
  ); 
  const out = 
  products.filter(p => p.stock === 0);

  const ok = 
  products.filter(p => p.stock > p.minStock); 

  const saveStock = (id) => { 
    const updated = 
    products.map(p =>
       p.id === id ? {
     ...p, 
     stock: Number(editStock) 
    } : p); 
    // if is the product im editing keep and replace stock
    LS.set(
      "pos_products",
       updated); 
    setProducts(updated); 
    setEditId(null); 
    notify("Stock updated", "success"); 
  }; 

  const StockCard = 
  ({ 
    items, title, color
   }) => ( 
// props 

    <div className="inventory-card" 
    style={{ 
      background: "#1e293b",
       borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", 
        marginBottom: 20 
        }}> 

      <div 
      style={{
         padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
           display: "flex", 
           alignItems: "center",
            gap: 8
             }}> 

        <div 
        style={{ 
          width: 8,
           height: 8,
            borderRadius: "50%", 
            background: color 
            }} /> 

        <span 
        style={{ 
          color: "#fff",
           fontWeight: 700,
            fontSize: 14 
            }}>{title}
            </span> 

        <span 
        style={{ 
          padding: "2px 8px",
           borderRadius: 6, 
           background: `${color}20`,
            color: color, 
            fontSize: 11,
             fontWeight: 700 
             }}>{items.length}
             </span> 

      </div> 

      {items.length === 0 ?
       <div
        style={{
         padding: 20, 
         color: "#334155",
          fontSize: 13,
           textAlign: "center"
           }}>None
           </div> : items.map(p => ( 

        <div
         className="inventory-row" key={p.id} 
         style={{
           padding: "12px 20px", 
           borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
             alignItems: "center",
              gap: 14
               }}> 

          <div
           style={{
             flex: 1 
             }}> 

            <div 
            style={{ 
              color: "#e2e8f0", 
              fontSize: 13, 
              fontWeight: 600 
              }}>{p.name}
              </div> 

            <div
             style={{
               color: "#475569", 
               fontSize: 11 
               }}>{p.category} · Min: {p.minStock} · {fmt(p.price, cur)}
               </div> 

          </div> 

          {editId === p.id ? ( 

            <div className="inventory-edit-controls" 
            style={{
               display: "flex",
             gap: 6 
             }}> 

              <input type="number" value={editStock} onChange={e => 
              setEditStock(e.target.value)} 
              // whennever user type remember it 
              style={{
                 width: 80,
                  padding: "6px 8px",
                   borderRadius: 7,
                    border: "1px solid rgba(255,255,255,0.15)",
                     background: "rgba(255,255,255,0.07)", color: "#fff", 
                     fontSize: 13,
                      outline: "none" }}
                       /> 

              <button 
              onClick={() => 
              saveStock(p.id)} 
              style={{ 
                padding: "6px 10px",
                 borderRadius: 7,
                  border: "none",
                   background: "#22c55e",
                    color: "#fff", 
                    cursor: "pointer",
                     fontSize: 13, 
                     fontWeight: 700
                      }}>
                        <Icon name="check" size={14} />
                      </button> 

              <button
               onClick={() => 
               setEditId(null)} 
               style={{ 
                padding: "6px 10px", 
                borderRadius: 7,
                 border: "1px solid rgba(255,255,255,0.1)", 
                 background: "transparent",
                  color: "#64748b", 
                  cursor: "pointer",
                   fontSize: 13 }}>
                    <Icon name="x" size={14} />
                    </button> 
            </div> 

          ) : ( 

            <div className="inventory-stock-controls" style={{
               display: "flex",
                alignItems: "center", 
                gap: 10 }}> 

              <span style={{
                 color: color,
                  fontWeight: 800,
                   fontSize: 18 }}>{p.stock}
                   </span> 

              <button 
              onClick={() => {
                 setEditId(p.id);
                  setEditStock
                  (String(p.stock)); }} 
                  style={{
                     padding: "5px 9px",
                      borderRadius: 7,
                       border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.04)", 
                color: "#64748b", 
                cursor: "pointer",
                 fontSize: 12 }}><Icon name="edit" size={13} />
              </button> 
            </div> 
          )} 
        </div> 
      ))} 
    </div> 
  ); 

  return ( 
    <div className="inventory-page" style={{
       height: "100%",
        overflowY: "auto",
         background: "#0f172a",
          padding: 24
           }}> 

      <h2 
      style={{
         color: "#fff", 
        fontSize: 20,
         fontWeight: 700,
          margin: "0 0 20px" 
          }}>Inventory Management</h2> 
      <StockCard items={out} title="Out of Stock" color="#f87171" /> 

      <StockCard items={low} title="Low Stock" color="#fbbf24" /> 

      <StockCard items={ok} title="Well Stocked" color="#4ade80" /> 
    </div> 
  ); 
}; 