// @ts-nocheck
import { Icon } from "../../components/Icon";
import { fmt } from "../../utils/format";

export const POSSearchPanel = ({
  cur,
  searchQuery,
  searchResults,
  scanning,
  lastBarcode,
  lastScannedProduct,
  videoRef,
  onSearch,
  onManualBarcode,
  onToggleScanning,
  onAddToCart,
}) => (
  <div className="pos-search-panel" 
  style={{ 
    width: 320, 
    borderRight: "1px solid rgba(255,255,255,0.06)", 
    display: "flex",
     flexDirection: "column",
      background: "#1a2540" 
      // Dark blue background
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
          textTransform: "uppercase", letterSpacing: 1.5, 
          marginBottom: 12
           }}>
            Scanner & Search
 </div>
      <div
       style={{
         position: "relative"
          }}>
        <input
          value={searchQuery}
          onChange={(event) =>
           onSearch(event.target.value)
          }
          onKeyDown={onManualBarcode}
          placeholder=
          "Search name, barcode, category..."
          style={{ 
            width: "100%",
             padding: "10px 10px 10px 36px", borderRadius: 10, 
             border: "1px solid rgba(255,255,255,0.1)", 
             background: "rgba(255,255,255,0.05)", 
             color: "#fff", 
             fontSize: 13,
              outline: "none", 
              boxSizing: "border-box"
             }}
        />
        <span 
        style={{ 
          position: "absolute", 
          left: 10, top: "50%", 
          transform: "translateY(-50%)", color: "#64748b" 
          }}>
            <Icon name="search" size={16} />
          </span>
      </div>

      <button
       onClick={onToggleScanning}
       style={{ 
        width: "100%",
         marginTop: 10,
          padding: "10px",
           borderRadius: 10,
            border: "none", 
            cursor: "pointer", 
            fontWeight: 700, 
            fontSize: 13, 
            display: "flex",
             alignItems: "center", justifyContent: "center",
              gap: 8, 
              background: scanning ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.15)", color: scanning ? "#f87171" : "#22c55e"
               }}>
        <Icon name={scanning ? "x" : "camera"} size={16} /> {scanning ? "Stop Scanner" : "Start Camera Scanner"}
      </button>
    </div>

    <div 
    style={{ 
      padding: 12,
       borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
      <div 
      style={{ 
        position: "relative", 
        width: "100%",
         aspectRatio: "4/3",
          borderRadius: 12,
           overflow: "hidden",
            background: "#0f172a",
             border: "2px solid rgba(34,197,94,0.2)"
              }}>
        <video ref={videoRef} autoPlay playsInline muted 
        style={{
           width: "100%",
            height: "100%",
             objectFit: "cover" 
             }}
              />
        {!scanning && (
          <div 
          style={{ 
            position: "absolute", 
            inset: 0,
             display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
               color: "rgba(255,255,255,0.2)" 
               }}>
            <Icon name="camera" size={40} />
            <div 
            style={{ 
              fontSize: 12,
               marginTop: 8 
               }}>Camera off</div>
          </div>
        )}
        {scanning && (
          <div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            display: "flex",
             alignItems: "center", justifyContent: "center", pointerEvents: "none" 
             }}>
            <div 
            style={{ 
              position: "relative",
               width: "60%",
                height: "40%",
                 border: "2px solid #22c55e", borderRadius: 8, 
                 boxShadow: "0 0 0 2000px rgba(0,0,0,0.3)" 
                 }}>
              <div
               style={{
                 position: "absolute",
                  left: 0, 
                  width: "100%",
                   height: 2,
                    background: "rgba(34,197,94,0.8)",
                     animation: "scan-line 1.5s ease-in-out infinite alternate" 
                     }} />
            </div>
          </div>
        )}
      </div>
      {scanning && <div 
      style={{ 
        textAlign: "center",
         color: "#22c55e",
          fontSize: 12, 
          marginTop: 6, 
          animation: "pulse 1.5s infinite" 
          }}>Scanning...</div>}
      {lastScannedProduct && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(34,197,94,0.22)",
            background: "rgba(34,197,94,0.08)"
          }}>
          <div
            style={{
              color: "#86efac",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0,
              marginBottom: 6
            }}>
            Product found
          </div>
          <div
            style={{
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
            {lastScannedProduct.name}
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 11,
              marginTop: 3,
              overflowWrap: "anywhere"
            }}>
            Barcode: {lastScannedProduct.barcode || lastBarcode}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 8
            }}>
            <span style={{ color: "#94a3b8", fontSize: 11 }}>
              {lastScannedProduct.category} | Stock: {lastScannedProduct.stock}
            </span>
            <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 800 }}>
              {fmt(lastScannedProduct.price, cur)}
            </span>
          </div>
        </div>
      )}
    </div>

    <div style={{
       flex: 1, 
       overflowY: "auto",
        padding: 8 
        }}>
  {searchResults.length > 0 ? searchResults.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          style={{
             width: "100%",
              padding: "10px 12px", borderRadius: 10,
               border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.03)", 
                marginBottom: 6,
                 cursor: "pointer",
                  display: "flex", justifyContent: "space-between",
                   alignItems: "center", gap: 12, textAlign: "left", transition: "all 0.15s" }}
          onMouseEnter={(event) => event.currentTarget.style.background = "rgba(34,197,94,0.1)"}
          onMouseLeave={(event) => event.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        >
          <div 
          style={{ 
            minWidth: 0 
            }}>
            <div 
            style={{ 
              color: "#e2e8f0",
               fontSize: 13, 
               fontWeight: 600,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                 }}>{product.name}</div>
            <div 
            style={{ 
              color: "#64748b",
               fontSize: 11 
               }}>
                {product.category}
                 |
               Stock: {product.stock}
               </div>
          </div>
          <div 
          style={{
             color: "#22c55e",
              fontSize: 13,
               fontWeight: 700,
                flexShrink: 0 
                }}>
              {fmt(product.price, cur)}
              </div>
        </button>
      )) : (
        <div
         style={{ 
          padding: "30px 16px",
           textAlign: "center", 
           color: "#334155"
            }}>
          <Icon name="search" size={32} />
          <div style={{
             fontSize: 13, 
             marginTop: 8 
          }}>Search products or scan barcode</div>
        </div>
      )}
    </div>
  </div>
);
