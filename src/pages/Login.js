import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import '../styles/auth.css';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding */}
      <div className="auth-left">
        <div className="auth-grid" />
        <div className="auth-logo">
          <div className="auth-logo-mark">F</div>
          <span className="auth-logo-name">Finvault</span>
        </div>
        <div className="auth-hero">
          <h2>Take <em>control</em> of your financial future.</h2>
          <p>Track every rupee, set smart budgets, and reach your savings goals — all from one beautifully crafted dashboard.</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat">
            <span className="auth-stat-value">100%</span>
            <span className="auth-stat-label">Secure</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-value">Live</span>
            <span className="auth-stat-label">Analytics</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-value">∞</span>
            <span className="auth-stat-label">Transactions</span>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your Finvault account</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <div className="form-group">
              <label>Email address</label>
              <input
                name="email" type="email"
                placeholder="you@example.com"
                value={form.email} onChange={onChange} required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="pw-wrap">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password} onChange={onChange} required
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
