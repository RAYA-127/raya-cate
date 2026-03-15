import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#6c8eff' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'var(--accent)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'var(--success)' },
    { label: 'Active Rentals', value: stats.activeRentals, icon: '✅', color: '#4ecb71' },
    { label: 'Pending Support', value: stats.pendingMaintenance, icon: '🔧', color: 'var(--warning)' },
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#ff7eb3' },
  ];

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage your RentEase platform</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
          {cards.map(c => (
            <div key={c.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
          {[
            { to: '/admin/products', icon: '📦', label: 'Manage Products', desc: 'Add, edit, remove products' },
            { to: '/admin/orders', icon: '🛒', label: 'Manage Orders', desc: 'View and update all orders' },
            { to: '/admin/rentals', icon: '✅', label: 'Manage Rentals', desc: 'Track active rentals' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="card" style={{ display: 'block', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, marginBottom: 6 }}>{item.label}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13 }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
