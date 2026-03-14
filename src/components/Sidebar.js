import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ArrowLeftRight, Wallet,
  BarChart3, Target, LogOut, X, TrendingUp
} from 'lucide-react';

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/budget',       icon: Wallet,          label: 'Budgets' },
  { to: '/analytics',    icon: BarChart3,        label: 'Analytics' },
  { to: '/goals',        icon: Target,           label: 'Goals' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
    : 'U';

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <TrendingUp size={16} />
          </div>
          <span className="sidebar-logo-name">Finvault</span>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">MENU</div>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={onClose}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'User'}</span>
            <span className="sidebar-user-email">{user?.email || ''}</span>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar {
          position: fixed; top: 0; left: 0;
          width: var(--sidebar-w);
          height: 100vh;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 200;
          transition: transform 0.3s ease;
        }
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 199;
          backdrop-filter: blur(2px);
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 20px 18px;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-logo-mark {
          width: 34px; height: 34px;
          background: var(--gold);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #0b0f1a;
          flex-shrink: 0;
        }
        .sidebar-logo-name {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          letter-spacing: 0.01em;
        }
        .sidebar-close-btn {
          display: none;
          color: var(--text-muted);
          padding: 4px;
          border-radius: 6px;
          transition: all var(--transition);
        }
        .sidebar-close-btn:hover { background: var(--bg-card); color: var(--text-primary); }

        .sidebar-nav {
          flex: 1;
          padding: 20px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }
        .sidebar-nav-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.12em;
          padding: 0 10px;
          margin-bottom: 8px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
          animation: slideInLeft 0.4s ease both;
        }
        .sidebar-link:nth-child(1) { animation-delay: 0.1s; }
        .sidebar-link:nth-child(2) { animation-delay: 0.2s; }
        .sidebar-link:nth-child(3) { animation-delay: 0.3s; }
        .sidebar-link:nth-child(4) { animation-delay: 0.4s; }
        .sidebar-link:nth-child(5) { animation-delay: 0.5s; }
        .sidebar-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.1), transparent);
          transition: left 0.4s;
        }
        .sidebar-link:hover {
          background: var(--bg-card);
          color: var(--text-primary);
          transform: translateX(4px);
        }
        .sidebar-link:hover::before {
          left: 100%;
        }
        .sidebar-link-active {
          background: var(--gold-dim);
          color: var(--gold);
          border-color: var(--border-gold);
          font-weight: 600;
          box-shadow: 0 0 20px rgba(245,158,11,0.2);
          transform: translateX(4px);
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--gold-dim), var(--gold));
          border: 1px solid var(--border-gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(245,158,11,0.3);
          animation: float 3s ease-in-out infinite;
        }
        .sidebar-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 0 25px rgba(245,158,11,0.5);
        }
        .sidebar-user-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .sidebar-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-user-email {
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-logout-btn {
          color: var(--text-muted);
          padding: 7px;
          border-radius: var(--radius-sm);
          transition: all var(--transition);
          flex-shrink: 0;
        }
        .sidebar-logout-btn:hover { color: var(--red); background: var(--red-dim); }

        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar-open { transform: translateX(0); }
          .sidebar-overlay { display: block; }
          .sidebar-close-btn { display: flex; }
        }
      `}</style>
    </>
  );
}
