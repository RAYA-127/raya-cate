import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const { cart, removeFromCart, updateCartItem, getTotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    toast('Item removed from cart', 'success');
  };

  const handleTenureChange = async (itemId, tenure) => {
    await updateCartItem(itemId, { tenure: parseInt(tenure) });
    toast('Cart updated', 'success');
  };

  if (cart.length === 0) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Browse our collection and add items to rent</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 24 }}>Browse Products</Link>
        </div>
      </div>
    </div>
  );

  const total = getTotal();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.map(item => {
              if (!item.product) return null;
              const priceKey = `price${item.tenure}`;
              const monthly = item.product[priceKey] || 0;
              return (
                <div key={item.id} className="card" style={{ display: 'flex', gap: 20, padding: 20 }}>
                  <img src={item.product.image} alt={item.product.name}
                    style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)' }}>{item.product.name}</h3>
                      <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 13, color: 'var(--text2)' }}>Duration:</span>
                        <select value={item.tenure} onChange={e => handleTenureChange(item.id, e.target.value)}
                          style={{ width: 'auto', padding: '6px 12px' }}>
                          <option value={3}>3 Months</option>
                          <option value={6}>6 Months</option>
                          <option value={12}>12 Months</option>
                        </select>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>₹{monthly}/mo</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)' }}>₹{monthly * item.tenure} total</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="card" style={{ position: 'sticky', top: 90 }}>
            <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-body)' }}>Order Summary</h3>
            {cart.map(item => {
              if (!item.product) return null;
              const monthly = item.product[`price${item.tenure}`] || 0;
              return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>
                  <span style={{ flex: 1, paddingRight: 8 }}>{item.product.name}</span>
                  <span>₹{monthly} × {item.tenure}mo</span>
                </div>
              );
            })}
            <hr className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>₹{total}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Continue Shopping</Link>

            {/* Perks */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['🚚 Free delivery & setup', '🔧 Free maintenance included', '🔄 Easy return process'].map(p => (
                <div key={p} style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6 }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
