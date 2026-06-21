// @ts-nocheck 
import { useState } from "react";
import { LS } from "../utils/storage";
import { genId } from "../utils/format";
import { AuthInput } from "../components/AuthInput";

export const AuthScreen = ({ onLogin }) => { 
  const [mode, setMode] = useState("login");
   // login | register | forgot 
  const [form, setForm] = useState({ username: "",
     pin: "",
      confirmPin: "", 
      name: "", 
      email: "", 
      role: "cashier",
      securityQ: "", 
       securityA: ""
       }); 

  const [error, setError] = useState(""); 

  const [success, setSuccess] = useState(""); 

  const [loading, setLoading] = useState(false);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v
   })); 
  

  // LOGIN PAGE 
  const handleLogin = () => { 
    setError(""); 
    setLoading(true); 
    setTimeout(() => { 
      const users = LS.get("pos_users", []);
      const user = users.find(u => u.username === form.username && u.pin === form.pin); 
      if (user) { LS.set("pos_session", { userId: user.id, loginAt: Date.now() 
          }); 
        onLogin(user);
         } 
      else setError("Invalid username or PIN."); 
      setLoading(false); 
    }, 400); 
  }; 
// REGISTER ACCOUNT 
  const handleRegister = () => { 
    setError(""); 
    if (!form.username || !form.pin || !form.name) 
      return setError("All fields required"); 
    if (form.pin.length !== 4 || !/^\d+$/.test(form.pin)) 
      // Only numbers allowed and it should be four 
      return setError("PIN must be exactly 4 digits"); 
    if (form.pin !== form.confirmPin) 
      return setError("PINs do not match"); 
    const users = LS.get("pos_users", []); 
    if (users.find(u => u.username === form.username))
       return setError("Username already exists"); 
    const newUser = { id: genId(), 
      username: form.username, 
      pin: form.pin, 
      role: form.role,
       name: form.name, 
       email: form.email, 
       securityQ: form.securityQ, 
       securityA: form.securityA, 
       createdAt: Date.now() 
      }; 
    LS.set("pos_users", [...users, newUser]); 
    setSuccess("Account created!."); setMode("login"); 
  }; 

