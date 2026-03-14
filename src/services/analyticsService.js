import api from './api';

const analyticsService = {
  async getOverview()             { const { data } = await api.get('/analytics/overview');  return data; },
  async getMonthlySummary(y, m)   { const { data } = await api.get('/analytics/monthly',   { params: { year: y, month: m } }); return data; },
  async getCategoryBreakdown(f,t) { const { data } = await api.get('/analytics/categories',{ params: { from: f, to: t } }); return data; },
  async getSpendingTrends()       { const { data } = await api.get('/analytics/trends');    return data; },
};

export default analyticsService;
