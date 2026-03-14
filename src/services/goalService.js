import api from './api';

const goalService = {
  async getAll()           { const { data } = await api.get('/goals');                                             return data; },
  async create(p)          { const { data } = await api.post('/goals', p);                                        return data; },
  async update(id, p)      { const { data } = await api.put(`/goals/${id}`, p);                                   return data; },
  async contribute(id, amt){ const { data } = await api.post(`/goals/${id}/contribute`, { amount: amt });         return data; },
  async updateStatus(id,s) { const { data } = await api.patch(`/goals/${id}/status`, null, { params:{status:s}});return data; },
  async remove(id)         { await api.delete(`/goals/${id}`); },
};

export default goalService;
