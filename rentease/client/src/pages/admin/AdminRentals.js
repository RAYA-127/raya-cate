import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => api.get('/admin/rentals').then(r => setRentals(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await api.put(`/admin/rentals/${id}/status`, { status }); toast('Updated', 'success'); load(); }
    catch { toast('Failed', 'error'); }
  };

  const statusColor = { active: 'badge-success', pickup_scheduled: 'badge-warning', completed: 'badge-neutral', cancelled: 'badge-error' };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Rentals</h1>
        <p className="page-subtitle">Track and manage all active and past rentals</p>

        {loading ? <div className="spinner" /> : rentals.length === 0 ? (
          <div className="empty-state"><div className="icon">📦</div><h3>No rentals yet</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rentals.map(r => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {r.product?.image && <img src={r.product.image} alt="" style={{ width: 80, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{r.product?.name || 'Product'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Rental ID: {r.id.slice(0, 12)}</div>
                      </div>
                      <span className={`badge ${statusColor[r.status] || 'badge-neutral'}`}>{r.status?.replace('_', ' ')}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 8, marginBottom: 12 }}>
                      {[
                        ['Monthly', `₹${r.monthlyPrice}`],
                        ['Duration', `${r.tenure} mo`],
                        ['Total', `₹${r.totalPrice}`],
                        ['Start', r.startDate ? new Date(r.startDate).toLocaleDateString('en-IN') : '—'],
                        ['End', r.endDate ? new Date(r.endDate).toLocaleDateString('en-IN') : '—'],
                      ].map(([l, v]) => (
                        <div key={l} style={{ fontSize: 12 }}>
                          <div style={{ color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{l}</div>
                          <div style={{ fontWeight: 500 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['active', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateStatus(r.id, s)}
                          className={`btn btn-sm ${r.status === s ? 'btn-primary' : 'btn-outline'}`}
                          style={{ textTransform: 'capitalize' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRentals;
