// @ts-nocheck 
import { useState } from "react";
import { LS } from "../utils/storage";
import { genId, fmt } from "../utils/format";
import { Icon } from "../components/Icon";
export const ProductsScreen = ({ notify, settings }) => { 
  const cur = settings.currency || "₦"; 
  const [products, setProducts] = useState(LS.get("pos_products", [])); 
  const [search, setSearch] = useState(""); 
  const [categoryFilter, setCategoryFilter] = useState("All"); 
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState({ name: "", barcode: "", category: "", price: "", cost: "", stock: "", minStock: "", unit: "pcs", description: "", image: "" }); 
  const suppliers = LS.get("pos_suppliers", []); 
  const categories = ["All", ...new Set(products.map(p => p.category))]; 
  const cleanBarcode = (value = "") => String(value).trim().replace(/\s+/g, "");
  const barcodeKey = (value = "") => cleanBarcode(value).replace(/\D/g, "");
  const filtered = products.filter(p => { 
    const q = search.toLowerCase(); 
    return (categoryFilter === "All" || p.category === categoryFilter) && (p.name.toLowerCase().includes(q) || String(p.barcode || "").includes(search)); 
  }); 
  const save = () => { 
    const barcode = cleanBarcode(form.barcode);
    const normalizedBarcode = barcodeKey(barcode);

    if (!form.name || !barcode || !form.price) { notify("Name, barcode, and price required", "error"); 
      return; } 
    if (!normalizedBarcode) { notify("Barcode must contain numbers", "error"); 
      return; } 
    const ps = LS.get("pos_products", []); 
    const duplicate = ps.find(p => barcodeKey(p.barcode) === normalizedBarcode && (modal === "add" || p.id !== modal.id));
    if (duplicate) { notify(`Barcode already belongs to ${duplicate.name}`, "error"); return; }
    const productData = { ...form, barcode, price: Number(form.price), cost: Number(form.cost || 0), stock: Number(form.stock || 0), minStock: Number(form.minStock || 0) };

    if (modal === "add") { 
      const newP = { ...productData, id: genId() }; 
      LS.set("pos_products", [...ps, newP]); 
      notify("Product added!", "success"); 
    } else { 
      const updated = ps.map(p => p.id === modal.id ? { ...p, ...productData } : p); 
      LS.set("pos_products", updated); 
      notify("Product updated!", "success"); 
    } 
    setProducts(LS.get("pos_products", [])); 
    setModal(null); 
  }; 
  const deleteProduct = (id) => { 
    if (!confirm("Delete this product?")) return; 
    const updated = products.filter(p => p.id !== id); 
    LS.set("pos_products", updated); 
    setProducts(updated); 
    notify("Product deleted", "success"); 
  }; 
  const openAdd = () => { setForm({ name: "", barcode: "", category: "Food", price: "", cost: "", stock: "", minStock: "5", unit: "pcs", description: "", image: "", supplier: "" }); setModal("add"); }; 

  const openEdit = (p) => { setForm({ ...p }); setModal(p); }; 

  const handleImageUpload = (e) => { 

    const file = e.target.files[0]; 

    if (!file) return; 

    const reader = new FileReader(); 

    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result })); 

    reader.readAsDataURL(file); 

  }; 
  const f = (k, v) => setForm(p => ({ ...p, [k]: v })); 
  return ( 

    <div className="products-page"
    style={{
       height: "100%", 
       overflow: "hidden",
        display: "flex", 
        flexDirection: "column",
         background: "#0f172a"
          }}> 

      {/* Header */} 
      <div className="products-header"
       style={{ 
        padding: "16px 24px",
         borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex",
          alignItems: "center", 
          gap: 12, 
          flexWrap: "wrap"
           }}> 

        <div
         style={{
           color: "#fff",
            fontWeight: 700,
             fontSize: 18, 
             flex: "none" 
             }}>Products
             </div> 

{/* Search Container */}
        <div 
        style={{ 
          position: "relative",
           flex: 1,
            minWidth: 200
             }}> 

          <input
           value={search}
            onChange={e => setSearch(e.target.value)} placeholder="Search products..." 
            style={{ 
              width: "100%", 
              padding: "8px 8px 8px 34px",
               borderRadius: 8, 
               border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                color: "#fff",
                 fontSize: 13,
                  outline: "none", 
                  boxSizing: "border-box"
                   }} 
                   /> 
{/* seach icon  */}
          <span 
          style={{ 
            position: "absolute",
             left: 10, top: "50%",
              transform: "translateY(-50%)",
               color: "#64748b"
                }}><Icon name="search" size={14} />
                </span> 
        </div> 
{/* Creates dropdown menu */}
        <select
         value={categoryFilter} 
         onChange={e => setCategoryFilter(e.target.value)}
         style={{
           padding: "8px 12px",
            borderRadius: 8,
             border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", 
             color: "#94a3b8",
              fontSize: 13 
             }}> 

          {categories.map(c =>
           <option key={c} 
          style={{ 
            background: "#1e293b"
             }}>{c}</option>)} 
        </select> 

        <button
         onClick={openAdd} 
         style={{
           padding: "8px 16px",
          borderRadius: 8,
           border: "none",
            background: "#22c55e",
             color: "#fff", 
             fontWeight: 700,
              fontSize: 13, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: 6 
              }}> 

          <Icon name="plus" size={14} /> 
          Add Product 
        </button> 
      </div> 

      {/* Table */} 
      <div className="products-table-wrap"
      style={{ 
        flex: 1,
         overflowY: "auto",
          padding: "0 24px 24px"
           }}> 

        <table className="products-table"
        style={{
           width: "100%", 
           borderCollapse: "collapse",
            marginTop: 16
             }}> 
          <thead> 

            <tr 
            style={{
               background: "#1e293b" }}> 

              {["Product", "Barcode", "Category", "Price", "Cost", "Stock", "Status", "Actions"].map(h => ( 

                <th key={h} 
                style={{
                   padding: "10px 14px", 
                   color: "#64748b",
                    fontSize: 11,
                     fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: 1,
                       textAlign: "left", 
                       borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th> 
              ))} 
            </tr> 
          </thead> 
          <tbody> 
            {filtered.map(p => ( 
              <tr className="products-row" key={p.id} 
              style={{ 
                borderBottom: "1px solid rgba(255,255,255,0.04)" }}> 

                <td className="products-product-cell" data-label="Product"
                style={{
                   padding: "12px 14px" 
                   }}> 

                  <div
                   style={{ 
                    display: "flex",
                     alignItems: "center", 
                     gap: 10
                      }}> 

                    {p.image ? <img src={p.image} alt="" style={{ width: 36, 
                      height: 36, 
                      borderRadius: 8,
                       objectFit: "cover" }} 
                       /> : 
                       <div
                        style={{
                           width: 36, 
                           height: 36,
                            borderRadius: 8,
                             background: "rgba(34,197,94,0.1)", display: "flex",
                              alignItems: "center", justifyContent: "center", fontSize: 16 }}>📦</div>} 

                    <div><div
                     style={{
                       color: "#e2e8f0",
                        fontSize: 13,
                         fontWeight: 600 }}>{p.name}</div><div style={{
                           color: "#475569",
                            fontSize: 11 }}>{p.unit}</div></div> 
                  </div> 
                </td> 

                <td data-label="Barcode"
                style={{
                   padding: "12px 14px",
                    color: "#64748b", 
                    fontSize: 12, 
                    fontFamily: "monospace" }}>{p.barcode}</td> 

                <td data-label="Category"
                 style={{
                   padding: "12px 14px" }}><span 
                   style={{ 
                    padding: "3px 8px",
                     borderRadius: 6,
                      background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                       fontSize: 11,
                        fontWeight: 600 }}>{p.category}</span></td> 

                <td data-label="Price"
                style={{
                   padding: "12px 14px",
                    color: "#22c55e", 
                    fontWeight: 700, fontSize: 13 }}>{fmt(p.price,
                     cur)}</td> 

                <td data-label="Cost"
                style={{
                   padding: "12px 14px",
                    color: "#64748b", 
                    fontSize: 13 }}>{fmt(p.cost, cur)}
                    </td> 

                <td data-label="Stock"
                style={{ 
                  padding: "12px 14px",
                   color: "#e2e8f0", 
                   fontSize: 13, 
                   fontWeight: 600 }}>{p.stock}</td> 

                <td data-label="Status"
                style={{ 
                  padding: "12px 14px" 
                  }}> 

                  {p.stock === 0 ?
                   <span 
                   style={{ 
                    padding: "3px 8px",
                     borderRadius: 6,
                      background: "rgba(239,68,68,0.15)", color: "#f87171", 
                      fontSize: 11,
                       fontWeight: 600 }}>Out of Stock</span> : 

                    p.stock <= p.minStock ?
                     <span
                      style={{
                         padding: "3px 8px",
                          borderRadius: 6,
                           background: "rgba(245,158,11,0.15)", color: "#fbbf24", 
                           fontSize: 11,
                            fontWeight: 600 }}>Low Stock</span> : 

                      <span
                       style={{
                         padding: "3px 8px", 
                         borderRadius: 6,
                          background: "rgba(34,197,94,0.15)", color: "#4ade80",
                           fontSize: 11,
                            fontWeight: 600 }}>In Stock</span>} 

                </td> 

                <td data-label="Actions"
                style={{
                   padding: "12px 14px" }}> 

                  <div
                   style={{ 
                    display: "flex",
                     gap: 6 }}> 

                    <button onClick={() => openEdit(p)} 
                    style={{ 
                      padding: "6px 10px", 
                      borderRadius: 7,
                     border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.1)", 
                     color: "#60a5fa",
                      cursor: "pointer",
                       fontSize: 12 }}><Icon name="edit" size={13} />
                       </button> 

                    <button onClick={() => deleteProduct(p.id)} style={{
                       padding: "6px 10px",
                        borderRadius: 7, 
                      border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)",
                       color: "#f87171",
                        cursor: "pointer", 
                  fontSize: 12 }}><Icon name="trash" size={13} />
                  </button> 
                  </div> 
                </td> 
              </tr> 
            ))} 
          </tbody> 
        </table> 

        {filtered.length === 0 &&
         <div
          style={{
             textAlign: "center", 
             padding: 60,
              color: "#334155"
               }}>No products found</div>} 
      </div> 

      {/* Product Modal */} 
      {modal && ( 
        <div className="products-modal-backdrop"
         style={{
           position: "fixed",
            inset: 0, 
            background: "rgba(0,0,0,0.75)",
             zIndex: 1000,
              display: "flex",
               alignItems: "center",
                justifyContent: "center", 
                overflowY: "auto"
                 }}> 

          <div className="products-modal-card"
          style={{
             width: 540, 
             background: "#1e293b",
              borderRadius: 20, 
              border: "1px solid rgba(255,255,255,0.1)", margin: 20
               }}> 

            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}> 

              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{modal === "add" ? "Add Product" : "Edit Product"}</div> 

              <button onClick={() => setModal(null)}
               style={{ color: "#64748b", background: "transparent", border: "none", cursor: "pointer" }}><Icon name="x" size={20} /></button> 

            </div> 

            <div className="products-modal-body"
            style={{ 
              padding: 24,
               display: "grid", 
               gridTemplateColumns: "1fr 1fr", 
               gap: 14
                }}> 

              {[["name", "Product Name", "text", "2"], ["barcode", "Barcode", "text", "2"], ["category", "Category", "text", "1"], ["unit", "Unit", "text", "1"], ["price", "Selling Price", "number", "1"], ["cost", "Cost Price", "number", "1"], ["stock", "Current Stock", "number", "1"], ["minStock", "Min Stock Alert", "number", "1"]].map(([key, label, type, span]) => ( 

                <div key={key} 
                style={{ gridColumn: `span ${span}` }}> 

                  <label 
                  style={{ color: "#64748b",
                   fontSize: 12, 
                   display: "block", 
                   marginBottom: 6 }}>{label}</label> 

                  <input type={type} value={form[key]}
                   onChange={e => f(key, e.target.value)} 
                  style={{ width: "100%", 
                  padding: "9px 12px",
                   borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff",
                     fontSize: 13,
                      outline: "none",
                       boxSizing: "border-box" }} /> 
                </div> 
              ))} 

              <div
              style={{ 
                gridColumn: "span 2"
                 }}> 

                <label 
                style={{
                   color: "#64748b", 
                   fontSize: 12,
                    display: "block",
                     marginBottom: 6 }}>Supplier
                     </label> 

{/* SUPPLIER DROPDOWN */}
                <select
                 value={form.supplier || ""} onChange={e => f("supplier", e.target.value)}
                  style={{
                     width: "100%",
                      padding: "9px 12px",
                       borderRadius: 8,
                     border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#94a3b8",
                      fontSize: 13 
                      }}> 

                  <option value="" 
                  style={{ 
                 background: "#1e293b"
                }}>Select Supplier</option> 

                  {suppliers.map(s => <option key={s.id} value={s.id} 
                  style={{ 
                    background: "#1e293b" 
                    }}>{s.name}</option>)} 
                </select> 
              </div> 

              <div 
              style={{ gridColumn: "span 2" }}> 

                <label 
                style={{ 
                  color: "#64748b",
                   fontSize: 12, 
                   display: "block", 
                   marginBottom: 6 }}>Product Image
                   </label> 

                <div 
                style={{ 
                  display: "flex",
                   gap: 10, 
                   alignItems: "center"
                    }}> 

                  {form.image && <img src={form.image} alt="" style={{
                     width: 48,
                      height: 48,
                       borderRadius: 8,
                        objectFit: "cover" }} 
                        />} 

                  <input type="file" accept="image/*" onChange={handleImageUpload} 
                  style={{ color: "#94a3b8",
                   fontSize: 12 }} /> 
                </div> 
              </div> 
              <div
               style={{
                 gridColumn: "span 2" }}> 

                <label
                 style={{ color: "#64748b", 
                 fontSize: 12,
                  display: "block",
                   marginBottom: 6 }}>Description
                   </label> 

                <textarea value={form.description} onChange={e => f("description", e.target.value)} rows={2} style={{
                   width: "100%", 
                   padding: "9px 12px",
                    borderRadius: 8,
                     border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} /> 
              </div> 
            </div> 

            <div className="products-modal-actions"
            style={{
               padding: "12px 24px 24px",
                display: "flex", 
                gap: 10
                 }}> 

              <button onClick={save}
               style={{ 
                flex: 1,
                 padding: "11px",
                  borderRadius: 10,
                   border: "none",
                    background: "#22c55e", 
                    color: "#fff", 
                    fontWeight: 700, 
                    fontSize: 14,
                     cursor: "pointer" }}>Save Product
                     </button> 

              <button onClick={() => setModal(null)}
               style={{ 
                padding: "11px 20px",
                 borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)", background: "transparent", 
                  color: "#64748b", 
                  fontSize: 14, 
                  cursor: "pointer" 
                  }}>Cancel
                  </button> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}; 
