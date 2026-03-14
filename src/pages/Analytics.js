import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import analyticsService from '../services/analyticsService';

const rupee   = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n??0);
const fmtPct  = (n) => `${(n??0).toFixed(1)}%`;
const COLORS  = ['#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#f97316','#06b6d4'];

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-gold)', borderRadius:'10px', padding:'12px 16px', fontSize:'12px' }}>
      <p style={{ color:'var(--text-muted)', marginBottom:'8px', fontFamily:'var(--font-mono)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color:p.color, fontFamily:'var(--font-mono)', marginBottom:'2px' }}>
          {p.name}: {rupee(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [trends,    setTrends]    = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [monthly,   setMonthly]   = useState(null);
  const [selMonth,  setSelMonth]  = useState(new Date());
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    const yr = selMonth.getFullYear();
    const mo = selMonth.getMonth() + 1;
    const pad = (n) => String(n).padStart(2,'0');
    const from = `${yr}-${pad(mo)}-01`;
    const lastDay = new Date(yr, mo, 0).getDate();
    const to   = `${yr}-${pad(mo)}-${pad(lastDay)}`;

    Promise.all([
      analyticsService.getSpendingTrends(),
      analyticsService.getCategoryBreakdown(from, to),
      analyticsService.getMonthlySummary(yr, mo),
    ]).then(([tr, bd, ms]) => {
      setTrends([...(tr||[])].reverse().map(t => ({
        name: t.period,
        Income:   Number(t.income),
        Expenses: Number(t.expenses),
        Savings:  Number(t.savings),
      })));
      setBreakdown(bd||[]);
      setMonthly(ms);
    }).finally(() => setLoading(false));
  }, [selMonth]);

  const prevMonth = () => {
    const d = new Date(selMonth); d.setMonth(d.getMonth()-1); setSelMonth(d);
  };
  const nextMonth = () => {
    const d = new Date(selMonth); d.setMonth(d.getMonth()+1);
    if (d <= new Date()) setSelMonth(d);
  };

  const monthLabel = selMonth.toLocaleDateString('en-IN', { month:'long', year:'numeric' });

  if (loading) return <div className="loading-wrap"><div className="loading-ring" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Deep insights into your income, spending, and savings patterns.</p>
      </div>

      {/* Month selector */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
        <button className="btn btn-ghost" style={{ padding:'8px 14px' }} onClick={prevMonth}>←</button>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'14px', color:'var(--text-primary)', minWidth:'160px', textAlign:'center', fontWeight:500 }}>
          {monthLabel}
        </span>
        <button className="btn btn-ghost" style={{ padding:'8px 14px' }} onClick={nextMonth}>→</button>
      </div>

      {/* Monthly KPIs */}
      {monthly && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Income',       value:rupee(monthly.totalIncome),  color:'var(--green)' },
            { label:'Expenses',     value:rupee(monthly.totalExpenses), color:'var(--red)' },
            { label:'Net Savings',  value:rupee(monthly.netSavings),   color:monthly.netSavings>=0?'var(--gold)':'var(--red)' },
            { label:'Savings Rate', value:fmtPct(monthly.savingsRate), color:'var(--purple)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
              <div style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', fontWeight:700, marginBottom:'8px' }}>{k.label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'1.25rem', color:k.color, fontWeight:500 }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Area + Pie */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:'20px', marginBottom:'20px' }}>
        <div className="card">
          <div className="card-title">6-Month Spending Trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trends} margin={{ top:4, right:4, left:0, bottom:0 }}>
              <defs>
                {[['gAI','#10b981'],['gAE','#ef4444'],['gAS','#f59e0b']].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:10 }} axisLine={false} tickLine={false} width={70}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="Income"   stroke="#10b981" fill="url(#gAI)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Expenses" stroke="#ef4444" fill="url(#gAE)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Savings"  stroke="#f59e0b" fill="url(#gAS)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Expenses by Category</div>
          {breakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={breakdown} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="amount" nameKey="category" stroke="none">
                  {breakdown.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => rupee(v)}
                  contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-gold)', borderRadius:'8px', fontSize:'12px' }} />
                <Legend iconType="circle" iconSize={8}
                  formatter={v => <span style={{ color:'var(--text-secondary)', fontSize:'11px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding:'40px 0' }}><p>No expense data this month.</p></div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card" style={{ marginBottom:'20px' }}>
        <div className="card-title">Monthly Income vs Expenses Comparison</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trends} barGap={4} margin={{ top:4, right:4, left:0, bottom:0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'var(--text-muted)', fontSize:10 }} axisLine={false} tickLine={false} width={70}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<TT />} />
            <Legend formatter={v => <span style={{ color:'var(--text-secondary)', fontSize:'11px' }}>{v}</span>} />
            <Bar dataKey="Income"   fill="#10b981" radius={[4,4,0,0]} maxBarSize={32} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4,4,0,0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Table */}
      {breakdown.length > 0 && (
        <div className="card">
          <div className="card-title">Category Breakdown — {monthLabel}</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead>
                <tr>
                  {['Category','Transactions','Amount','Share',''].map(h => (
                    <th key={h} style={{ textAlign: h===''||h==='Amount'||h==='Share'?'right':'left', padding:'8px 14px', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', borderBottom:'1px solid var(--border)', fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row,i) => (
                  <tr key={row.category} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:COLORS[i%COLORS.length], flexShrink:0, display:'inline-block' }} />
                        <span style={{ fontWeight:500 }}>{row.category}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px', color:'var(--text-secondary)' }}>{row.transactionCount}</td>
                    <td style={{ padding:'12px 14px', textAlign:'right', fontFamily:'var(--font-mono)', color:'var(--red)', fontWeight:500 }}>{rupee(row.amount)}</td>
                    <td style={{ padding:'12px 14px', textAlign:'right', fontFamily:'var(--font-mono)', color:'var(--text-secondary)' }}>{fmtPct(row.percentage)}</td>
                    <td style={{ padding:'12px 14px', width:'120px' }}>
                      <div style={{ background:'var(--bg-surface)', borderRadius:'999px', height:'5px', overflow:'hidden' }}>
                        <div style={{ width:`${Math.min(row.percentage,100)}%`, height:'100%', background:COLORS[i%COLORS.length], borderRadius:'999px' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
