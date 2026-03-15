import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '48px 24px 28px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Rent<span style={{ color: 'var(--accent)' }}>Ease</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>Premium furniture & appliances on flexible monthly rental plans. Live well, spend less.</p>
        </div>
        <div>
          <h5 style={{ marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)' }}>Products</h5>
          {['Furniture', 'Appliances', 'Electronics'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={{ display: 'block', color: 'var(--text2)', fontSize: 13, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text2)'}>{c}</Link>
          ))}
        </div>
        <div>
          <h5 style={{ marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)' }}>Account</h5>
          {[['Login', '/login'], ['Register', '/register'], ['My Rentals', '/rentals'], ['Support', '/maintenance']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: 'var(--text2)', fontSize: 13, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text2)'}>{label}</Link>
          ))}
        </div>
        <div>
          <h5 style={{ marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)' }}>Why RentEase?</h5>
          {['Zero deposit stress', 'Free delivery & setup', '24/7 maintenance', 'Flexible tenures'].map(item => (
            <div key={item} style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--accent)' }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>© 2024 RentEase. All rights reserved.</p>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Made with ♥ for comfortable living</p>
      </div>
    </div>
  </footer>
);

export default Footer;
