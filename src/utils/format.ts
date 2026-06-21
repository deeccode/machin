 
export const genId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export const fmt =
 (n, cur = "₦") => `${cur}${Number(n).toLocaleString("en-NG",
     {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
})}`;

export const fmtDate = 
(ts) => new Date(ts).toLocaleString("en-NG",
     { dateStyle: "medium",
         timeStyle: "short"
         }); 

 
