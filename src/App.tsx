// @ts-nocheck
import './App.css' 
import { useState, useEffect, useCallback } from "react";
import { LS, seedDemoData } from "./utils/storage";
import { Icon } from "./components/Icon";
import { AuthScreen } from "./screens/AuthScreen";
import { POSScreen } from "./screens/POSScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ProductsScreen } from "./screens/ProductsScreen";
import { InventoryScreen } from "./screens/InventoryScreen";
import { SuppliersScreen } from "./screens/SuppliersScreen";
import { TransactionsScreen } from "./screens/TransactionsScreen";
import { ReportsScreen } from "./screens/ReportsScreen";
import { UsersScreen } from "./screens/UsersScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() { 

  const [user, setUser] = useState(null); 

  const [activeTab, setActiveTab] = useState("pos"); 

  const [notification, setNotification] = useState(null); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  useEffect(() => { 

    seedDemoData(); 

    const session = LS.get("pos_session"); 

    if (session) { 

      const users = LS.get("pos_users", []); 

      const u = users.find(u => u.id === session.userId); 

      if (u) setUser(u); 

    } 

  }, []); 
  
  const notify = (msg, type = "success") => { 

    setNotification({ msg, type }); 

    setTimeout(() => setNotification(null), 3000); 

  }; 

  const logout = () => { LS.del("pos_session"); setIsMobileMenuOpen(false);
   setUser(null); setActiveTab("pos"); }; 

  const selectTab = (tabId) => { setActiveTab(tabId); setIsMobileMenuOpen(false); }; 

  const settings = LS.get("pos_settings", {}); 

  if (!user) return <AuthScreen onLogin={u => { setUser(u); setActiveTab(u.role === "admin" ? "dashboard" : "pos"); }} />; 

  const navItems = [ 

    { id: "pos", label: "POS", icon: "scan", roles: ["admin", "cashier"] }, 

    { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["admin"] }, 

    { id: "products", label: "Products", icon: "product", roles: ["admin"] }, 

    { id: "inventory", label: "Inventory", icon: "alert", roles: ["admin"] }, 

    { id: "suppliers", label: "Suppliers", icon: "supplier", roles: ["admin"] }, 

    { id: "transactions", label: "History", icon: "history", roles: ["admin", "cashier"] }, 

    { id: "reports", label: "Reports", icon: "report", roles: ["admin"] }, 

    { id: "users", label: "Users", icon: "users", roles: ["admin"] }, 

    { id: "settings", label: "Settings", icon: "settings", roles: ["admin"] }, 

  ].filter(n => n.roles.includes(user.role)); 
  return ( 
    <div className={`app-shell ${isMobileMenuOpen ? "mobile-menu-open" : ""}`} 
    style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0f172a", overflow: "hidden" }}> 

      {isMobileMenuOpen && <button className="mobile-menu-backdrop" aria-label="Close navigation menu" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */} 

      <div className="app-sidebar" style={{ width: 200, background: "#1e293b", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", flexShrink: 0 }}> 

        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}> 

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}> 
            <span style={{ fontSize: 28 }}>🛒</span> 
            <div> 
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{(settings.storeName || "Fevy").split(" ")[0]}</div> 
              <div style={{ color: "#22c55e", fontSize: 10, fontWeight: 600 }}>POS System</div> 
            </div> 
          </div> 
          <button className="mobile-menu-close" aria-label="Close navigation menu" onClick={() => setIsMobileMenuOpen(false)} type="button">
            <Icon name="x" size={18} />
          </button>
        </div> 
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}> 
          {navItems.map(n => ( 
            <button key={n.id} onClick={() => selectTab(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, transition: "all 0.15s", background: activeTab === n.id ? "rgba(34,197,94,0.15)" : "transparent", color: activeTab === n.id ? "#22c55e" : "rgba(255,255,255,0.55)", fontWeight: activeTab === n.id ? 600 : 400, fontSize: 13 }}> 
              <Icon name={n.icon} size={16} /> 
              {n.label} 
            </button> 
          ))} 
        </div> 
        <div 
        style={{
           padding: "12px 8px", 
           borderTop: "1px solid rgba(255,255,255,0.05)"
            }}> 
          <div
           style={{
             padding: "10px 12px",
              marginBottom: 4
               }}> 
            <div
             style={{
               color: "#fff",
                fontSize: 13,
                 fontWeight: 600
                  }}>{user.name}
                  </div> 
            <div 
            style={{ 
              color: "#22c55e", 
              fontSize: 11,
               textTransform: "uppercase",
                letterSpacing: 1 }}>{user.role}
                </div> 
          </div> 
          <button onClick={logout} 
          style={{
             width: "100%", 
             display: "flex", 
             alignItems: "center",
              gap: 10,
               padding: "10px 12px",
                borderRadius: 10,
                 border: "none", 
                 cursor: "pointer", 
                 background: "rgba(239,68,68,0.1)", 
                 color: "#f87171", fontSize: 13, 
                 fontWeight: 600 
                 }}> 
            <Icon name="logout" size={16} />
             Sign Out 
          </button> 
        </div> 
      </div> 
      {/* Main Content */} 
      <div className="app-main" 
      style={{
         flex: 1, 
         overflow: "hidden",
          display: "flex",
           flexDirection: "column"
            }}> 

        <div className="mobile-topbar">
          <button className="hamburger-button" aria-label="Open navigation menu" onClick={() => setIsMobileMenuOpen(true)} type="button">
            <span />
            <span />
            <span />
          </button>
          <div>
            <div 
            className="mobile-store-name">
              {settings.storeName || "Fevy POS System"}
              </div>
            <div
             className="mobile-active-tab">
              {navItems.find(n => n.id === activeTab)?.label || "POS"}
             </div>
          </div>
        </div>

        {activeTab === "pos" && <POSScreen user={user} settings={settings} notify={notify} />} 

        {activeTab === "dashboard" && <DashboardScreen settings={settings} />} 

        {activeTab === "products" && <ProductsScreen notify={notify} settings={settings} />} 

        {activeTab === "inventory" && <InventoryScreen settings={settings} notify={notify} />} 

        {activeTab === "suppliers" && <SuppliersScreen notify={notify} />} 

        {activeTab === "transactions" && <TransactionsScreen settings={settings} user={user} notify={notify} />} 

        {activeTab === "reports" && <ReportsScreen settings={settings} />} 
        {activeTab === "users" && <UsersScreen notify={notify} currentUser={user} />} 
        {activeTab === "settings" && <SettingsScreen notify={notify} settings={settings} />} 
      </div> 
      {/* Notification Toast */} 
      {notification && ( 
        <div className="notification-toast"
        style={{ 
          position: "fixed", 
          top: 20,
           right: 20,
            zIndex: 9999,
             padding: "14px 20px",
              borderRadius: 12, 
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
               maxWidth: 320, fontSize: 14, 
               fontWeight: 600, transition: "all 0.3s", 
               background: notification.type === "success" ? "#16a34a" : notification.type === "error" ? "#dc2626" : "#d97706",
                color: "#fff"
                 }}> 
          {notification.msg} 
        </div> 
      )} 
    </div> 
  ); 
} 
