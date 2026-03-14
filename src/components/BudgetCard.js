import React from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

const rupee = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const pct  = Math.min(budget.usagePercentage ?? 0, 100);
  const over = (budget.usagePercentage ?? 0) > 100;
  const warn = pct >= 80 && !over;

  const barColor = over ? 'var(--red)' : warn ? 'var(--orange)' : 'var(--green)';

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

  return (
    <div className={`card budget-card ${over ? 'budget-over' : ''}`}>
      {/* Header */}
      <div className="bc-header">
        <div>
          <div className="bc-category">{budget.category}</div>
          <span className={`badge badge-${budget.period === 'MONTHLY' ? 'blue' : budget.period === 'WEEKLY' ? 'green' : 'purple'}`}>
            {budget.period}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {onEdit   && <button className="icon-btn"        onClick={() => onEdit(budget)}  ><Pencil  size={13} /></button>}
          {onDelete && <button className="icon-btn danger" onClick={() => onDelete(budget)}><Trash2  size={13} /></button>}
        </div>
      </div>

      {/* Amounts grid */}
      <div className="bc-amounts">
        {[
          { label: 'Spent',     value: rupee(budget.spentAmount),    color: over ? 'var(--red)' : 'var(--text-primary)' },
          { label: 'Limit',     value: rupee(budget.limitAmount),    color: 'var(--text-primary)' },
          { label: 'Remaining', value: rupee(Math.max(budget.remainingAmount ?? 0, 0)), color: over ? 'var(--red)' : 'var(--green)' },
        ].map((s) => (
          <div key={s.label} className="bc-amount-cell">
            <span className="bc-amount-label">{s.label}</span>
            <span className="bc-amount-value mono" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="bc-bar-track">
          <div className="bc-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <div className="bc-bar-footer">
          {over
            ? <span className="bc-alert"><AlertTriangle size={11} /> Over by {((budget.usagePercentage ?? 0) - 100).toFixed(1)}%</span>
            : warn
              ? <span className="bc-alert" style={{ color: 'var(--orange)' }}><AlertTriangle size={11} /> {pct.toFixed(1)}% used</span>
              : <span className="bc-pct">{pct.toFixed(1)}% used</span>
          }
          <span className="bc-dates">{fmtDate(budget.startDate)} – {fmtDate(budget.endDate)}</span>
        </div>
      </div>

      <style>{`
        .budget-card { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          animation: slideInRight 0.5s ease both;
          transition: all 0.3s ease;
        }
        .budget-card:hover {
          transform: translateY(-2px);
        }
        .budget-over { 
          border-color: rgba(239,68,68,0.3) !important; 
          box-shadow: 0 0 20px rgba(239,68,68,0.2) !important;
          animation: pulse 2s infinite;
        }

        .bc-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .bc-header > div:first-child { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .bc-category { font-weight: 700; font-size: 15px; color: var(--text-primary); }

        .bc-amounts {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .bc-amount-cell {
          padding: 12px 14px;
          display: flex; flex-direction: column; gap: 4px;
          border-right: 1px solid var(--border);
        }
        .bc-amount-cell:last-child { border-right: none; }
        .bc-amount-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }
        .bc-amount-value { font-size: 13px; font-weight: 500; }

        .bc-bar-track { 
          height: 6px; 
          background: var(--bg-surface); 
          border-radius: 999px; 
          overflow: hidden; 
          margin-bottom: 8px;
          position: relative;
        }
        .bc-bar-track::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 2s infinite;
        }
        .bc-bar-fill  { 
          height: 100%; 
          border-radius: 999px; 
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .bc-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 1.5s infinite;
        }

        .bc-bar-footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
        .bc-alert { display: flex; align-items: center; gap: 4px; color: var(--red); font-weight: 600; }
        .bc-pct   { color: var(--text-muted); }
        .bc-dates { font-family: var(--font-mono); color: var(--text-muted); }

        .icon-btn { 
          padding:5px 6px; 
          border-radius:6px; 
          color:var(--text-muted); 
          transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display:inline-flex; 
          align-items:center;
          position: relative;
          overflow: hidden;
        }
        .icon-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s;
        }
        .icon-btn:hover::before {
          width: 40px;
          height: 40px;
        }
        .icon-btn:hover { 
          background:var(--bg-card-hover); 
          color:var(--gold); 
          transform: scale(1.1);
        }
        .icon-btn.danger:hover { 
          background:var(--red-dim); 
          color:var(--red); 
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
