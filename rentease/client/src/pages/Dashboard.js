import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/rentals'),
      api.get('/orders'),
      api.get('/maintenance')
    ]).then(([r, o, m]) => {
      setRentals(r.data); setOrders(o.data); setMaintenance(m.data);
    }).finally(() => setLoading(false));
  }, []);

  const activeRentals = rentals.filter(r => r.status === 'active');
  const totalSpend = rentals.reduce((s, r) => s + (r.totalPrice || 0), 0);
  const openTickets = maintenance.filter(m => m.status === 'open').length;

  const stats = [
    { label: 'Active Rentals', value: activeRentals.length, icon: '📦', color: 'var(--accent)' },
    { label: 'Total Orders', value: orders.length, icon: '🛒', color: 'var(--success)' },
    { label: 'Support Tickets', value: openTickets, icon: '🔧', color: 'var(--warning)' },
    { label: 'Total Spent', value: `₹${totalSpend.toLocaleString()}`, icon: '💰', color: '#6c8eff' },
  ];

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's an overview of your rentals and activity</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary">🛋️ Browse Products</Link>
            <Link to="/rentals" className="btn btn-outline">📦 My Rentals</Link>
            <Link to="/maintenance" className="btn btn-outline">🔧 Request Support</Link>
            <Link to="/cart" className="btn btn-outline">🛒 View Cart</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Active Rentals */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-body)' }}>Active Rentals</h3>
              <Link to="/rentals" style={{ fontSize: 13, color: 'var(--accent)' }}>View All →</Link>
            </div>
            {activeRentals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text2)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
                <p style={{ fontSize: 14 }}>No active rentals</p>
                <Link to="/products" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Start Renting</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeRentals.slice(0, 3).map(r => (
                  <div key={r.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10 }}>
                    {r.product?.image && <img src={r.product.image} alt="" style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, truncate: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{r.product?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>₹{r.monthlyPrice}/mo · {r.tenure} months</div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: 11 }}>Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-body)' }}>Recent Orders</h3>
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text2)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
                <p style={{ fontSize: 14 }}>No orders yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.slice(0, 3).map(o => (
                  <div key={o.id} style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>Order #{o.id.slice(0,8)}</span>
                      <span className={`badge ${o.status === 'confirmed' ? 'badge-success' : o.status === 'cancelled' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: 11 }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                      ₹{o.totalAmount?.toLocaleString()} · {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
