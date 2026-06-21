// @ts-nocheck
import { Icon } from "../../components/Icon";
import { fmt } from "../../utils/format";

export const POSCartPanel = ({ 
  cart, 
  cur, 
  user,
   onClearCart,
    onRemoveFromCart,
     onUpdateQty })  => {
  const itemTypes = cart.length;
  const units = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
<div className="pos-cart-panel"
     style={{
       flex: 1,
      display: "flex", 
      flexDirection: "column",
       background: "#0f172a" 
 }}>
<div 
className="pos-cart-header" 
      style={{
         padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)", 
          display: "flex",
           alignItems: "center",
            justifyContent: "space-between" 
 }}>
<div>
          <div style={{ 
            color: "#fff",
             fontWeight: 700, 
             fontSize: 16
  }}>
                Shopping Cart
 </div>               
<div
  style={{ 
  color: "#64748b",
   fontSize: 12 
}}>
    {itemTypes} item type(s) | {units} units
   </div>
        </div>
<div 
  className="pos-cart-actions" 
  style={{ 
  display: "flex", 
  gap: 8 
}}>
          {cart.length > 0 && 
          <button onClick={onClearCart} 
          style={{ 
            padding: "8px 14px",
           borderRadius: 8, 
           border: "1px solid rgba(239,68,68,0.3)", 
           background: "rgba(239,68,68,0.1)", 
           color: "#f87171",
            fontSize: 12, 
            fontWeight: 600,
             cursor: "pointer"
              }}>
                Clear Cart
              </button>}
          <div 
          style={{ 
            padding: "8px 14px",
             borderRadius: 8,
              background: "rgba(34,197,94,0.1)",
               color: "#22c55e", 
               fontSize: 12,
                fontWeight: 600 
                }}>
                  Cashier: {user.name}
                  </div>
        </div>
      </div>

      <div className="pos-cart-list" 
      style={{ 
        flex: 1,
         overflowY: "auto",
          padding: 16 
          }}>
        {cart.length === 0 ? (
          <div className="pos-empty-state" 
          style={{ 
            display: "flex",
             flexDirection: "column",
              alignItems: "center",
               justifyContent: "center",
                height: "100%",
                 color: "#1e3a5f"
                  }}>
            <div 
            style={{
               color: "#1e3a5f" 
               }}>
                <Icon name="cart" size={72} />
               </div>
            <div 
            style={{
             color: "#334155", 
            fontSize: 16, 
            fontWeight: 600, 
            marginTop: 16 
            }}>Cart is empty
            </div>
            <div
             style={{ 
              color: "#1e3a5f",
               fontSize: 13, 
               marginTop: 6
                }}>Search or scan to add items
                </div>
          </div>
        ) : cart.map((item) => (
          <div className="pos-cart-item" key={item.id} 
 style={{         
            background: "#1e293b",
              borderRadius: 12,
               padding: "14px 16px",
                marginBottom: 10, 
                display: "flex", 
                alignItems: "center",
                 gap: 16, 
                 border: "1px solid rgba(255,255,255,0.05)"        
  }}>                
            <div className="pos-cart-item-icon" 
            style={{ 
              width: 44,
               height: 44, 
               borderRadius: 10, 
               background: "rgba(34,197,94,0.1)", 
               color: "#22c55e",
                display: "flex",
                 alignItems: "center", 
                 justifyContent: "center",
                  flexShrink: 0 
                  }}><Icon name="product" size={22} />
                  </div>
            <div className="pos-cart-item-details" 
            style={{ 
              flex: 1 

            }}>
              <div
               style={{ 
                color: "#e2e8f0",
                 fontWeight: 600,
                  fontSize: 14 
                  }}>{item.name}
                  </div>
              <div 
              style={{ 
                color: "#64748b",
                 fontSize: 12 
                 }}>
                  {item.category} | {fmt(item.price, cur)} each
                 </div>
            </div>
            <div className="pos-qty-controls" 
            style={{ 
              display: "flex",
               alignItems: "center", 
               gap: 8 
               }}>
              <button onClick={() => onUpdateQty(item.id, -1)} 
              style={{ 
                width: 28, 
                height: 28,
                 borderRadius: 8, 
                 border: "1px solid rgba(255,255,255,0.1)", 
                 background: "rgba(255,255,255,0.05)",
                  color: "#94a3b8",
                   cursor: "pointer", 
                   display: "flex",
                    alignItems: "center", 
                    justifyContent: "center" 
                    }}><Icon name="minus" size={14} />
                    </button>
              <span 
              style={{ 
                color: "#fff",
                 fontWeight: 700,
                  minWidth: 28, 
                  textAlign: "center" }}>{item.qty}
                  </span>
              <button onClick={() => onUpdateQty(item.id, 1)} 
              style={{ 
                width: 28,
                 height: 28,
                  borderRadius: 8,
                   border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)", 
                    color: "#94a3b8",
                     cursor: "pointer",
                      display: "flex",
                       alignItems: "center", 
                       justifyContent: "center" }}><Icon name="plus" size={14} />
                       </button>
            </div>
            <div className="pos-cart-item-price" 
            style={{
               color: "#22c55e",
                fontWeight: 700,
                 fontSize: 15,
                  minWidth: 80, 
                  textAlign: "right" 
                  }}>{fmt(item.price * item.qty, cur)}
                  </div>
            <button
             onClick={() => onRemoveFromCart(item.id)} 
            style={{ 
              color: "#f87171",
               background: "transparent",
                border: "none",
                 cursor: "pointer",
                  padding: 4 
                  }}><Icon name="trash" size={16} />
                  </button>
          </div>
        ))}
      </div>
    </div>
  );
};
