import { useState } from "react";
import { LS } from "../utils/storage";
export const SettingsScreen = ({ notify, 
  settings: initialSettings }) => { 
  const [form, setForm] = useState(initialSettings || {}); 

  const f = (k, v) =>
     setForm(p => ({ ...p, [k]: v })
    ); 
  const save = () => { 
    LS.set("pos_settings", form); 
    notify("Settings saved! Refresh to apply store name.", "success"); 
  }; 
  const resetAll = () => { 
    if (!confirm("Reset ALL data? This cannot be undone!")) 
      return; 
    ["pos_users",
       "pos_products", 
       "pos_suppliers",
        "pos_settings", 
        "pos_transactions",
         "pos_session", 
         "pos_seeded"].forEach(k => LS.del(k)); 
    window.location.reload(); 
  }; 
  const fields = [ 
    ["storeName", "Store Name", "text"], ["storeAddress", "Store Address", "text"], ["storePhone", "Phone Number", "text"], 
    ["storeEmail", "Email Address", "email"], ["currency", "Currency Symbol", "text"], ["taxRate", "Tax Rate (%)", "number"], 
    ["receiptFooter", "Receipt Footer Message", "text"], 
  ]; 
  return ( 
    <div className="settings-page"
    style={{ 
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
           margin: "0 0 24px" 
           }}>System Settings
           </h2> 
      <div
       style={{ 
        maxWidth: 600 
        }}> 
        <div className="settings-card"
        style={{
           background: "#1e293b",
            borderRadius: 16, 
            padding: 24,
             border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20
              }}> 
          <div
           style={{
             color: "#fff",
              fontWeight: 700,
               marginBottom: 20 
               }}>Store Information</div> 
          {fields.map(([k, l, t]) => ( 
            <div key={k} 
            style={{
               marginBottom: 16 }}> 
              <label style={{
                 color: "#64748b",
                  fontSize: 12, 
                  display: "block",
                   marginBottom: 6 }}>{l}</label> 
              <input type={t} value={form[k] || ""} 
              onChange={e => f(k, e.target.value)} 
              style={{
                 width: "100%",
                  padding: "10px 12px",
                   borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", 
                    fontSize: 13,
                     outline: "none", 
                     boxSizing: "border-box" 
                     }} /> 
            </div> 
          ))} 
          <button onClick={save}
           style={{
             padding: "11px 24px",
              borderRadius: 10, 
              border: "none", 
              background: "#22c55e", 
              color: "#fff",
               fontWeight: 700,
                cursor: "pointer", 
                fontSize: 14 }}>Save Settings</button> 
        </div> 
        <div className="settings-card" style={{
           background: "#1e293b",
            borderRadius: 16,
             padding: 24,
              border: "1px solid rgba(239,68,68,0.2)"
               }}> 
          <div 
          style={{
             color: "#f87171",
              fontWeight: 700,
               marginBottom: 8
                }}>Danger Zone</div> 
          <div
           style={{
             color: "#64748b", 
             fontSize: 13,
              marginBottom: 16
               }}>Reset all data including products, transactions, and users. This cannot be undone.</div> 
          <button onClick={resetAll} 
          style={{ 
            padding: "10px 20px", 
            borderRadius: 10,
             border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)",
              color: "#f87171",
               fontWeight: 700, 
               cursor: "pointer", 
               fontSize: 13 }}>Reset All Data</button> 
        </div> 
      </div> 
    </div> 
  ); 
};
