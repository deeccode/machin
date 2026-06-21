import { useState } from "react";
import { LS } from "../utils/storage";
import { genId } from "../utils/format";
import { Icon } from "../components/Icon";

export const UsersScreen = ({ notify, currentUser }) => { 

  const [users, setUsers] = useState(LS.get("pos_users", [])); 

  const [modal, setModal] = useState(null); 

  const [form, setForm] = useState({ username: "", name: "", email: "", pin: "", role: "cashier" }); 

  const f = (k, v) => setForm(p => ({ ...p, [k]: v })); 
  const save = () => { 

    if (!form.name || !form.username || !form.pin) { notify("Name, username, and PIN required", "error"); return; } 

    if (form.pin.length !== 4 || !/^\d+$/.test(form.pin)) { notify("PIN must be 4 digits", "error"); return; } 

    const us = LS.get("pos_users", []); 

    if (modal === "add") { 

      if (us.find(u => u.username === form.username)) { notify("Username exists", "error"); return; } 

      LS.set("pos_users", [...us, { ...form, id: genId(), createdAt: Date.now() }]); 

    } else { 

      LS.set("pos_users", us.map(u => u.id === modal.id ? { ...u, ...form } : u)); 

    } 

    setUsers(LS.get("pos_users", [])); 

    setModal(null); notify("Saved!", "success"); 

  }; 
  const del = (id) => { 

    if (id === currentUser.id) { notify("Cannot delete yourself", "error"); return; } 

    if (!confirm("Delete user?")) return; 

    const updated = users.filter(u => u.id !== id); 

    LS.set("pos_users", updated); setUsers(updated); 

  }; 

 

  return ( 

    <div className="users-page"
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
              User Management
             </h2> 

        <button onClick={() => { setForm({ username: "",
           name: "",
            email: "",
             pin: "", role: "cashier" }); 
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

          <Icon name="plus" size={14} /> Add User 

        </button> 

      </div> 
      <div
       style={{
         display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
          gap: 16 
          }}> 

        {users.map(u => ( 

          <div key={u.id} 
          style={{
             background: "#1e293b",
              borderRadius: 16,
               padding: 20,
                border: `1px solid ${u.id === currentUser.id ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}` 
                }}> 

            <div 
            style={{
               display: "flex",
                alignItems: "flex-start", 
                justifyContent: "space-between",
                 marginBottom: 14 
                 }}> 

              <div 
              style={{ 
                display: "flex",
                 alignItems: "center",
                  gap: 12
                   }}> 

                <div 
                style={{
                   width: 44, 
                   height: 44,
                    borderRadius: 12,
                     background: u.role === "admin" ? "rgba(168,85,247,0.2)" : "rgba(34,197,94,0.15)", display: "flex",
                      alignItems: "center", 
                      justifyContent: "center",
                       color: u.role === "admin" ? "#c084fc" : "#4ade80", 
                       fontWeight: 700, fontSize: 16
                        }}> 

                  {u.name[0].toUpperCase()} 

                </div> 

                <div> 

                  <div 
                  style={{
                     color: "#fff",
                      fontWeight: 700, 
                      fontSize: 14 }}>{u.name}
                      </div> 
                  <div 
                  style={{
                     color: "#64748b",
                      fontSize: 11 }}>@{u.username}
                      </div> 

                </div> 

              </div> 

              {u.id !== currentUser.id && ( 

                <div 
                style={{ 
                  display: "flex",
                   gap: 4 
                   }}> 

                  <button onClick={() => { setForm({ ...u }); setModal(u); }} 
                  style={{
                     padding: "5px",
                      borderRadius: 6,
                       border: "1px solid rgba(255,255,255,0.1)", 
                       background: "transparent", 
                       color: "#64748b",
                        cursor: "pointer" 
                        }}><Icon name="edit" size={13} />
                        </button> 

                  <button onClick={() => del(u.id)}
                   style={{
                     padding: "5px",
                      borderRadius: 6,
                       border: "1px solid rgba(239,68,68,0.2)", 
                       background: "transparent",
                        color: "#f87171", 
                        cursor: "pointer" 
                        }}><Icon name="trash" size={13} />
                        </button> 

                </div> 

              )} 

            </div> 

            <div
             style={{ 
              display: "flex",
               gap: 6
                }}> 

              <span 
              style={{
                 padding: "3px 10px",
                  borderRadius: 6,
                   background: u.role === "admin" ? "rgba(168,85,247,0.15)" : "rgba(34,197,94,0.15)", color: u.role === "admin" ? "#c084fc" : "#4ade80",
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{u.role}
                    </span> 

              {u.id === currentUser.id &&
               <span 
               style={{ 
                padding: "3px 10px",
                borderRadius: 6, 
                background: "rgba(34,197,94,0.1)",
                 color: "#22c55e", fontSize: 11 
                 }}>You
                 </span>} 

              {u.email &&
               <span
                style={{
                   padding: "3px 10px",
                    borderRadius: 6, 
                    background: "rgba(255,255,255,0.05)",
                     color: "#64748b", 
                     fontSize: 11 }}>{u.email}
                     </span>} 
            </div> 
            <div
             style={{
               color: "#334155",
                fontSize: 11, 
                marginTop: 10 
                }}>Joined {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                </div> 
          </div> 
        ))} 
      </div> 
      {modal && ( 
        <div className="users-modal-backdrop"
         style={{ 
          position: "fixed",
           inset: 0,
            background: "rgba(0,0,0,0.75)",
             zIndex: 1000, 
             display: "flex", 
             alignItems: "center", 
             justifyContent: "center" 
             }}> 

          <div className="users-modal-card"
          style={{
             width: 420,
              background: "#1e293b", 
              borderRadius: 20,
               border: "1px solid rgba(255,255,255,0.1)",
                padding: 24 
                }}> 
            <div className="users-modal-actions"
            style={{
               color: "#fff",
                fontWeight: 700,
                 fontSize: 16,
                  marginBottom: 20
                   }}>{modal === "add" ? "Add User" : "Edit User"}
                   </div> 

            {[["name", "Full Name", "text"], ["username", "Username", "text"], ["email", "Email", "email"], ["pin", "4-Digit PIN", "password"]].map(([k, l, t]) => ( 

              <div key={k} 
              style={{ marginBottom: 14 }}> 

                <label
                 style={{
                   color: "#64748b", 
                   fontSize: 12, 
                   display: "block",
                    marginBottom: 6 
                    }}>{l}
                    </label> 

                <input type={t} value={form[k]} onChange={e => f(k, e.target.value)} maxLength={k === "pin" ? 4 : undefined}
                 style={{ 
                  width: "100%",
                   padding: "9px 12px",
                    borderRadius: 8, 
                    border: "1px solid rgba(255,255,255,0.1)",
                     background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                       fontSize: 13,
                        outline: "none",
                         boxSizing: "border-box" 
                         }} /> 
              </div> 
            ))} 

            <div
             style={{ 
              marginBottom: 20
               }}> 

              <label 
              style={{
                 color: "#64748b", 
                 fontSize: 12,
                  display: "block",
                   marginBottom: 6 
                   }}>Role
                   </label> 

              <select value={form.role} onChange={e => f("role", e.target.value)} 
              style={{
                 width: "100%",
                  padding: "9px 12px",
                   borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                     background: "rgba(255,255,255,0.05)",
                      color: "#94a3b8", fontSize: 13 
                      }}> 

                <option value="cashier"
                 style={{ background: "#1e293b" }}>Cashier
                 </option> 

                <option value="admin" 
                style={{ background: "#1e293b" 
                }}>Admin
                </option> 
              </select> 
            </div> 
            <div 
            style={{ 
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
                      }}>Cancel
                      </button> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}; 
