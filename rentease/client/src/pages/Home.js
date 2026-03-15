import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Premium Products' },
  { value: '50+', label: 'Cities Covered' },
  { value: '4.8★', label: 'Average Rating' },
];

const features = [
  { icon: '🚚', title: 'Free Delivery & Setup', desc: 'We deliver and set up everything at your home, no extra charges.' },
  { icon: '🔧', title: '24/7 Maintenance', desc: 'Something broke? We fix it fast. Free maintenance throughout your rental.' },
  { icon: '🔄', title: 'Flexible Plans', desc: 'Rent for 3, 6, or 12 months. Extend or return anytime with ease.' },
  { icon: '💰', title: 'Save Big', desc: 'Pay a fraction of buying cost. Get premium brands at affordable monthly rates.' },
];

const categories = [
  { name: 'Furniture', icon: '🛋️', desc: 'Sofas, beds, tables & more', color: '#e8a04520' },
  { name: 'Appliances', icon: '🌡️', desc: 'AC, fridge, washing machine', color: '#4ecb7120' },
  { name: 'Electronics', icon: '📺', desc: 'TVs, laptops, tablets', color: '#6c8eff20' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured').then(r => setFeatured(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(232,160,69,0.08) 0%, transparent 60%), var(--bg)',
        position: 'relative', overflow: 'hidden', padding: '100px 24px 60px'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,160,69,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '2%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,142,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%' }}>
          <div style={{ animation: 'fadeInUp 0.8s ease' }}>
            <div className="badge badge-accent" style={{ marginBottom: 20, fontSize: 12 }}>
              🏠 India's #1 Rental Platform
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.1, marginBottom: 20 }}>
              Furnish Your<br />
              <span style={{ color: 'var(--accent)' }}>Dream Home</span><br />
              Without Buying
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Rent premium furniture & appliances on flexible monthly plans. Free delivery, free maintenance, zero hassle.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Browse Products →
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started Free
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
              {['✅ No hidden fees', '🔒 Secure payments', '📦 Free setup'].map(t => (
                <span key={t} style={{ fontSize: 13, color: 'var(--text2)' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: 440, height: 380, borderRadius: 24,
              background: 'var(--card)', border: '1px solid var(--border)',
              overflow: 'hidden', position: 'relative'
            }}>
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
                alt="Premium Sofa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20, right: 20,
                background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(16px)',
                border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Premium Sofa Set</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>Starting ₹799/month</div>
                </div>
                <Link to="/products/p1" className="btn btn-primary btn-sm">Rent</Link>
              </div>
            </div>
            {/* Floating card */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '12px 16px',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>Monthly Savings</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>₹4,200</div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>vs buying</div>
            </div>
          </div>
        </div>

        <style>{`@keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform:none; } }`}</style>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {stats.map(s => (
            <div key={s.value} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,40px)', marginBottom: 8 }}>Shop by Category</h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 48 }}>Everything you need for a comfortable home</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center',
                transition: 'all 0.2s', textDecoration: 'none', display: 'block'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 8, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{cat.name}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13 }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 24px 80px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: 8 }}>Featured Products</h2>
              <p style={{ color: 'var(--text2)' }}>Hand-picked premium items at the best prices</p>
            </div>
            <Link to="/products" className="btn btn-outline">View All →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="grid-3">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,40px)', marginBottom: 8 }}>Why Choose RentEase?</h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 60 }}>We take care of everything, so you can just enjoy your home</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <h4 style={{ marginBottom: 10, fontSize: 17 }}>{f.title}</h4>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(232,160,69,0.1) 0%, rgba(108,142,255,0.05) 100%)',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', marginBottom: 16 }}>Ready to Furnish Your Home?</h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join 10,000+ happy customers who are living comfortably without the burden of ownership.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">Start Renting Today →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
