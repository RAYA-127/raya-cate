import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const lowestPrice = Math.min(product.price3, product.price6, product.price12);
  const stars = '★'.repeat(Math.floor(product.rating || 0)) + '☆'.repeat(5 - Math.floor(product.rating || 0));

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
      
      <Link to={`/products/${product.id}`}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <img src={product.image} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="badge badge-accent">{product.category}</span>
          </div>
          {product.featured && (
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <span className="badge" style={{ background: 'rgba(232,160,69,0.9)', color: '#1a1a00' }}>⭐ Featured</span>
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: '16px' }}>
        <Link to={`/products/${product.id}`}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--font-body)', color: 'var(--text)' }}>{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span className="stars" style={{ fontSize: 12 }}>{stars.slice(0,5)}</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>Starting from</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
              ₹{lowestPrice}<span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>/mo</span>
            </div>
          </div>
          <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm">Rent Now</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
