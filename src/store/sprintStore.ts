import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const sprintStore = proxy({
  list: [] as any[],
  loading: false,

  single: {
    data: null as any,
    loading: false,
  },

  async getProjectSprints(projectId: string) {
    this.loading = true;
    const res = await $axios.get(`/sprint/project/${projectId}`);
    this.list = res.data.data;
    this.loading = false;
  },

  async getSprintDetails(sprintId: string) {
    this.single.loading = true;
    const res = await $axios.get(
      `/sprint/${sprintId}/details`,
    );
    this.single.data = res.data.data;
    this.single.loading = false;
  },

  async createSprint(payload: any) {
    return $axios.post('/sprint', payload);
  },

  async updateSprint(sprintId: string, payload: any) {
    const res = await $axios.patch(
      `/sprint/${sprintId}`,
      payload,
    );

    this.list = this.list.map((s) =>
      s._id === sprintId ? res.data.data : s,
    );

    return res;
  },

  async deleteSprint(sprintId: string) {
    await $axios.delete(`/sprint/${sprintId}`);
    this.list = this.list.filter((s) => s._id !== sprintId);
  },

  async reorderSprints(projectId: string, items: any[]) {
    return $axios.patch('/sprint/reorder', {
      projectId,
      items,
    });
  },
});
