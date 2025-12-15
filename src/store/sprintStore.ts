import { proxy } from 'valtio';
import $axios from '@/_api/axios';
import type { Sprint } from '@/types/sprint';

export const sprintStore = proxy({
  list: [] as Sprint[],
  loading: false,

  single: {
    data: null as Sprint | null,
    loading: false,
  },

  async getProjectSprints(projectId: string) {
    this.loading = true;
    const res = await $axios.get<{ data: Sprint[] }>(
      `/sprint/project/${projectId}`
    );
    this.list = res.data.data;
    this.loading = false;
  },

  async getSprintDetails(sprintId: string) {
    this.single.loading = true;
    const res = await $axios.get<{ data: Sprint }>(
      `/sprint/${sprintId}/details`
    );
    this.single.data = res.data.data;
    this.single.loading = false;
  },

  async createSprint(payload: Partial<Sprint>) {
    return $axios.post('/sprint', payload);
  },

  async updateSprint(
    sprintId: string,
    payload: Partial<Sprint>
  ) {
    const res = await $axios.patch<{ data: Sprint }>(
      `/sprint/${sprintId}`,
      payload
    );

    this.list = this.list.map((s) =>
      s._id === sprintId ? res.data.data : s
    );

    return res;
  },

  async deleteSprint(sprintId: string) {
    await $axios.delete(`/sprint/${sprintId}`);
    this.list = this.list.filter(
      (s) => s._id !== sprintId
    );
  },

  async reorderSprints(
    projectId: string,
    items: Pick<Sprint, '_id' | 'order'>[]
  ) {
    return $axios.patch('/sprint/reorder', {
      projectId,
      items,
    });
  },
});
