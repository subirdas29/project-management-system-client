import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const taskStore = proxy({
  listBySprint: {} as Record<string, any[]>,

  async getTasks(filters: { sprintId: string }) {
    const res = await $axios.get('/tasks', {
      params: filters,
    });

    this.listBySprint[filters.sprintId] =
      res.data.result;
  },

  async createTask(payload: {
    title: string;
    description?: string;
    sprintId: string;
  }) {
    return $axios.post('/tasks', payload);
  },
});
