import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const taskStore = proxy({
  listBySprint: {} as Record<string, any[]>,
  single: null as any,

  table: {
    data: [] as any[],
    loading: false,
    error: null as string | null,
    meta: null as any,
    filters: {
      projectId: '',
      sprintId: 'all',
      assignee: 'all',
      status: 'all',
      priority: 'all',
      search: '',
    },
  },

  async getTasks(filters: { sprintId: string }) {
    const res = await $axios.get('/tasks', { params: filters });
    this.listBySprint = { ...this.listBySprint, [filters.sprintId]: res.data.data };
  },

  async getSingleTask(taskId: string) {
    const res = await $axios.get(`/tasks/${taskId}`);
    this.single = res.data.data;
  },

  async createTask(payload: any) {
    const res = await $axios.post('/tasks', payload);
    await this.getTasks({ sprintId: payload.sprintId });
    return res;
  },

  async updateTask(taskId: string, payload: any) {
    const res = await $axios.patch(`/tasks/${taskId}`, payload);
    const updatedTask = res.data.data;

    const sprintId =
      typeof updatedTask.sprintId === 'object'
        ? updatedTask.sprintId._id
        : updatedTask.sprintId;

    const prev = this.listBySprint[sprintId] || [];
    this.listBySprint[sprintId] = prev.map((t) => (t._id === taskId ? updatedTask : t));

    return res;
  },

  async updateTaskStatus(taskId: string, status: string) {
    return $axios.patch(`/tasks/${taskId}/status`, { status });
  },

  async deleteTask(taskId: string, sprintId: string) {
    await $axios.delete(`/tasks/${taskId}`);
    await this.getTasks({ sprintId });
  },

  async getTasksTable() {
    this.table.loading = true;
    this.table.error = null;

    try {
      const { filters } = this.table;

      const params: any = {
        projectId: filters.projectId,
      };

      if (filters.sprintId !== 'all') params.sprintId = filters.sprintId;
      if (filters.assignee !== 'all') params.assignees = filters.assignee;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.searchTerm = filters.search;

      const res = await $axios.get('/tasks', { params });

      this.table.data = res.data.data;
      this.table.meta = res.data.meta ?? null;
    } catch (e: any) {
      this.table.error = e?.response?.data?.message || 'Failed to load tasks';
      this.table.data = [];
    } finally {
      this.table.loading = false;
    }
  },
  async logTaskTime(taskId: string, hours: number) {
  const res = await $axios.patch(
    `/tasks/${taskId}/log-time`,
    { hours },
  );

  const updatedTask = res.data.data;

  console.log('Updated Task after logging time:', updatedTask);


  this.single = updatedTask;


  const sprintId =
    typeof updatedTask.sprintId === 'object'
      ? updatedTask.sprintId._id
      : updatedTask.sprintId;

  const prev = this.listBySprint[sprintId] || [];
  this.listBySprint[sprintId] = prev.map((t) =>
    t._id === taskId ? updatedTask : t,
  );

  return res;
},


  setTableFilters(patch: Partial<typeof taskStore.table.filters>) {
    this.table.filters = { ...this.table.filters, ...patch };
  },
});
