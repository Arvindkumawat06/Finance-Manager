import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Search } from 'lucide-react';
import TransactionTable   from '../components/TransactionTable';
import transactionService from '../services/transactionService';

const CATEGORIES = ['Food','Transport','Housing','Utilities','Healthcare','Entertainment','Shopping','Education','Salary','Investment','Other'];
const EMPTY = { description:'', amount:'', category:'', type:'EXPENSE', date: new Date().toISOString().split('T')[0], notes:'' };

const rupee = (n) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n ?? 0);

export default function Transactions() {
  const [data,    setData]    = useState({ content:[], totalPages:0 });
  const [page,    setPage]    = useState(0);
  const [filter,  setFilter]  = useState('ALL');
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [summary, setSummary] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const req = filter === 'ALL'
      ? transactionService.getAll(page)
      : transactionService.getByType(filter, page);
    req.then(setData).finally(() => setLoading(false));
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { transactionService.getSummary().then(setSummary).catch(() => {}); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (tx) => {
    setEditing(tx);
    setForm({ description:tx.description, amount:String(tx.amount), category:tx.category,
              type:tx.type, date:tx.date, notes:tx.notes||'' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    try {
      if (editing) { await transactionService.update(editing.id, payload); toast.success('Transaction updated'); }
      else         { await transactionService.create(payload);             toast.success('Transaction added'); }
      setModal(false); load();
      transactionService.getSummary().then(setSummary).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (tx) => {
    if (!window.confirm(`Delete "${tx.description}"?`)) return;
    try {
      await transactionService.remove(tx.id);
      toast.success('Deleted');
      load();
      transactionService.getSummary().then(setSummary).catch(() => {});
    } catch { toast.error('Delete failed'); }
  };

  const displayed = search.trim()
    ? (data.content||[]).filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()))
    : (data.content||[]);

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Transactions</h1>
          <p>Every rupee in and out, in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={15} /> Add Transaction
        </button>
      </div>

      {/* Summary Strip */}
      {summary && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Total Income',   value: rupee(summary.totalIncome),   color:'var(--green)' },
            { label:'Total Expenses', value: rupee(summary.totalExpenses),  color:'var(--red)'   },
            { label:'Net Balance',    value: rupee(summary.netBalance),     color:'var(--gold)'  },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:'16px 20px' }}>
              <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:700, marginBottom:'8px' }}>{s.label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:s.color, fontWeight:500 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:'36px' }} />
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {['ALL','INCOME','EXPENSE','TRANSFER'].map(f => (
            <button key={f}
              className={`btn ${filter===f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize:'12px', padding:'8px 14px' }}
              onClick={() => { setFilter(f); setPage(0); }}>
              {f === 'ALL' ? 'All' : f.charAt(0)+f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding:'0' }}>
        <div style={{ padding:'18px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:600 }}>
            {displayed.length} transaction{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ padding:'8px 0' }}>
          <TransactionTable transactions={displayed} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
        </div>
        {data.totalPages > 1 && !search && (
          <div style={{ display:'flex', gap:'8px', justifyContent:'center', padding:'18px', borderTop:'1px solid var(--border)' }}>
            <button className="btn btn-ghost" disabled={page===0} onClick={() => setPage(p=>p-1)}>← Prev</button>
            <span style={{ padding:'9px 16px', fontFamily:'var(--font-mono)', fontSize:'13px', color:'var(--text-secondary)' }}>
              {page+1} / {data.totalPages}
            </span>
            <button className="btn btn-ghost" disabled={page>=data.totalPages-1} onClick={() => setPage(p=>p+1)}>Next →</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Transaction' : 'New Transaction'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Description</label>
                <input placeholder="e.g. Monthly groceries"
                  value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" min="0.01" step="0.01" placeholder="0.00"
                    value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <input placeholder="Any extra details…"
                  value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add Transaction'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
