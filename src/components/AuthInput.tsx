// component props 
export const AuthInput = ({ 
  // receiving props 
  label,
   value,
    onChange, 
    placeholder,
    type = "text" 
}) => ( 
  
  <div> 
    {label}
<label 
      style={{ 
      color: "rgba(255,255,255,0.7)", 
      fontSize: 12, 
      fontWeight: 600, 
      display: "block", 
      marginBottom: 6
       }}>  
</label> 
<input type={type} value={value} 
// onchange Runs whenever the user types something.
onChange={e => onChange(e.target.value)} 
    placeholder={placeholder} 
style={{
         width: "100%", 
        padding: "10px 12px", 
        borderRadius: 10,
         border: "1px solid rgba(255,255,255,0.15", 
         background: "rgba(255,255,255,0.08)", 
         color: "#fff", 
         fontSize: 14, 
         outline: "none", 
         boxSizing: "border-box" 
         
         
}}
 
    /> 
    
  </div> 
  
); 