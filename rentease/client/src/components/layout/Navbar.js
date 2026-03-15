import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styled from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(15,15,26,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#1a1a00'
          }}>R</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
            Rent<span style={{ color: 'var(--accent)' }}>Ease</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14 }} className="desktop-nav">
          <Link to="/products" style={{ color: 'var(--text2)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--text2)'}>Browse</Link>
          {user && (
            <Link to="/rentals" style={{ color: 'var(--text2)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text2)'}>My Rentals</Link>
          )}
          {isAdmin && (
            <Link to="/admin" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>Admin</Link>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <Link to="/cart" style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--bg3)' }}>
                🛒
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4, width: 18, height: 18,
                    background: 'var(--accent)', borderRadius: '50%', fontSize: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a00', fontWeight: 700
                  }}>{cartCount}</span>
                )}
              </Link>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropOpen(!dropOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)',
                  border: '1px solid var(--border)', borderRadius: 30, padding: '6px 14px 6px 6px',
                  color: 'var(--text)', cursor: 'pointer'
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a1a00' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13 }}>{user.name?.split(' ')[0]}</span>
                  <span style={{ fontSize: 10 }}>▾</span>
                </button>
                {dropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '110%', background: 'var(--card)',
                    border: '1px solid var(--border)', borderRadius: 12, padding: 8,
                    minWidth: 180, boxShadow: 'var(--shadow)', zIndex: 100
                  }}>
                    <Link to="/dashboard" onClick={() => setDropOpen(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, color: 'var(--text2)', fontSize: 14, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      📊 Dashboard
                    </Link>
                    <Link to="/rentals" onClick={() => setDropOpen(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, color: 'var(--text2)', fontSize: 14, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      📦 My Rentals
                    </Link>
                    <Link to="/maintenance" onClick={() => setDropOpen(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, color: 'var(--text2)', fontSize: 14, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      🔧 Support
                    </Link>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '6px 0' }} />
                    <button onClick={() => { setDropOpen(false); handleLogout(); }} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, background: 'transparent', color: 'var(--error)', fontSize: 14, cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
          {/* Mobile menu btn */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22 }} className="mobile-menu-btn">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', padding: 16 }}>
          <Link to="/products" style={{ display: 'block', padding: '12px 0', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Browse Products</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={{ display: 'block', padding: '12px 0', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Dashboard</Link>
              <Link to="/rentals" style={{ display: 'block', padding: '12px 0', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>My Rentals</Link>
              <Link to="/cart" style={{ display: 'block', padding: '12px 0', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Cart ({cartCount})</Link>
              <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '12px 0', color: 'var(--error)', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
