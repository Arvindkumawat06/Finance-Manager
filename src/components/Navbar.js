import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TITLES = {
  '/':             { title: 'Dashboard',    sub: 'Your financial overview' },
  '/transactions': { title: 'Transactions', sub: 'Track every rupee' },
  '/budget':       { title: 'Budgets',      sub: 'Control your spending' },
  '/analytics':    { title: 'Analytics',    sub: 'Deep insights & trends' },
  '/goals':        { title: 'Goals',        sub: 'Your savings targets' },
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user }     = useAuth();
  const meta = TITLES[pathname] || TITLES['/'];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div>
          <h2 className="navbar-title">{meta.title}</h2>
          <p className="navbar-sub">{meta.sub}</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-datetime">
          <span className="navbar-time">{timeStr}</span>
          <span className="navbar-date">{dateStr}</span>
        </div>
        <div className="navbar-user-chip">
          <div className="navbar-user-dot" />
          <span>{user?.name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>

      <style>{`
        .navbar {
          height: var(--navbar-h);
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-left  { display: flex; align-items: center; gap: 14px; }
        .navbar-right { display: flex; align-items: center; gap: 14px; }

        .navbar-menu-btn {
          display: none;
          color: var(--text-secondary);
          padding: 7px;
          border-radius: var(--radius-sm);
          transition: all var(--transition);
        }
        .navbar-menu-btn:hover { background: var(--bg-card); color: var(--text-primary); }

        .navbar-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .navbar-sub {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 300;
        }

        .navbar-datetime {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .navbar-time {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .navbar-date {
          font-size: 11px;
          color: var(--text-muted);
        }

.navbar-user-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 14px 6px 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .navbar-user-chip::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.1), transparent);
          transition: left 0.4s;
        }
        .navbar-user-chip:hover {
          border-color: var(--border-gold);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(245,158,11,0.2);
        }
        .navbar-user-chip:hover::before {
          left: 100%;
        }
        .navbar-user-dot {
          width: 7px; height: 7px;
          background: var(--green);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--green);
          animation: pulse 2s infinite;
        }

        @media (max-width: 900px) {
          .navbar-menu-btn { display: flex; }
          .navbar-datetime { display: none; }
        }
      `}</style>
    </header>
  );
}
