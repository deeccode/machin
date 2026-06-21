// @ts-nocheck
export const SummaryRow = ({ 
  label,
   value,
    muted
   }) => (
  <div
   style={{
     display: "flex",
   justifyContent: "space-between",
    alignItems: "center",
     gap: 12 
     }}>
    <span 
    style={{
       color: "#64748b",
        fontSize: 13 
        }}>
          {label}
        </span>
<span 
style={{
       color: muted ? "#64748b" : "#e2e8f0",
        fontSize: 13, 
        fontWeight: 600,
         textAlign: "right"
          }}>
            {value}
 </span>
  </div>
);
