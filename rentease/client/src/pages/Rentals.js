import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const statusColor = { active: 'badge-success', pickup_scheduled: 'badge-warning', completed: 'badge-neutral', cancelled: 'badge-error' };

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const { toast } = useToast();

  useEffect(() => {
    api.get('/rentals').then(r => setRentals(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = rentals.filter(r => tab === 'active' ? r.status === 'active' : r.status !== 'active');

  const handleSchedulePickup = async (id) => {
    const date = prompt('Enter pickup date (YYYY-MM-DD):');
    if (!date) return;
    try {
      await api.post(`/rentals/${id}/schedule-pickup`, { pickupDate: date });
      toast('Pickup scheduled!', 'success');
      const r = await api.get('/rentals');
      setRentals(r.data);
    } catch { toast('Failed', 'error'); }
  };

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Rentals</h1>
        <p className="page-subtitle">Track and manage all your rental items</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--bg3)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[['active', 'Active'], ['history', 'History']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
              background: tab === val ? 'var(--card)' : 'transparent',
              color: tab === val ? 'var(--text)' : 'var(--text2)',
              transition: 'all 0.2s'
            }}>{label} ({rentals.filter(r => val === 'active' ? r.status === 'active' : r.status !== 'active').length})</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>{tab === 'active' ? 'No active rentals' : 'No rental history'}</h3>
            <p>{tab === 'active' ? 'Start browsing to rent your first item!' : 'Your completed rentals will appear here.'}</p>
            {tab === 'active' && <Link to="/products" className="btn btn-primary" style={{ marginTop: 24 }}>Browse Products</Link>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(r => (
              <div key={r.id} className="card" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {r.product?.image && (
                  <img src={r.product.image} alt={r.product?.name}
                    style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{r.product?.name || 'Product'}</h3>
                    <span className={`badge ${statusColor[r.status] || 'badge-neutral'}`}>{r.status?.replace('_', ' ')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: 8, marginBottom: 12 }}>
                    {[
                      ['Duration', `${r.tenure} months`],
                      ['Monthly Rent', `₹${r.monthlyPrice}`],
                      ['Total Value', `₹${r.totalPrice}`],
                      ['Start Date', r.startDate ? new Date(r.startDate).toLocaleDateString('en-IN') : '—'],
                      ['End Date', r.endDate ? new Date(r.endDate).toLocaleDateString('en-IN') : '—'],
                    ].map(([label, val]) => (
                      <div key={label} style={{ fontSize: 12 }}>
                        <div style={{ color: 'var(--text3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
                        <div style={{ fontWeight: 500 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {r.status === 'active' && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Link to={`/maintenance?rentalId=${r.id}`} className="btn btn-outline btn-sm">🔧 Request Support</Link>
                      <button onClick={() => handleSchedulePickup(r.id)} className="btn btn-outline btn-sm">📅 Schedule Pickup</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;
