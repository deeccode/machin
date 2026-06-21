// @ts-nocheck 
export const LS = { 
  get: (k, fallback = null) => { 
// read data 
    try {
       const v = localStorage.getItem(k);
       return v ? JSON.parse(v) : fallback; } catch { return fallback; } 
  }, 
// save data 
// k means name of the data 
// v means value the data you want to save 
 set: (k, v) => {
  try {
    const data = JSON.stringify(v);
    // remember localStorage can only store text so u must convert the value first by using JSON.stringify 
    localStorage.setItem(k, data);
    // console.log(data);
  }
   catch (err) {
    console.error("Failed to save:", err);
  }
},
// delete item 
  del: (k) => { try { 
    localStorage.removeItem(k); 
  } catch {} }, 

}; 

//  Seed Data

export const seedDemoData = () => { 

  if (LS.get("pos_seeded")) 
    return; 
  const users = [ 

    { id: "u1", 
      username: "admin", 
      pin: "1234", 
      role: "admin", 
      name: "Store Admin", 
      email: "felix@store.com", 
      createdAt: Date.now() 
    }, 

    { id: "u2", 
      username: "cashier", 
      pin: "1122", 
      role: "cashier",
       name: "Jane Cashier", 
       email: "Jane1221@gmail.com",
        createdAt: Date.now()
       }, 

  ]; 

  const products = [ 

    { id: "p1", 
      barcode: "5901234123457",
       name: "Oreo Cookies",
        category: "Snacks",
         price: 250, 
         cost: 150, 
         stock: 45, 
         minStock: 10, 
         unit: "pcs", 
         image: "", 
         supplier: "sup1",
          description: "Chocolate sandwich cookies"
         }, 

    { id: "p2",
       barcode: "4006381333931", 
       name: "Nestle KitKat", 
       category: "Snacks", 
       price: 180, 
       cost: 100, 
       stock: 30,
        minStock: 15, 
        unit: "pcs", 
        image: "",
         supplier: "sup1",
          description: "Chocolate wafer bar" 
        }, 

    { id: "p3", 
      barcode: "0012000161155",
       name: "Pepsi 500ml",
        category: "Beverages",
         price: 200, 
         cost: 120,
          stock: 60, 
          minStock: 20, 
          unit: "bottle", 
          image: "", 
          supplier: "sup2",
           description: "Carbonated soft drink"
           }, 

    { id: "p4", 
      barcode: "0049000050202",
       name: "Coca Cola 500ml",
        category: "Beverages",
         price: 200, cost: 120,
          stock: 8,
           minStock: 20, 
           unit: "bottle",
            image: "", 
            supplier: "sup2", 
            description: "Classic cola drink"
           }, 
    { id: "p5",
       barcode: "8901030878706", 
       name: "Maggi Noodles", 
       category: "Food", 
       price: 150, 
       cost: 80,
        stock: 0, 
        minStock: 15,
         unit: "pack", 
         image: "", 
         supplier: "sup3", 
         description: "Instant noodles"
         }, 

    { id: "p6", 
       barcode: "7622210100054",
        name: "Toblerone 100g",
        category: "Snacks",
         price: 850, 
         cost: 500, 
         stock: 20, 
         minStock: 5, 
         unit: "pcs",
          image: "", 
          supplier: "sup1",
           description: "Swiss milk chocolate"
           }, 

    { id: "p7", 
      barcode: "5000112546415", 
      name: "Cadbury Dairy Milk", 
      category: "Snacks",
       price: 300, 
       cost: 180,
        stock: 50, 
        minStock: 10, 
        unit: "pcs", 
        image: "", 
        supplier: "sup1",
         description: "Milk chocolate bar" 
        }, 


    { id: "p8",
       barcode: "0038000138416", 
       name: "Kellogg's Cornflakes", 
       category: "Food",
        price: 650, 
        cost: 380, 
        stock: 12, 
        minStock: 8, 
        unit: "box",
         image: "", 
         supplier: "sup3",
          description: "Breakfast cereal"
      }, 

    { id: "p9", 
      barcode: "8904004400054", 
     name: "Bru Coffee 200g", 
      category: "Beverages", 
      price: 420, 
      cost: 250, 
      stock: 18,
     minStock: 5, unit: "jar",
     image: "", supplier: "sup2",
     description: "Instant coffee" 
    }, 

    { id: "p10",
     barcode: "8901058850026", 
      name: "Surf Excel 1kg", 
      category: "Household", 
      price: 550, 
      cost: 320, 
      stock: 25,
       minStock: 8, 
       unit: "pack", 
       image: "", 
       supplier: "sup4",
        description: "Laundry detergent" 
      }, 

      { id: "p11", 
      barcode: "5200132546415", 
      name: "Fanta", 
      category: "Drinks",
       price: 300, 
       cost: 180,
        stock: 50, 
        minStock: 10, 
        unit: "pcs", 
        image: "", 
        supplier: "sup1",
         description: "fanta" 
        }, 
  ]; 

  const suppliers = [ 
    { id: "sup1", 
      name: "Global Snacks Co.", 
      contact: "snacks@global.com", 
      phone: "+234-801-001-0001", 
      address: "10 Wuse, Abuja"
     }, 

    { id: "sup2",
       name: "Beverages Plus", 
       contact: "info@bevplus.com", 
       phone: "+234-802-002-0002",
        address: "20 Garki, Abuja" 
      }, 

    { id: "sup3", 
      name: "Food Essentials Ltd", 
      contact: "order@foodess.com", 
      phone: "+234-803-003-0003", 
      address: "15 Maitama, Abuja"
     }, 

    { id: "sup4", 
      name: "Home Goods Nigeria",
       contact: "hq@homegoods.ng",
        phone: "+234-804-004-0004", 
        address: "5 Asokoro, Ekiti" 
      }, 

  ]; 

  const settings = { 

    storeName: "FevyMart Supermarket", 
    storeAddress: "Oda Road, Akure Ondo, Ondo State", 
    storePhone: "+234-91-676-355455", 

    storeEmail: "Boluwajiakinsanmi5@gmail.com",
     currency: "₦", 
     taxRate: 7.5,
      receiptFooter: "Thank you for shopping with us!", 
      loyaltyEnabled: false, 

  }; 

  LS.set("pos_users", users); 

  LS.set("pos_products", products); 

  LS.set("pos_suppliers", suppliers); 

  LS.set("pos_settings",  settings); 

  LS.set("pos_transactions",[]); 

  LS.set("pos_seeded",true); 
}; 
// explain this codes line by line to me like a 5 years old baby after finish explaining  tell me what all the  codes does in one sentence