import { useState } from "react";
import { LS } from "../utils/storage";
import { genId } from "../utils/format";
import { Icon } from "../components/Icon";

export const SuppliersScreen = ({ notify }) => { 
  const [suppliers, setSuppliers] = useState(LS.get("pos_suppliers", [])); 

  const [modal, setModal] = useState(null); 

  const [form, setForm] = useState({ name: "", contact: "", phone: "", address: "" }); 

  const f = (k, v) => setForm(p => ({ ...p, [k]: v })); 
  const save = () => { 

    if (!form.name) { notify("Supplier name required", "error"); return; } 

    const ss = LS.get("pos_suppliers", []); 

    if (modal === "add") { LS.set("pos_suppliers", [...ss, { ...form, id: genId() }]); } 

    else { LS.set("pos_suppliers", ss.map(s => s.id === modal.id ? { ...s, ...form } : s)); } 

    setSuppliers(LS.get("pos_suppliers", [])); 

    setModal(null); notify("Saved!", "success"); 

  }; 
  const del = (id) => { if (!confirm("Delete supplier?"))
    return; 
    const updated = suppliers.filter(s => s.id !== id);
     LS.set("pos_suppliers", updated);
      setSuppliers(updated); }; 

  return ( 

    <div className="suppliers-page"
     style={{ 
      height: "100%",
       overflowY: "auto",
        background: "#0f172a", 
        padding: 24 
        }}> 

      <div className="page-toolbar"
      style={{
         display: "flex",
          alignItems: "center", 
          justifyContent: "space-between",
           marginBottom: 20
            }}> 

        <h2
         style={{ 
          color: "#fff",
          fontSize: 20, 
          fontWeight: 700,
           margin: 0 }}>
           Suppliers
           </h2> 

        <button onClick={() => { setForm({ name: "", contact: "", phone: "", address: "" });
         setModal("add"); }} 
         style={{
           padding: "8px 16px",
            borderRadius: 8,
             border: "none", 
             background: "#22c55e",
              color: "#fff",
               fontWeight: 700,
                cursor: "pointer",
                 display: "flex", 
                 alignItems: "center",
                  gap: 6 
                  }}> 

          <Icon name="plus" size={14} 
          />
           Add Supplier 
        </button> 
      </div> 
      <div
style={{ 
        display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
     gap: 16
  }}> 
        {suppliers.map(s => ( 

          <div key={s.id}
           style={{
             background: "#1e293b",
              borderRadius: 16,
               padding: 20, 
               border: "1px solid rgba(255,255,255,0.06)"
                }}> 

            <div
             style={{ 
              display: "flex", 
              justifyContent: "space-between",
               alignItems: "flex-start", 
               marginBottom: 12
                }}> 

              <div 
              style={{
                 width: 40,
                  height: 40, 
                  borderRadius: 10,
                   background: "rgba(59,130,246,0.15)",
                    display: "flex", 
                   alignItems: "center", 
                   justifyContent: "center",
                    fontSize: 20 }}>🏭
                    </div> 

              <div 
              style={{
                 display: "flex",
                  gap: 6 
                  }}> 

                <button onClick={() => { setForm({ ...s });
                 setModal(s);
                 }}
                 style={{
                   padding: "6px",
                    borderRadius: 7,
                     border: "1px solid rgba(255,255,255,0.1)",
                      background: "transparent", 
                     color: "#64748b",
                      cursor: "pointer" 
                      }}><Icon name="edit" size={14} 
                      />
                      </button> 

                <button onClick={() => del(s.id)} 
                style={{
                   padding: "6px",
                   borderRadius: 7,
                    border: "1px solid rgba(239,68,68,0.2)",
                     background: "transparent",
                     color: "#f87171", 
                     cursor: "pointer" }}><Icon name="trash" size={14} />
                     </button> 
              </div> 
            </div> 
            <div
             style={{ 
              color: "#fff",
               fontWeight: 700, 
               fontSize: 15,
                marginBottom: 8
                 }}>{s.name}
                 </div> 

            <div 
            style={{
               color: "#64748b",
                fontSize: 12,
                 lineHeight: 1.7 
                 }}> 

              📧 {s.contact || "N/A"}<br />📞 {s.phone || "N/A"}<br />📍 {s.address || "N/A"} 

            </div> 
          </div> 
        ))} 
      </div> 
      {modal && ( 
        <div className="suppliers-modal-backdrop"
        style={{ 
          position: "fixed", 
          inset: 0, background: "rgba(0,0,0,0.75)",
           zIndex: 1000,
            display: "flex",
             alignItems: "center", 
             justifyContent: "center" 
             }}> 

          <div className="suppliers-modal-card"
           style={{
             width: 440,
              background: "#1e293b",
               borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)", 
                padding: 24 
                }}> 

            <div
             style={{
               color: "#fff", 
               fontWeight: 700,
                fontSize: 16, 
                marginBottom: 20 }}>{modal === "add" ? "Add Supplier" : "Edit Supplier"}
                </div> 

            {[["name", "Supplier Name"], ["contact", "Contact Email"], ["phone", "Phone"], ["address", "Address"]].map(([k, l]) => ( 

              <div key={k} 
              style={{ 
                marginBottom: 14
                 }}> 

                <label
                 style={{
                 color: "#64748b",
                  fontSize: 12,
                   display: "block", 
                   marginBottom: 6 }}>{l}
                   </label> 

                <input value={form[k]} onChange={e => f(k, e.target.value)}
                 style={{
                   width: "100%", 
                   padding: "9px 12px",
                    borderRadius: 8,
                     border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)", 
                      color: "#fff",
                      fontSize: 13,
                       outline: "none",
                        boxSizing: "border-box" }}
                         /> 
              </div> 
            ))} 

            <div className="suppliers-modal-actions"
            style={{ 
              display: "flex", 
              gap: 10,
               marginTop: 20 
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
                   cursor: "pointer"
                    }}>Save
                    </button> 
              <button onClick={() => setModal(null)}
               style={{
                 padding: "11px 20px",
                  borderRadius: 10, 
                  border: "1px solid rgba(255,255,255,0.1)",
                   background: "transparent",
                   color: "#64748b", 
                   cursor: "pointer" 
                   }}>
                   Cancel
                   </button> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}; 
