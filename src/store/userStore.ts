import { proxy } from 'valtio';
import $axios from '@/_api/axios';
import type { TUser } from '@/types/user';

export const userStore = proxy({
  list: [] as TUser[],
  loading: false,

  async getAllUsers() {
    this.loading = true;

    const res = await $axios.get<{
      data: TUser[];
    }>('/users');

    this.list = res.data.data;
    this.loading = false;
  },
});
