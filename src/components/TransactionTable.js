import React from 'react';
import { TrendingUp, TrendingDown, ArrowLeftRight, Pencil, Trash2 } from 'lucide-react';

const TYPE_CFG = {
  INCOME:   { label: 'Income',   badgeCls: 'badge-green',  icon: TrendingUp,     color: 'var(--green)', sign: '+' },
  EXPENSE:  { label: 'Expense',  badgeCls: 'badge-red',    icon: TrendingDown,   color: 'var(--red)',   sign: '-' },
  TRANSFER: { label: 'Transfer', badgeCls: 'badge-blue',   icon: ArrowLeftRight, color: 'var(--blue)',  sign:  '' },
};

const rupee = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function TransactionTable({ transactions = [], onEdit, onDelete, loading }) {
  if (loading) return (
    <div className="loading-wrap"><div className="loading-ring" /></div>
  );

  if (!transactions.length) return (
    <div className="empty-state">
      <div className="empty-state-icon"><ArrowLeftRight size={24} /></div>
      <h3>No transactions yet</h3>
      <p>Add your first transaction to get started.</p>
    </div>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Date</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            {(onEdit || onDelete) && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const cfg  = TYPE_CFG[tx.type] || TYPE_CFG.TRANSFER;
            const Icon = cfg.icon;
            const amtCls = tx.type === 'INCOME' ? 'amount-positive'
                         : tx.type === 'EXPENSE' ? 'amount-negative'
                         : 'amount-neutral';
            return (
              <tr key={tx.id} className="tx-row">
                <td>
                  <div className="tx-desc-cell">
                    <div className="tx-icon" style={{ background: `${cfg.color}18`, color: cfg.color }}>
                      <Icon size={13} />
                    </div>
                    <div>
                      <div className="tx-desc">{tx.description}</div>
                      {tx.notes && <div className="tx-notes">{tx.notes}</div>}
                    </div>
                  </div>
                </td>
                <td><span className="tx-category">{tx.category}</span></td>
                <td><span className={`badge ${cfg.badgeCls}`}>{cfg.label}</span></td>
                <td className="tx-date">{fmtDate(tx.date)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={amtCls}>{cfg.sign}{rupee(tx.amount)}</span>
                </td>
                {(onEdit || onDelete) && (
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {onEdit   && <button className="icon-btn"        onClick={() => onEdit(tx)}><Pencil  size={14} /></button>}
                    {onDelete && <button className="icon-btn danger" onClick={() => onDelete(tx)}><Trash2 size={14} /></button>}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        .tx-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tx-table th {
          text-align: left; padding: 10px 16px;
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }
        .tx-row td { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        .tx-row:last-child td { border-bottom: none; }
        .tx-row:hover td { background: rgba(255,255,255,0.015); }

        .tx-desc-cell { display: flex; align-items: center; gap: 10px; }
        .tx-icon {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .tx-desc  { font-weight: 500; color: var(--text-primary); font-size: 13px; }
        .tx-notes { font-size: 11px; color: var(--text-muted); margin-top: 1px; }

        .tx-category {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .tx-date { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); }

        .icon-btn {
          padding: 5px 6px; border-radius: 6px;
          color: var(--text-muted);
          transition: all var(--transition);
          display: inline-flex; align-items: center;
        }
        .icon-btn:hover { background: var(--bg-card-hover); color: var(--gold); }
        .icon-btn.danger:hover { background: var(--red-dim); color: var(--red); }
      `}</style>
    </div>
  );
}
