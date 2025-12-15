import { proxy } from 'valtio';
import $axios from '@/_api/axios';
import type { TTask } from '@/types/task';
import type { TMeta } from '@/types/meta';
import type { AxiosError } from 'axios';

export const taskStore = proxy({
  listBySprint: {} as Record<string, TTask[]>,
  single: null as TTask | null,

  table: {
    data: [] as TTask[],
    loading: false,
    error: null as string | null,
    meta: null as TMeta | null,
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
    const res = await $axios.get<{ data: TTask[] }>(
      '/tasks',
      { params: filters },
    );

    this.listBySprint = {
      ...this.listBySprint,
      [filters.sprintId]: res.data.data,
    };
  },

  async getSingleTask(taskId: string) {
    const res = await $axios.get<{ data: TTask }>(
      `/tasks/${taskId}`,
    );
    this.single = res.data.data;
  },

  async createTask(payload: Partial<TTask>) {
    const res = await $axios.post('/tasks', payload);
    await this.getTasks({
      sprintId: payload.sprintId as string,
    });
    return res;
  },

  async updateTask(taskId: string, payload: Partial<TTask>) {
    const res = await $axios.patch<{ data: TTask }>(
      `/tasks/${taskId}`,
      payload,
    );

    const updatedTask = res.data.data;

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

      const params: Record<string, string> = {
        projectId: filters.projectId,
      };

      if (filters.sprintId !== 'all') params.sprintId = filters.sprintId;
      if (filters.assignee !== 'all') params.assignees = filters.assignee;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.searchTerm = filters.search;

      const res = await $axios.get<{
        data: TTask[];
        meta: TMeta;
      }>('/tasks', { params });

      this.table.data = res.data.data;
      this.table.meta = res.data.meta;
    } catch (e: unknown) {
      const err = e as AxiosError<{ message?: string }>;
      this.table.error =
        err.response?.data?.message ||
        'Failed to load tasks';
      this.table.data = [];
    } finally {
      this.table.loading = false;
    }
  },

  async logTaskTime(taskId: string, hours: number) {
    const res = await $axios.patch<{ data: TTask }>(
      `/tasks/${taskId}/log-time`,
      { hours },
    );

    const updatedTask = res.data.data;

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

  setTableFilters(
    patch: Partial<typeof taskStore.table.filters>,
  ) {
    this.table.filters = {
      ...this.table.filters,
      ...patch,
    };
  },
});
