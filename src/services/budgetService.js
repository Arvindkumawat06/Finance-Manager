import api from './api';

const budgetService = {
  async getAll()       { const { data } = await api.get('/budgets');        return data; },
  async getActive()    { const { data } = await api.get('/budgets/active'); return data; },
  async create(p)      { const { data } = await api.post('/budgets', p);    return data; },
  async update(id, p)  { const { data } = await api.put(`/budgets/${id}`, p); return data; },
  async remove(id)     { await api.delete(`/budgets/${id}`); },
};

export default budgetService;
