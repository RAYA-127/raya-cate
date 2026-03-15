import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'rentease_secret_2024';

const store = {
  users: [{
    id:'admin-001', name:'Admin User', email:'admin@rentease.com',
    password:'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role:'admin', phone:'9999999999', address:'RentEase HQ, Hyderabad'
  }],
  products:[
    {id:'p1',name:'Premium Sofa Set',category:'Furniture',description:'3+2 seater premium sofa set in leatherette finish. Comfortable and stylish.',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',price3:999,price6:899,price12:799,deposit:2000,available:true,featured:true,rating:4.5,reviews:128},
    {id:'p2',name:'King Size Bed with Storage',category:'Furniture',description:'Spacious king size bed with hydraulic storage. Includes mattress.',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',price3:1299,price6:1099,price12:999,deposit:3000,available:true,featured:true,rating:4.7,reviews:95},
    {id:'p3',name:'LG 1.5 Ton Split AC',category:'Appliances',description:'5-star rated inverter AC with auto-clean technology.',image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',price3:1499,price6:1299,price12:1199,deposit:3500,available:true,featured:true,rating:4.6,reviews:210},
    {id:'p4',name:'Samsung 253L Refrigerator',category:'Appliances',description:'Double door frost-free refrigerator with digital inverter compressor.',image:'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500',price3:999,price6:849,price12:749,deposit:2500,available:true,featured:false,rating:4.4,reviews:167},
    {id:'p5',name:'Samsung 55" 4K Smart TV',category:'Electronics',description:'Crystal 4K UHD TV with HDR and smart features. Wall mount included.',image:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500',price3:1799,price6:1599,price12:1399,deposit:4000,available:true,featured:true,rating:4.8,reviews:312},
    {id:'p6',name:'Fully Automatic Washing Machine',category:'Appliances',description:'7.5kg front load washing machine with 15 wash programs.',image:'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500',price3:1199,price6:999,price12:899,deposit:3000,available:true,featured:false,rating:4.3,reviews:88},
    {id:'p7',name:'Study Table & Chair Set',category:'Furniture',description:'Ergonomic study table with adjustable chair. Ideal for WFH.',image:'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500',price3:499,price6:449,price12:399,deposit:1000,available:true,featured:false,rating:4.2,reviews:54},
    {id:'p8',name:'Dell Laptop - Inspiron 15',category:'Electronics',description:'Intel i5, 8GB RAM, 512GB SSD. Perfect for work and study.',image:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',price3:2499,price6:2199,price12:1999,deposit:5000,available:true,featured:true,rating:4.5,reviews:143},
    {id:'p9',name:'Dining Table 6 Seater',category:'Furniture',description:'Solid wood 6-seater dining table with cushioned chairs.',image:'https://images.unsplash.com/photo-1615066831168-8d5dc4c1b5b2?w=500',price3:899,price6:799,price12:699,deposit:2000,available:true,featured:false,rating:4.1,reviews:37},
    {id:'p10',name:'Microwave Oven 28L',category:'Appliances',description:'Convection microwave with grill function. 28L capacity.',image:'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500',price3:599,price6:499,price12:449,deposit:1500,available:true,featured:false,rating:4.0,reviews:62},
    {id:'p11',name:'Ergonomic Office Chair',category:'Furniture',description:'Mesh back ergonomic chair with lumbar support and armrests.',image:'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500',price3:399,price6:349,price12:299,deposit:800,available:true,featured:false,rating:4.4,reviews:91},
    {id:'p12',name:'iPad Pro 11"',category:'Electronics',description:'M2 chip, 128GB, WiFi. Includes Apple Pencil and keyboard case.',image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',price3:2999,price6:2699,price12:2399,deposit:6000,available:true,featured:false,rating:4.9,reviews:228},
  ],
  carts:{}, rentals:[], orders:[], maintenance:[]
};

const R = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'}
});
const signToken = u => jwt.sign({id:u.id,email:u.email,role:u.role,name:u.name}, JWT_SECRET, {expiresIn:'30d'});
const auth = req => { const h=req.headers.get('authorization')||''; if(!h.startsWith('Bearer ')) return null; try{return jwt.verify(h.split(' ')[1],JWT_SECRET);}catch{return null;} };

export default async (req) => {
  if (req.method==='OPTIONS') return new Response('',{status:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'}});
  const url = new URL(req.url);
  const p = url.pathname.replace(/^\/api/,'').replace(/\/$/,'');
  const m = req.method;
  const q = Object.fromEntries(url.searchParams);
  let b={};
  if(['POST','PUT','PATCH'].includes(m)){try{b=await req.json();}catch{}}

  if(p==='/health') return R({status:'ok'});

  /* AUTH */
  if(p==='/auth/register'&&m==='POST'){
    const{name,email,password,phone='',address=''}=b;
    if(!name||!email||!password) return R({message:'Name, email, password required'},400);
    if(store.users.find(u=>u.email===email)) return R({message:'Email already registered'},400);
    const hashed=await bcrypt.hash(password,10);
    const user={id:uuidv4(),name,email,password:hashed,phone,address,role:'user'};
    store.users.push(user);
    return R({token:signToken(user),user:{id:user.id,name,email,role:'user',phone,address}},201);
  }
  if(p==='/auth/login'&&m==='POST'){
    const{email,password}=b;
    const user=store.users.find(u=>u.email===email);
    if(!user||!(await bcrypt.compare(password,user.password))) return R({message:'Invalid credentials'},401);
    return R({token:signToken(user),user:{id:user.id,name:user.name,email:user.email,role:user.role,phone:user.phone,address:user.address}});
  }
  if(p==='/auth/me'&&m==='GET'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    const user=store.users.find(x=>x.id===u.id);
    if(!user) return R({message:'Not found'},404);
    return R({id:user.id,name:user.name,email:user.email,role:user.role,phone:user.phone,address:user.address});
  }

  /* PRODUCTS */
  if(p==='/products'&&m==='GET'){
    let pr=[...store.products];
    if(q.category) pr=pr.filter(x=>x.category===q.category);
    if(q.search) pr=pr.filter(x=>x.name.toLowerCase().includes(q.search.toLowerCase()));
    return R(pr);
  }
  if(p==='/products/featured'&&m==='GET') return R(store.products.filter(x=>x.featured));
  if(p==='/products/categories'&&m==='GET') return R([...new Set(store.products.map(x=>x.category))]);
  if(p.match(/^\/products\/[^/]+$/)&&m==='GET'){
    const id=p.split('/')[2]; const pr=store.products.find(x=>x.id===id);
    return pr?R(pr):R({message:'Not found'},404);
  }
  if(p==='/products'&&m==='POST'){
    const u=auth(req); if(!u||u.role!=='admin') return R({message:'Admin only'},403);
    const pr={id:uuidv4(),...b,available:true,featured:false,rating:0,reviews:0};
    store.products.push(pr); return R(pr,201);
  }
  if(p.match(/^\/products\/[^/]+$/)&&m==='PUT'){
    const u=auth(req); if(!u||u.role!=='admin') return R({message:'Admin only'},403);
    const id=p.split('/')[2]; const idx=store.products.findIndex(x=>x.id===id);
    if(idx===-1) return R({message:'Not found'},404);
    store.products[idx]={...store.products[idx],...b}; return R(store.products[idx]);
  }
  if(p.match(/^\/products\/[^/]+$/)&&m==='DELETE'){
    const u=auth(req); if(!u||u.role!=='admin') return R({message:'Admin only'},403);
    const id=p.split('/')[2]; const idx=store.products.findIndex(x=>x.id===id);
    if(idx===-1) return R({message:'Not found'},404);
    store.products.splice(idx,1); return R({message:'Deleted'});
  }

  /* CART */
  if(p==='/cart'&&m==='GET'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    return R((store.carts[u.id]||[]).map(i=>({...i,product:store.products.find(x=>x.id===i.productId)})));
  }
  if(p==='/cart/add'&&m==='POST'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    if(!store.carts[u.id]) store.carts[u.id]=[];
    const ex=store.carts[u.id].find(i=>i.productId===b.productId);
    if(ex) ex.tenure=b.tenure; else store.carts[u.id].push({id:uuidv4(),productId:b.productId,tenure:b.tenure,qty:1});
    return R({message:'Added'});
  }
  if(p.match(/^\/cart\/update\/[^/]+$/)&&m==='PUT'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    const itemId=p.split('/')[3]; const item=(store.carts[u.id]||[]).find(i=>i.id===itemId);
    if(!item) return R({message:'Not found'},404);
    Object.assign(item,b); return R({message:'Updated'});
  }
  if(p.match(/^\/cart\/remove\/[^/]+$/)&&m==='DELETE'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    const itemId=p.split('/')[3];
    if(store.carts[u.id]) store.carts[u.id]=store.carts[u.id].filter(i=>i.id!==itemId);
    return R({message:'Removed'});
  }
  if(p==='/cart/clear'&&m==='DELETE'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    store.carts[u.id]=[]; return R({message:'Cleared'});
  }

  /* RENTALS */
  if(p==='/rentals/active'&&m==='GET'){const u=auth(req);if(!u)return R({message:'Not authorized'},401);return R(store.rentals.filter(r=>r.userId===u.id&&r.status==='active'));}
  if(p==='/rentals/history'&&m==='GET'){const u=auth(req);if(!u)return R({message:'Not authorized'},401);return R(store.rentals.filter(r=>r.userId===u.id&&r.status!=='active'));}
  if(p==='/rentals'&&m==='GET'){const u=auth(req);if(!u)return R({message:'Not authorized'},401);return R(store.rentals.filter(r=>r.userId===u.id));}
  if(p==='/rentals/create'&&m==='POST'){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    const{deliveryAddress,deliveryDate,items}=b;
    const orderId=uuidv4();
    const newRentals=(items||[]).map(item=>{
      const product=store.products.find(x=>x.id===item.productId);
      const monthly=product?.[`price${item.tenure}`]||0;
      const startDate=new Date(); const endDate=new Date();
      endDate.setMonth(endDate.getMonth()+parseInt(item.tenure));
      return{id:uuidv4(),orderId,userId:u.id,productId:item.productId,product,tenure:item.tenure,monthlyPrice:monthly,totalPrice:monthly*item.tenure,status:'active',startDate,endDate,deliveryAddress,deliveryDate,createdAt:new Date()};
    });
    store.rentals.push(...newRentals);
    const order={id:orderId,userId:u.id,items:newRentals,deliveryAddress,deliveryDate,totalAmount:newRentals.reduce((s,r)=>s+r.totalPrice,0),status:'confirmed',createdAt:new Date()};
    store.orders.push(order); store.carts[u.id]=[];
    return R({order,rentals:newRentals},201);
  }
  if(p.match(/^\/rentals\/[^/]+\/schedule-pickup$/)&&m==='POST'){
    const u=auth(req);if(!u)return R({message:'Not authorized'},401);
    const id=p.split('/')[2]; const r=store.rentals.find(x=>x.id===id&&x.userId===u.id);
    if(!r)return R({message:'Not found'},404);
    r.pickupDate=b.pickupDate; r.status='pickup_scheduled'; return R(r);
  }
  if(p.match(/^\/rentals\/[^/]+\/extend$/)&&m==='POST'){
    const u=auth(req);if(!u)return R({message:'Not authorized'},401);
    const id=p.split('/')[2]; const r=store.rentals.find(x=>x.id===id&&x.userId===u.id);
    if(!r)return R({message:'Not found'},404);
    const end=new Date(r.endDate); end.setMonth(end.getMonth()+parseInt(b.months));
    r.endDate=end; r.tenure=parseInt(r.tenure)+parseInt(b.months); return R(r);
  }

  /* ORDERS */
  if(p==='/orders'&&m==='GET'){const u=auth(req);if(!u)return R({message:'Not authorized'},401);return R(store.orders.filter(o=>o.userId===u.id));}
  if(p.match(/^\/orders\/[^/]+$/)&&m==='GET'){
    const u=auth(req);if(!u)return R({message:'Not authorized'},401);
    const id=p.split('/')[2]; const o=store.orders.find(x=>x.id===id&&x.userId===u.id);
    return o?R(o):R({message:'Not found'},404);
  }
  if(p.match(/^\/orders\/[^/]+\/cancel$/)&&m==='POST'){
    const u=auth(req);if(!u)return R({message:'Not authorized'},401);
    const id=p.split('/')[2]; const o=store.orders.find(x=>x.id===id&&x.userId===u.id);
    if(!o)return R({message:'Not found'},404);
    o.status='cancelled'; store.rentals.filter(r=>r.orderId===id).forEach(r=>r.status='cancelled'); return R(o);
  }

  /* MAINTENANCE */
  if(p==='/maintenance'&&m==='GET'){const u=auth(req);if(!u)return R({message:'Not authorized'},401);return R(store.maintenance.filter(x=>x.userId===u.id));}
  if(p==='/maintenance'&&m==='POST'){
    const u=auth(req);if(!u)return R({message:'Not authorized'},401);
    const{rentalId,issue,description}=b;
    const r={id:uuidv4(),userId:u.id,rentalId,issue,description,status:'open',createdAt:new Date(),scheduledDate:null,feedback:null};
    store.maintenance.push(r); return R(r,201);
  }
  if(p.match(/^\/maintenance\/[^/]+\/feedback$/)&&m==='POST'){
    const u=auth(req);if(!u)return R({message:'Not authorized'},401);
    const id=p.split('/')[2]; const r=store.maintenance.find(x=>x.id===id&&x.userId===u.id);
    if(!r)return R({message:'Not found'},404);
    r.feedback=b.feedback; r.rating=b.rating; return R(r);
  }

  /* ADMIN */
  if(p.startsWith('/admin')){
    const u=auth(req); if(!u) return R({message:'Not authorized'},401);
    if(u.role!=='admin') return R({message:'Admin only'},403);
    if(p==='/admin/dashboard') return R({totalUsers:store.users.filter(x=>x.role!=='admin').length,totalProducts:store.products.length,totalOrders:store.orders.length,totalRentals:store.rentals.length,activeRentals:store.rentals.filter(r=>r.status==='active').length,pendingMaintenance:store.maintenance.filter(x=>x.status==='open').length,totalRevenue:store.rentals.reduce((s,r)=>s+(r.totalPrice||0),0)});
    if(p==='/admin/users') return R(store.users.map(u=>({id:u.id,name:u.name,email:u.email,role:u.role,phone:u.phone})));
    if(p==='/admin/orders'&&m==='GET') return R(store.orders);
    if(p==='/admin/rentals'&&m==='GET') return R(store.rentals);
    if(p==='/admin/maintenance'&&m==='GET') return R(store.maintenance);
    if(p.match(/^\/admin\/orders\/[^/]+\/status$/)&&m==='PUT'){const id=p.split('/')[3];const o=store.orders.find(x=>x.id===id);if(!o)return R({message:'Not found'},404);o.status=b.status;return R(o);}
    if(p.match(/^\/admin\/rentals\/[^/]+\/status$/)&&m==='PUT'){const id=p.split('/')[3];const r=store.rentals.find(x=>x.id===id);if(!r)return R({message:'Not found'},404);r.status=b.status;return R(r);}
    if(p.match(/^\/admin\/maintenance\/[^/]+\/status$/)&&m==='PUT'){const id=p.split('/')[3];const r=store.maintenance.find(x=>x.id===id);if(!r)return R({message:'Not found'},404);r.status=b.status;if(b.scheduledDate)r.scheduledDate=b.scheduledDate;return R(r);}
  }

  return R({message:'Route not found'},404);
};

export const config = { path: '/api/*' };
