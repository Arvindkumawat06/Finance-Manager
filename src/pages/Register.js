import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import '../styles/auth.css';

export default function Register() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const data = await authService.register(form.name, form.email, form.password);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-grid" />
        <div className="auth-logo">
          <div className="auth-logo-mark">F</div>
          <span className="auth-logo-name">Finvault</span>
        </div>
        <div className="auth-hero">
          <h2>Start your journey to <em>financial clarity.</em></h2>
          <p>Join thousands who've taken charge of their money. Set goals, track spending, and build wealth — starting today.</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat">
            <span className="auth-stat-value">Free</span>
            <span className="auth-stat-label">Forever</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-value">Smart</span>
            <span className="auth-stat-label">Budgets</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-value">Goals</span>
            <span className="auth-stat-label">Tracker</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h1>Create account</h1>
          <p className="auth-subtitle">Get started with Finvault for free</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <div className="form-group">
              <label>Full name</label>
              <input
                name="name" placeholder="Arjun Sharma"
                value={form.name} onChange={onChange} required
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                name="email" type="email" placeholder="arjun@example.com"
                value={form.email} onChange={onChange} required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="pw-wrap">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={onChange} required
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <input
                name="confirm" type="password" placeholder="Repeat your password"
                value={form.confirm} onChange={onChange} required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