//  FORGET PASSWORD 
  const handleForgot = () => { 
    setError(""); 
    const users = LS.get("pos_users", []); 
    const user = users.find(u => u.username === form.username); 
    if (!user) 
      return setError("Username not found"); 
    if (!user.securityA || user.securityA.toLowerCase() !== form.securityA.toLowerCase()) 
      return setError("Security answer incorrect"); 
    setSuccess(`Your PIN is: ${user.pin}`); 
  }; 
  
  return ( 
     <div className="auth-page" style={{ 
      minHeight: "100vh", 
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2027 100%)",
     display: "flex",
      alignItems: "center",
       justifyContent: "center", 
     fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}> 
      <div className="auth-card" style={{
         width: 420,
          background: "rgba(255,255,255,0.05)",
         backdropFilter: "blur(20px)", 
         border: "1px solid rgba(255,255,255,0.12)", 
         borderRadius: 20, 
         padding: 40,
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)" 
          }}> 
        {/* Logo */} 
        <div style={{ 
          textAlign: "center",
           marginBottom: 32 
           }}> 
          <div style={{ 
            width: 64,
             height: 64,
              background: "linear-gradient(135deg, #22c55e, #16a34a)", 
              borderRadius: 16, 
              display: "flex",
               alignItems: "center", 
               justifyContent: "center",
                margin: "0 auto 16px", 
                fontSize: 32 
                }}>🛒</div> 
          <h1 style={{ 
            color: "#fff",
             fontSize: 24,
              fontWeight: 700,
               margin: 0 
               }}>Fevy POS</h1> 
          <p style={{ 
            color: "rgba(255,255,255,0.5)", 
            fontSize: 13, 
            margin: "6px 0 0" 
            }}> 
            {mode === "login" ? "Sign in to your account" : mode === "register" ? "Create new account" : "Reset your PIN"} 
          </p> 
        </div> 
        {/* Tabs */} 
        <div style={{
           display: "flex",
            gap: 8, 
            marginBottom: 24,
             background: "rgba(255,255,255,0.05)", 
             borderRadius: 10, 
             padding: 4 
             }}> 
          {["login",
           "register"].map(m => ( 
            <button key={m} 
            onClick={() => { setMode(m);
             setError(""); 
             setSuccess("");
              }} 
              style={{
                 flex: 1,
                  padding: "8px",
                   borderRadius: 8, 
                   border: "none",
                    cursor: "pointer",
                     fontWeight: 600,
                      fontSize: 13, 
                      transition: "all 0.2s", 
                      background: mode === m ? "rgba(34,197,94,0.9)" : "transparent",
                       color: mode === m ? "#fff" : "rgba(255,255,255,0.5)"
                        }}> 
              {m === "login" ? "Sign In" : "Sign Up"} 
            </button> 
          ))} 
        </div> 
        {/* Fields */} 
        <div style={{ 
          display: "flex",
           flexDirection: "column", 
           gap: 14
            }}> 
          {mode === "register" && ( 
            <> 
              <AuthInput label="Full Name" value={form.name} onChange={v => f("name",
                 v)}
                //  v means varible It represents the new value typed into the input box
                  placeholder="Felix Akin" /> 
              <AuthInput label="Email" value={form.email} onChange={v => f("email", 
                v)} placeholder="felix@store.com" type="email" /> 
              <div> 
                <label style={{ color: "rgba(255,255,255,0.7)", 
                  fontSize: 12, 
                  fontWeight: 600,
                   display: "block",
                    marginBottom: 6
                     }}>Role</label> 
                <select value={form.role} onChange={e => f("role", 
                  e.target.value)} style={{ width: "100%",
                   padding: "10px 12px", 
                   borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                     background: "rgba(255,255,255,0.08)", 
                     color: "#fff", 
                     fontSize: 14,
                      outline: "none"
                       }}> 
                  <option value="cashier" 
                  style={{
                     background: "#1e293b" 
                     }}>
                      Cashier
                     </option> 
                  <option 
                  value="admin"
                   style={{
                     background: "#1e293b" 
                     }}>Admin
                     </option> 
                </select> 
              </div> 
            </> 
          )} 
          <AuthInput label="Username" value={form.username} onChange={v => f("username", 
            v)} placeholder="Enter username" /> 
          {mode !== "forgot" && <AuthInput label="4-Digit PIN" value={form.pin} onChange={v => f("pin",
             v.slice(0, 4))}
              placeholder="****" type="password" 
              />} 

          {mode === "register" && <AuthInput label="Confirm PIN" value={form.confirmPin} onChange={v => f("confirmPin", 
            v.slice(0, 4))} placeholder="****" type="password" />} 
          {mode === "register" && ( 
            <> 
              <AuthInput label="Security Question" value={form.securityQ} onChange={v => f("securityQ", v)} placeholder="e.g. What is your mother's maiden name?" /> 
              <AuthInput label="Security Answer" value={form.securityA} onChange={v => f("securityA", v)} placeholder="Your answer" /> 
            </> 
          )} 
          {mode === "forgot" && <AuthInput label="Security Answer" value={form.securityA} onChange={v => f("securityA", v)} placeholder="Your answer" />} 
        </div> 
        {error &&
         <div 
         style={{ 
          background: "rgba(239,68,68,0.15)",
           border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, 
            padding: "10px 14px",
             color: "#fca5a5",
              fontSize: 13,
               marginTop: 16 
               }}>{error}</div>} 
        {success && <div 
        style={{ 
          background: "rgba(34,197,94,0.15)",
           border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 10, 
            padding: "10px 14px",
             color: "#86efac",
              fontSize: 13,
               marginTop: 16 
               }}>{success}
               </div>} 
        <button 
        onClick={mode === "login" 
          ? handleLogin 
          : mode === "register"
           ? handleRegister : 
           handleForgot} 
           disabled={loading} 
          style={{ 
            width: "100%",
           marginTop: 20,
            padding: "12px",
             borderRadius: 10, 
             border: "none",
              cursor: loading ? "not-allowed" : "pointer",
               fontWeight: 700,
                fontSize: 15,
                 background: loading ? "rgba(34,197,94,0.4)" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", 
                 transition: "all 0.2s"
                  }}> 
          {loading
           ? "Signing in..."
            : mode === "login"
             ? "Sign In →" 
             : mode === "register" 
             ? "Create Account"
              : "Recover PIN"
              } 
        </button> 
        {mode === "login" && ( 
          <button onClick={() => { setMode("forgot");
             setError("");
             }}
              style={{ width: "100%", 
              marginTop: 10,
               padding: "8px",
                background: "transparent",
                 border: "none", 
                 color: "rgba(255,255,255,0.4)",
                  fontSize: 13, 
                  cursor: "pointer" 
                }}>Forgot PIN?</button> 
        )} 
        {mode !== "login" && ( 
          <button onClick={() => { setMode("login");
             setError("");
              setSuccess("");
             }} 
             style={{
               width: "100%",
               marginTop: 10, 
               padding: "8px",
                background: "transparent", 
                border: "none", 
                color: "rgba(255,255,255,0.4)",
                 fontSize: 13, 
                 cursor: "pointer" 
                }}>← Back to Sign In</button> 
        )} 
      </div> 
    </div> 
  ); 
};
