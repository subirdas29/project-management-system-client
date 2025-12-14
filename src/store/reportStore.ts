import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const reportStore = proxy({
  // single reports
  project: null as any,
  user: null as any,
  me: null as any,

  // collections
  users: [] as any[],

  loading: false,
  error: null as string | null,


  async getProjectReport(projectId: string) {
    try {
      this.loading = true;
      this.error = null;

      const res = await $axios.get(
        `/reports/project/${projectId}`,
      );

      this.project = res.data.data;
    } catch (e: any) {
      this.error =
        e?.response?.data?.message ||
        'Failed to load project report';
      this.project = null;
    } finally {
      this.loading = false;
    }
  },

  async getUserReport(userId: string) {
    try {
      this.loading = true;
      this.error = null;

      const res = await $axios.get(
        `/reports/user/${userId}`,
      );

      this.user = res.data.data;
    } catch (e: any) {
      this.error =
        e?.response?.data?.message ||
        'Failed to load user report';
      this.user = null;
    } finally {
      this.loading = false;
    }
  },

  async getMyReport() {
    try {
      this.loading = true;
      this.error = null;

      const res = await $axios.get('/reports/me');
      this.me = res.data.data;
    } catch (e: any) {
      this.error =
        e?.response?.data?.message ||
        'Failed to load my report';
      this.me = null;
    } finally {
      this.loading = false;
    }
  },


  async getAllUserReports() {
    try {
      this.loading = true;
      this.error = null;

      const res = await $axios.get('/reports/users');
      this.users = res.data.data;
    } catch (e: any) {
      this.error =
        e?.response?.data?.message ||
        'Failed to load users report';
      this.users = [];
    } finally {
      this.loading = false;
    }
  },

  reset() {
    this.project = null;
    this.user = null;
    this.me = null;
    this.users = [];
    this.error = null;
  },
});
