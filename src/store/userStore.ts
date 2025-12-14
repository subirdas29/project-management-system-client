import { proxy } from 'valtio';
import $axios from '@/_api/axios';

export const userStore = proxy({
  list: [] as any[],
  loading: false,

  async getAllUsers() {
    this.loading = true;
    const res = await $axios.get('/users');
    this.list = res.data.data;
    this.loading = false;
  },
});
