import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ deliveryAddress: user?.address || '', deliveryDate: '' });
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deliveryAddress || !form.deliveryDate) { toast('Please fill all fields', 'error'); return; }
    setLoading(true);
    try {
      const items = cart.map(i => ({ productId: i.productId, tenure: i.tenure }));
      const { data } = await api.post('/rentals/create', { ...form, items });
      await clearCart();
      toast('🎉 Order confirmed!', 'success');
      navigate('/rentals');
    } catch (err) {
      toast(err.response?.data?.message || 'Checkout failed', 'error');
    } finally { setLoading(false); }
  };

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Almost there! Complete your rental order.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <form onSubmit={handleSubmit}>
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-body)' }}>Delivery Details</h3>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea rows={3} placeholder="Full delivery address with pincode" value={form.deliveryAddress}
                  onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} required
                  style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Delivery Date</label>
                <input type="date" value={form.deliveryDate}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  onChange={e => setForm({ ...form, deliveryDate: e.target.value })} required />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-body)' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['UPI / Google Pay', 'Net Banking', 'Credit / Debit Card', 'Cash on Delivery'].map((m, i) => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg3)', borderRadius: 10, cursor: 'pointer', border: i === 0 ? '1px solid var(--accent)' : '1px solid transparent' }}>
                    <input type="radio" name="payment" defaultChecked={i === 0} style={{ width: 'auto' }} />
                    <span style={{ fontSize: 14 }}>{m}</span>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(78,203,113,0.1)', border: '1px solid rgba(78,203,113,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--success)' }}>
                ✅ Demo mode — no real payment required
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {loading ? 'Placing Order...' : `✓ Confirm Order — ₹${total}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="card" style={{ position: 'sticky', top: 90 }}>
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-body)' }}>Order Summary</h3>
            {cart.map(item => {
              if (!item.product) return null;
              const monthly = item.product[`price${item.tenure}`] || 0;
              return (
                <div key={item.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: 50, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.product.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.tenure} months × ₹{monthly}/mo</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, marginTop: 4 }}>₹{monthly * item.tenure}</div>
                </div>
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>₹{total}</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text2)' }}>
              + Refundable security deposits apply per item
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
