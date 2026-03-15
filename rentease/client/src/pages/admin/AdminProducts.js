import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';

const blank = { name: '', category: 'Furniture', description: '', image: '', price3: '', price6: '', price12: '', deposit: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const load = () => api.get('/products').then(r => setProducts(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleEdit = (p) => { setForm(p); setEditing(p.id); setShowForm(true); };
  const handleNew = () => { setForm(blank); setEditing(null); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/products/${editing}`, form); toast('Product updated', 'success'); }
      else { await api.post('/products', form); toast('Product created', 'success'); }
      setShowForm(false); setEditing(null); setForm(blank); load();
    } catch { toast('Failed to save', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast('Deleted', 'success'); load(); }
    catch { toast('Failed', 'error'); }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">Manage your rental inventory</p>
          </div>
          <button className="btn btn-primary" onClick={handleNew}>+ Add Product</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 32, borderColor: 'rgba(232,160,69,0.3)' }}>
            <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 20 }}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Furniture', 'Appliances', 'Electronics'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Price 3 Months (₹/mo)</label><input type="number" value={form.price3} onChange={e => setForm({ ...form, price3: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Price 6 Months (₹/mo)</label><input type="number" value={form.price6} onChange={e => setForm({ ...form, price6: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Price 12 Months (₹/mo)</label><input type="number" value={form.price12} onChange={e => setForm({ ...form, price12: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Security Deposit (₹)</label><input type="number" value={form.deposit} onChange={e => setForm({ ...form, deposit: e.target.value })} required /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Save Product</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="spinner" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Product', 'Category', '3mo', '6mo', '12mo', 'Deposit', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image} alt="" style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}><span className="badge badge-accent">{p.category}</span></td>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>₹{p.price3}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>₹{p.price6}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>₹{p.price12}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>₹{p.deposit}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEdit(p)} className="btn btn-outline btn-sm">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
