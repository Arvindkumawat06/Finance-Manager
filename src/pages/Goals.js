import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, X, Target, CheckCircle, PlusCircle, XCircle } from 'lucide-react';
import goalService from '../services/goalService';

const rupee = (n) =>
  new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n??0);

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—';

const STATUS_CFG = {
  IN_PROGRESS: { label:'In Progress', cls:'badge-blue' },
  COMPLETED:   { label:'Completed',   cls:'badge-green' },
  CANCELLED:   { label:'Cancelled',   cls:'badge-red' },
};

const EMPTY = { name:'', description:'', targetAmount:'', savedAmount:'', targetDate:'' };

export default function Goals() {
  const [goals,     setGoals]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('ALL');
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [contModal, setContModal] = useState(null);
  const [contAmt,   setContAmt]   = useState('');

  const load = useCallback(() => {
    setLoading(true);
    goalService.getAll().then(setGoals).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const displayed = filter === 'ALL' ? goals : goals.filter(g => g.status === filter);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (g) => {
    setEditing(g);
    setForm({ name:g.name, description:g.description||'',
              targetAmount:String(g.targetAmount), savedAmount:String(g.savedAmount), targetDate:g.targetDate });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, targetAmount:parseFloat(form.targetAmount), savedAmount:parseFloat(form.savedAmount||0) };
    try {
      if (editing) { await goalService.update(editing.id, payload); toast.success('Goal updated'); }
      else         { await goalService.create(payload);             toast.success('Goal created'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); }
  };

  const handleDelete = async (g) => {
    if (!window.confirm(`Delete goal "${g.name}"?`)) return;
    try { await goalService.remove(g.id); toast.success('Goal deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    const amt = parseFloat(contAmt);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    try {
      await goalService.contribute(contModal.id, amt);
      toast.success(`${rupee(amt)} added to "${contModal.name}"`);
      setContModal(null); setContAmt(''); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleStatus = async (g, status) => {
    try { await goalService.updateStatus(g.id, status); toast.success('Status updated'); load(); }
    catch { toast.error('Update failed'); }
  };

  const totalTarget = goals.reduce((s,g) => s+(g.targetAmount||0), 0);
  const totalSaved  = goals.reduce((s,g) => s+(g.savedAmount||0),  0);
  const completed   = goals.filter(g => g.status==='COMPLETED').length;

  return (
    <div>
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom:0 }}>
          <h1>Goals</h1>
          <p>Save with purpose — track every milestone.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={15} /> New Goal
        </button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Total Goals',  value:goals.length,        color:'var(--gold)' },
            { label:'Completed',    value:completed,            color:'var(--green)' },
            { label:'Total Target', value:rupee(totalTarget),  color:'var(--blue)' },
            { label:'Total Saved',  value:rupee(totalSaved),   color:'var(--purple)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:'16px 20px' }}>
              <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:700, marginBottom:'8px' }}>{s.label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'1.2rem', color:s.color, fontWeight:500 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {['ALL','IN_PROGRESS','COMPLETED','CANCELLED'].map(f => (
          <button key={f}
            className={`btn ${filter===f?'btn-primary':'btn-ghost'}`}
            style={{ fontSize:'12px', padding:'8px 14px' }}
            onClick={() => setFilter(f)}>
            {f==='ALL'?'All':STATUS_CFG[f]?.label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="loading-wrap"><div className="loading-ring" /></div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Target size={24} /></div>
          <h3>No goals here</h3>
          <p>Create a savings goal and start working towards it.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:'20px' }}>
          {displayed.map(g => {
            const pct  = Math.min(g.progressPercentage ?? 0, 100);
            const done = g.status === 'COMPLETED';
            const cfg  = STATUS_CFG[g.status] || STATUS_CFG.IN_PROGRESS;
            const barColor = done ? 'var(--green)' : pct>=80 ? 'var(--orange)' : 'var(--gold)';

            return (
              <div key={g.id} className="card" style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {/* Top */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'15px', color:'var(--text-primary)', marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {g.name}
                    </div>
                    {g.description && (
                      <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{g.description}</div>
                    )}
                  </div>
                  <span className={`badge ${cfg.cls}`} style={{ flexShrink:0 }}>{cfg.label}</span>
                </div>

                {/* Amounts */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  {[
                    { label:'Saved',     value:rupee(g.savedAmount),  color:'var(--green)' },
                    { label:'Target',    value:rupee(g.targetAmount), color:'var(--gold)' },
                    { label:'Remaining', value:rupee(Math.max(g.remainingAmount??0,0)), color:'var(--text-secondary)' },
                    { label:'Due Date',  value:fmtDate(g.targetDate), color:'var(--text-secondary)', mono:false },
                  ].map(s => (
                    <div key={s.label} style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-sm)', padding:'10px 12px' }}>
                      <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-muted)', marginBottom:'4px', fontWeight:600 }}>{s.label}</div>
                      <div style={{ fontFamily:s.mono!==false?'var(--font-mono)':'var(--font-body)', fontSize:'13px', color:s.color, fontWeight:500 }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', marginBottom:'6px' }}>
                    <span style={{ color:'var(--text-muted)', fontWeight:600 }}>Progress</span>
                    <span style={{ fontFamily:'var(--font-mono)', color:barColor, fontWeight:600 }}>{pct.toFixed(1)}%</span>
                  </div>
                  <div style={{ background:'var(--bg-surface)', borderRadius:'999px', height:'7px', overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', borderRadius:'999px', background:barColor, transition:'width 0.7s ease' }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {g.status==='IN_PROGRESS' && (
                    <button className="btn btn-primary" style={{ fontSize:'12px', padding:'7px 12px', flex:1 }}
                      onClick={() => { setContModal(g); setContAmt(''); }}>
                      <PlusCircle size={13} /> Contribute
                    </button>
                  )}
                  <button className="btn btn-ghost" style={{ fontSize:'12px', padding:'7px 12px' }} onClick={() => openEdit(g)}>Edit</button>
                  {g.status==='IN_PROGRESS' && (
                    <button className="btn btn-ghost" style={{ fontSize:'12px', padding:'7px 12px' }}
                      onClick={() => handleStatus(g,'CANCELLED')}>
                      <XCircle size={13} /> Cancel
                    </button>
                  )}
                  <button className="btn btn-danger" style={{ fontSize:'12px', padding:'7px 10px' }} onClick={() => handleDelete(g)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Goal' : 'New Goal'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Name</label>
                <input placeholder="e.g. Emergency Fund"
                  value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <input placeholder="What is this goal for?"
                  value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Target Amount (₹)</label>
                  <input type="number" min="1" step="1" placeholder="100000"
                    value={form.targetAmount} onChange={e => setForm(f=>({...f,targetAmount:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Already Saved (₹)</label>
                  <input type="number" min="0" step="1" placeholder="0"
                    value={form.savedAmount} onChange={e => setForm(f=>({...f,savedAmount:e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label>Target Date</label>
                <input type="date" value={form.targetDate}
                  onChange={e => setForm(f=>({...f,targetDate:e.target.value}))} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Goal' : 'Create Goal'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {contModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setContModal(null)}>
          <div className="modal" style={{ maxWidth:'400px' }}>
            <div className="modal-header">
              <h2>Contribute to Goal</h2>
              <button className="modal-close" onClick={() => setContModal(null)}><X size={18} /></button>
            </div>
            <div style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-sm)', padding:'14px 16px', marginBottom:'20px' }}>
              <div style={{ fontWeight:600, marginBottom:'4px', fontSize:'14px' }}>{contModal.name}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-secondary)' }}>
                {rupee(contModal.savedAmount)} / {rupee(contModal.targetAmount)}
              </div>
              <div style={{ background:'var(--bg-base)', borderRadius:'999px', height:'5px', overflow:'hidden', marginTop:'10px' }}>
                <div style={{ width:`${Math.min(contModal.progressPercentage??0,100)}%`, height:'100%', borderRadius:'999px', background:'var(--gold)', transition:'width 0.5s ease' }} />
              </div>
            </div>
            <form className="modal-form" onSubmit={handleContribute}>
              <div className="form-group">
                <label>Amount to Add (₹)</label>
                <input type="number" min="1" step="1" placeholder="e.g. 5000"
                  value={contAmt} onChange={e => setContAmt(e.target.value)} autoFocus required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setContModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={13} /> Add Contribution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
