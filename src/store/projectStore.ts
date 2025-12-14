import { proxy } from 'valtio';

import type { TProject, TProjectOverview } from '@/types/project';
import $axios from '@/_api/axios';

const projectStore = proxy({

  list: {
    data: [] as TProject[],
    meta: null as any,
    loading: false,
    error: null as string | null,
    requestsMade: 0,
  },

  single: {
    data: null as TProject | null,
    loading: false,
    error: null as string | null,
  },

  overview: {
    data: null as TProjectOverview | null,
    loading: false,
    error: null as string | null,
  },

  createStatus: {
    success: false,
    error: null as string | null,
  },

  updateStatus: {
    success: false,
    error: null as string | null,
  },


async getAllProjects(
  query?: Record<string, unknown>,
): Promise<[TProject[] | null, string | null]> {


  if (this.list.loading) {
    return [this.list.data, null];
  }

  this.list.loading = true;
  this.list.error = null;

  let resp: [TProject[] | null, string | null] = [null, null];

  try {
    const res = await $axios.get('/projects', { params: query });
    const payload = res.data;

    if (payload?.data) {
      this.list.data = payload.data;  
      this.list.meta = payload.meta;
      resp = [payload.data, null];
    }
  } catch (err: any) {
    const message =
      err.response?.data?.message || 'Failed to fetch projects';

    this.list.error = message;
    resp = [null, message];
  } finally {
    this.list.loading = false;
    this.list.requestsMade += 1;
    return resp;
  }
},


 
  async getSingleProject(
    projectId: string,
  ): Promise<[TProject | null, string | null]> {
    this.single.loading = true;
    this.single.error = null;

    let resp: [TProject | null, string | null] = [null, null];

    try {
      const res = await $axios.get(`/projects/${projectId}`);
      const data: TProject | undefined = res.data?.data;

      console.log(data, 'single project');

      if (data) {
        this.single.data = data;
        resp = [data, null];
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Project not found';

      this.single.data = null;
      this.single.error = message;
      resp = [null, message];
    } finally {
      this.single.loading = false;
      return resp;
    }
  },


  async createProject(
    payload: Partial<TProject>,
  ): Promise<[TProject | null, string | null]> {
    this.createStatus = { success: false, error: null };

    let resp: [TProject | null, string | null] = [null, null];

    try {
      const res = await $axios.post('/projects', payload);
      const data: TProject | undefined = res.data?.data;

      if (data) {
        this.createStatus.success = true;
        resp = [data, null];
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to create project';

      this.createStatus = { success: false, error: message };
      resp = [null, message];
    } finally {
      return resp;
    }
  },


  async updateProject(
    projectId: string,
    payload: Partial<TProject>,
  ): Promise<[TProject | null, string | null]> {
    this.updateStatus = { success: false, error: null };

    let resp: [TProject | null, string | null] = [null, null];

    try {
      const res = await $axios.patch(`/projects/${projectId}`, payload);
      const data: TProject | undefined = res.data?.data;

      if (data) {
        this.single.data = data;
        this.updateStatus.success = true;
        resp = [data, null];
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to update project';

      this.updateStatus = { success: false, error: message };
      resp = [null, message];
    } finally {
      return resp;
    }
  },


  async deleteProject(
    projectId: string,
  ): Promise<[boolean, string | null]> {
    try {
      await $axios.delete(`/projects/${projectId}`);
      return [true, null];
    } catch (err: any) {
      return [
        false,
        err.response?.data?.message || 'Failed to delete project',
      ];
    }
  },


  async getProjectOverview(
    projectId: string,
  ): Promise<[TProjectOverview | null, string | null]> {
    this.overview.loading = true;
    this.overview.error = null;

    let resp: [TProjectOverview | null, string | null] = [null, null];

    try {
      const res = await $axios.get(`/projects/${projectId}/overview`);
      const data: TProjectOverview | undefined = res.data?.data;

      if (data) {
        this.overview.data = data;
        resp = [data, null];
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to load overview';

      this.overview.data = null;
      this.overview.error = message;
      resp = [null, message];
    } finally {
      this.overview.loading = false;
      return resp;
    }
  },



getStats() {
  const total = this.list.data.length;
  const active = this.list.data.filter(
    (p) => p.status === 'active',
  ).length;

  return { total, active };
},


  reset() {
    this.list = {
      data: [],
      meta: null,
      loading: false,
      error: null,
      requestsMade: 0,
    };
    this.single = { data: null, loading: false, error: null };
    this.overview = { data: null, loading: false, error: null };
  },
});

export default projectStore;
