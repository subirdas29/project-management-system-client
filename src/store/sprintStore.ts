import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const sprintStore = proxy({
  list: [] as any[],
  loading: false,

  async getProjectSprints(projectId: string) {
    this.loading = true;
    const res = await $axios.get(`/sprint/project/${projectId}`);
    this.list = res.data.data;
    this.loading = false;
  },

  async createSprint(payload: any) {
    return $axios.post('/sprint', payload);
  },

  async updateSprint(id: string, payload: any) {
    return $axios.patch(`/sprint/${id}`, payload);
  },

  async deleteSprint(id: string) {
    return $axios.delete(`/sprint/${id}`);
  },

  async reorderSprints(projectId: string, items: any[]) {
    return $axios.post('/sprint/reorder', {
      projectId,
      items,
    });
  },
});
