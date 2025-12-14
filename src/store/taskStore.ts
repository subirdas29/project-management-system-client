import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const taskStore = proxy({
  listBySprint: {} as Record<string, any[]>,
  single: null as any,

  async getTasks(filters: { sprintId: string }) {
    const res = await $axios.get('/tasks', {
      params: filters,
    });

    this.listBySprint = {
      ...this.listBySprint,
      [filters.sprintId]: res.data.data,
    };
  },

  async getSingleTask(taskId: string) {
    const res = await $axios.get(`/tasks/${taskId}`);
    this.single = res.data.data;
  },

  async createTask(payload: {
    title: string;
    description?: string;
    sprintId: string;
  }) {
    const res = await $axios.post('/tasks', payload);


    await this.getTasks({ sprintId: payload.sprintId });

    return res;
  },

  async updateTask(taskId: string, payload: any) {
    return $axios.patch(`/tasks/${taskId}`, payload);
  },

  async updateTaskStatus(taskId: string, status: string) {
    return $axios.patch(`/tasks/${taskId}/status`, { status });
  },

  async deleteTask(taskId: string, sprintId: string) {
    await $axios.delete(`/tasks/${taskId}`);
    await this.getTasks({ sprintId });
  },
});
