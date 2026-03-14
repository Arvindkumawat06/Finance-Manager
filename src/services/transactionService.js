import api from './api';

const transactionService = {
  async getAll(page = 0, size = 20) {
    const { data } = await api.get('/transactions', {
      params: { page, size, sort: 'date,desc' },
    });
    return data;
  },
  async getByType(type, page = 0, size = 20) {
    const { data } = await api.get('/transactions/filter', {
      params: { type, page, size },
    });
    return data;
  },
  async getSummary() {
    const { data } = await api.get('/transactions/summary');
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/transactions', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/transactions/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/transactions/${id}`);
  },
};

export default transactionService;
