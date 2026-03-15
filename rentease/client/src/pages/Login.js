import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast(`Welcome back, ${data.user.name}!`, 'success');
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', background: 'radial-gradient(ellipse at center, rgba(232,160,69,0.05) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Rent<span style={{ color: 'var(--accent)' }}>Ease</span>
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Sign in to manage your rentals</p>
        </div>

        <div className="card">
          {/* Demo credentials */}
          <div style={{ background: 'rgba(232,160,69,0.08)', border: '1px solid rgba(232,160,69,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--accent)' }}>Demo Credentials</div>
            <div style={{ color: 'var(--text2)' }}>Admin: <span style={{ color: 'var(--text)' }}>admin@rentease.com / password</span></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            {error && <div className="form-error" style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,107,107,0.1)', borderRadius: 8 }}>{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
