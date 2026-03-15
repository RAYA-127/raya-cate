const { v4: uuidv4 } = require('uuid');

// In-memory stores
const store = {
  users: [
    {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@rentease.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'admin',
      phone: '9999999999',
      address: 'RentEase HQ, Hyderabad'
    }
  ],
  products: [
    { id: 'p1', name: 'Premium Sofa Set', category: 'Furniture', description: '3+2 seater premium sofa set in leatherette finish. Comfortable and stylish.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', price3: 999, price6: 899, price12: 799, deposit: 2000, available: true, featured: true, rating: 4.5, reviews: 128 },
    { id: 'p2', name: 'King Size Bed with Storage', category: 'Furniture', description: 'Spacious king size bed with hydraulic storage. Includes mattress.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500', price3: 1299, price6: 1099, price12: 999, deposit: 3000, available: true, featured: true, rating: 4.7, reviews: 95 },
    { id: 'p3', name: 'LG 1.5 Ton Split AC', category: 'Appliances', description: '5-star rated inverter AC with auto-clean technology. Energy efficient.', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', price3: 1499, price6: 1299, price12: 1199, deposit: 3500, available: true, featured: true, rating: 4.6, reviews: 210 },
    { id: 'p4', name: 'Samsung 253L Refrigerator', category: 'Appliances', description: 'Double door frost-free refrigerator with digital inverter compressor.', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500', price3: 999, price6: 849, price12: 749, deposit: 2500, available: true, featured: false, rating: 4.4, reviews: 167 },
    { id: 'p5', name: 'Samsung 55" 4K Smart TV', category: 'Electronics', description: 'Crystal 4K UHD TV with HDR and smart features. Wall mount included.', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500', price3: 1799, price6: 1599, price12: 1399, deposit: 4000, available: true, featured: true, rating: 4.8, reviews: 312 },
    { id: 'p6', name: 'Fully Automatic Washing Machine', category: 'Appliances', description: '7.5kg front load washing machine with 15 wash programs.', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500', price3: 1199, price6: 999, price12: 899, deposit: 3000, available: true, featured: false, rating: 4.3, reviews: 88 },
    { id: 'p7', name: 'Study Table & Chair Set', category: 'Furniture', description: 'Ergonomic study table with adjustable chair. Ideal for WFH.', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500', price3: 499, price6: 449, price12: 399, deposit: 1000, available: true, featured: false, rating: 4.2, reviews: 54 },
    { id: 'p8', name: 'Laptop - Dell Inspiron 15', category: 'Electronics', description: 'Intel i5, 8GB RAM, 512GB SSD. Perfect for work and study.', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', price3: 2499, price6: 2199, price12: 1999, deposit: 5000, available: true, featured: true, rating: 4.5, reviews: 143 },
    { id: 'p9', name: 'Dining Table 6 Seater', category: 'Furniture', description: 'Solid wood 6-seater dining table with cushioned chairs.', image: 'https://images.unsplash.com/photo-1615066831168-8d5dc4c1b5b2?w=500', price3: 899, price6: 799, price12: 699, deposit: 2000, available: true, featured: false, rating: 4.1, reviews: 37 },
    { id: 'p10', name: 'Microwave Oven 28L', category: 'Appliances', description: 'Convection microwave with grill function. 28L capacity.', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500', price3: 599, price6: 499, price12: 449, deposit: 1500, available: true, featured: false, rating: 4.0, reviews: 62 },
    { id: 'p11', name: 'Office Chair Ergonomic', category: 'Furniture', description: 'Mesh back ergonomic office chair with lumbar support and armrests.', image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500', price3: 399, price6: 349, price12: 299, deposit: 800, available: true, featured: false, rating: 4.4, reviews: 91 },
    { id: 'p12', name: 'iPad Pro 11"', category: 'Electronics', description: 'M2 chip, 128GB, WiFi. Includes Apple Pencil and keyboard case.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', price3: 2999, price6: 2699, price12: 2399, deposit: 6000, available: true, featured: false, rating: 4.9, reviews: 228 },
  ],
  carts: {},      // userId -> [{productId, tenure, qty}]
  rentals: [],
  orders: [],
  maintenance: [],
};

module.exports = { store, uuidv4 };
