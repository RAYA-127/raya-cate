import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => api.get('/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await api.put(`/admin/orders/${id}/status`, { status }); toast('Status updated', 'success'); load(); }
    catch { toast('Failed', 'error'); }
  };

  const statusColor = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-error', delivered: 'badge-accent' };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Manage all customer orders</p>

        {loading ? <div className="spinner" /> : orders.length === 0 ? (
          <div className="empty-state"><div className="icon">🛒</div><h3>No orders yet</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(o => (
              <div key={o.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Order #{o.id.slice(0, 12)}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>₹{o.totalAmount?.toLocaleString()}</span>
                    <span className={`badge ${statusColor[o.status] || 'badge-neutral'}`}>{o.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text2)', marginBottom: 14, flexWrap: 'wrap' }}>
                  <span>📍 {o.deliveryAddress}</span>
                  {o.deliveryDate && <span>📅 {new Date(o.deliveryDate).toLocaleDateString('en-IN')}</span>}
                  <span>📦 {o.items?.length || 0} item(s)</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['confirmed', 'processing', 'delivered', 'cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus(o.id, s)}
                      className={`btn btn-sm ${o.status === s ? 'btn-primary' : 'btn-outline'}`}
                      style={{ textTransform: 'capitalize' }}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
