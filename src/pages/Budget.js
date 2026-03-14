import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Wallet } from 'lucide-react';
import BudgetCard   from '../components/BudgetCard';
import budgetService from '../services/budgetService';

const CATEGORIES = ['Food','Transport','Housing','Utilities','Healthcare','Entertainment','Shopping','Education','Investment','Other'];
const today    = () => new Date().toISOString().split('T')[0];
const monthEnd = () => { const d = new Date(); d.setMonth(d.getMonth()+1,0); return d.toISOString().split('T')[0]; };
const EMPTY = { category:'', limitAmount:'', startDate:today(), endDate:monthEnd(), period:'MONTHLY' };

const rupee = (n) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n ?? 0);

export default function Budget() {
  const [budgets,  setBudgets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('active');
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);

  const load = useCallback(() => {
    setLoading(true);
    const req = tab === 'active' ? budgetService.getActive() : budgetService.getAll();
    req.then(setBudgets).finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (b) => {
    setEditing(b);
    setForm({ category:b.category, limitAmount:String(b.limitAmount),
              startDate:b.startDate, endDate:b.endDate, period:b.period });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, limitAmount: parseFloat(form.limitAmount) };
    try {
      if (editing) { await budgetService.update(editing.id, payload); toast.success('Budget updated'); }
      else         { await budgetService.create(payload);             toast.success('Budget created'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); }
  };

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete "${b.category}" budget?`)) return;
    try { await budgetService.remove(b.id); toast.success('Budget deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const totalLimit = budgets.reduce((s,b) => s+(b.limitAmount||0), 0);
  const totalSpent = budgets.reduce((s,b) => s+(b.spentAmount||0), 0);
  const overCount  = budgets.filter(b => (b.usagePercentage||0) > 100).length;

  return (
    <div>
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom:0 }}>
          <h1>Budgets</h1>
          <p>Set spending limits and get alerted when you're close.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={15} /> New Budget
        </button>
      </div>

      {/* Summary */}
      {budgets.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Total Budgeted', value:rupee(totalLimit),  color:'var(--gold)' },
            { label:'Total Spent',    value:rupee(totalSpent),  color:totalSpent>totalLimit?'var(--red)':'var(--green)' },
            { label:'Over Budget',    value:`${overCount} budget${overCount!==1?'s':''}`, color:overCount>0?'var(--red)':'var(--green)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:'16px 20px' }}>
              <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:700, marginBottom:'8px' }}>{s.label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:s.color, fontWeight:500 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {[['active','Active'],['all','All Budgets']].map(([val,label]) => (
          <button key={val}
            className={`btn ${tab===val?'btn-primary':'btn-ghost'}`}
            style={{ fontSize:'12px', padding:'8px 16px' }}
            onClick={() => setTab(val)}>
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-wrap"><div className="loading-ring" /></div>
      ) : budgets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Wallet size={24} /></div>
          <h3>No {tab==='active'?'active ':''}budgets yet</h3>
          <p>Create a budget to start tracking your spending limits.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px,1fr))', gap:'20px' }}>
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Budget' : 'New Budget'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Period</label>
                  <select value={form.period} onChange={e => setForm(f=>({...f,period:e.target.value}))}>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Spending Limit (₹)</label>
                <input type="number" min="1" step="1" placeholder="e.g. 15000"
                  value={form.limitAmount} onChange={e => setForm(f=>({...f,limitAmount:e.target.value}))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f=>({...f,startDate:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f=>({...f,endDate:e.target.value}))} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Budget' : 'Create Budget'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
