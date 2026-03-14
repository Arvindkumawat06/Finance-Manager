import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import analyticsService   from '../services/analyticsService';
import transactionService from '../services/transactionService';
import TransactionTable   from '../components/TransactionTable';
import '../styles/dashboard.css';

const rupee = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);

const COLORS = ['#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
      borderRadius: '10px', padding: '12px 16px', fontSize: '12px'
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>
          {p.name}: {rupee(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getOverview(),
      transactionService.getAll(0, 6),
    ]).then(([ov, tx]) => {
      setOverview(ov);
      setRecent(tx.content || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-wrap"><div className="loading-ring" /></div>;

  const kpis = [
    { label: 'Total Balance',    value: rupee(overview?.totalBalance),    color: 'var(--gold)',   bg: 'var(--gold-dim)',   emoji: '💰' },
    { label: 'Monthly Income',   value: rupee(overview?.monthlyIncome),   color: 'var(--green)',  bg: 'var(--green-dim)', emoji: '📈' },
    { label: 'Monthly Expenses', value: rupee(overview?.monthlyExpenses), color: 'var(--red)',    bg: 'var(--red-dim)',   emoji: '📉' },
    { label: 'Monthly Savings',  value: rupee(overview?.monthlySavings),  color: 'var(--blue)',   bg: 'var(--blue-dim)',  emoji: '🏦' },
  ];

  const trendData = [...(overview?.last6MonthsTrend || [])].reverse().map(t => ({
    name:     t.period,
    Income:   Number(t.income),
    Expenses: Number(t.expenses),
  }));

  const pieData = (overview?.topExpenseCategories || []).slice(0, 6).map(c => ({
    name: c.category, value: Number(c.amount),
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋</h1>
        <p>Here's your financial snapshot for {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="kpi-icon" style={{ background: k.bg, fontSize: '18px' }}>{k.emoji}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="chart-row-2">
        {/* Area Chart */}
        <div className="card">
          <div className="card-title">6-Month Income vs Expenses</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={70}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Income"   stroke="#10b981" fill="url(#gI)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Expenses" stroke="#ef4444" fill="url(#gE)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-title">Top Expense Categories</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v) => rupee(v)}
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {pieData.map((d, i) => (
                  <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'inline-block' }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No expense data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="chart-row-3" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Active Budgets',    value: overview?.activeBudgetsCount    ?? 0, color: 'var(--blue)' },
          { label: 'Goals In Progress', value: overview?.goalsInProgressCount  ?? 0, color: 'var(--purple)' },
          { label: 'Net This Month',    value: rupee((overview?.monthlyIncome ?? 0) - (overview?.monthlyExpenses ?? 0)),
            color: ((overview?.monthlyIncome ?? 0) - (overview?.monthlyExpenses ?? 0)) >= 0 ? 'var(--green)' : 'var(--red)' },
        ].map((s) => (
          <div key={s.label} className="stat-pill">
            <div className="stat-pill-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-pill-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Recent Transactions</div>
          <Link to="/transactions" style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
            View all →
          </Link>
        </div>
        <TransactionTable transactions={recent} />
      </div>
    </div>
  );
}
