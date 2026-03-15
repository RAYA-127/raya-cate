import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const tenures = [
  { value: 3, label: '3 Months', discount: '' },
  { value: 6, label: '6 Months', discount: 'Save 10%' },
  { value: 12, label: '12 Months', discount: 'Save 20%' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenure, setTenure] = useState(3);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, tenure);
      toast('Added to cart!', 'success');
    } catch { toast('Failed to add to cart', 'error'); }
    finally { setAdding(false); }
  };

  const handleRentNow = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, tenure);
      navigate('/cart');
    } catch { toast('Failed', 'error'); }
    finally { setAdding(false); }
  };

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>;
  if (!product) return <div className="page"><div className="container"><p>Product not found.</p></div></div>;

  const priceKey = `price${tenure}`;
  const monthlyPrice = product[priceKey];
  const totalPrice = monthlyPrice * tenure;
  const stars = Math.floor(product.rating || 0);

  return (
    <div className="page">
      <div className="container">
        <Link to="/products" style={{ color: 'var(--text2)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Products</Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', aspectRatio: '4/3' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Details */}
          <div>
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>{product.category}</span>
            <h1 style={{ fontSize: 'clamp(22px,3vw,34px)', marginBottom: 12 }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ color: 'var(--accent)', fontSize: 16 }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28, fontSize: 15 }}>{product.description}</p>

            {/* Tenure Selection */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, fontWeight: 500 }}>Select Rental Duration</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {tenures.map(t => (
                  <button key={t.value} onClick={() => setTenure(t.value)} style={{
                    flex: 1, padding: '14px 12px', borderRadius: 'var(--radius)',
                    border: `2px solid ${tenure === t.value ? 'var(--accent)' : 'var(--border)'}`,
                    background: tenure === t.value ? 'rgba(232,160,69,0.1)' : 'var(--bg3)',
                    color: tenure === t.value ? 'var(--accent)' : 'var(--text)',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
                    {t.discount && <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 4 }}>{t.discount}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="card" style={{ marginBottom: 24, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Monthly Rent</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>₹{monthlyPrice}<span style={{ fontSize: 16, color: 'var(--text2)', fontWeight: 400 }}>/mo</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Total for {tenure} months</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>₹{totalPrice}</div>
                </div>
              </div>
              <hr className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)' }}>
                <span>Refundable Deposit</span>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>₹{product.deposit}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleAddToCart} disabled={adding} className="btn btn-outline" style={{ flex: 1 }}>
                🛒 Add to Cart
              </button>
              <button onClick={handleRentNow} disabled={adding} className="btn btn-primary" style={{ flex: 1 }}>
                {adding ? 'Processing...' : 'Rent Now →'}
              </button>
            </div>

            {/* Perks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
              {['🚚 Free Delivery', '🔧 Free Maintenance', '🔄 Easy Return', '📋 No EMI Stress'].map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px' }}>
                  {perk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
