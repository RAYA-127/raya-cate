import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';

const statusColor = { open: 'badge-warning', in_progress: 'badge-accent', resolved: 'badge-success', closed: 'badge-neutral' };

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rentalId: '', issue: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const rid = searchParams.get('rentalId');
    if (rid) { setForm(f => ({ ...f, rentalId: rid })); setShowForm(true); }
    Promise.all([api.get('/maintenance'), api.get('/rentals/active')])
      .then(([m, r]) => { setRequests(m.data); setRentals(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/maintenance', form);
      toast('Support request submitted!', 'success');
      setShowForm(false);
      setForm({ rentalId: '', issue: '', description: '' });
      const { data } = await api.get('/maintenance');
      setRequests(data);
    } catch { toast('Failed to submit', 'error'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">Maintenance & Support</h1>
            <p className="page-subtitle">Request repairs or report issues with your rented items</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ New Request'}
          </button>
        </div>

        {/* New Request Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 32, borderColor: 'rgba(232,160,69,0.3)' }}>
            <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 20 }}>Submit Support Request</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Select Rental Item</label>
                  <select value={form.rentalId} onChange={e => setForm({ ...form, rentalId: e.target.value })} required>
                    <option value="">Select a rental...</option>
                    {rentals.map(r => (
                      <option key={r.id} value={r.id}>{r.product?.name || r.productId}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Issue Type</label>
                  <select value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} required>
                    <option value="">Select issue type...</option>
                    {['Not working', 'Damaged', 'Noisy / vibrating', 'Installation problem', 'Replacement needed', 'Other'].map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Describe the Problem</label>
                <textarea rows={4} placeholder="Please describe the issue in detail..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : '✓ Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔧</div>
            <h3>No support requests</h3>
            <p>All good! Create a request if you need help with any rented item.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {requests.map(req => (
              <div key={req.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 4 }}>{req.issue}</h3>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>Ticket #{req.id.slice(0, 8)}</div>
                  </div>
                  <span className={`badge ${statusColor[req.status] || 'badge-neutral'}`}>{req.status?.replace('_', ' ')}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.6 }}>{req.description}</p>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {req.scheduledDate && ` · Scheduled: ${new Date(req.scheduledDate).toLocaleDateString('en-IN')}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
