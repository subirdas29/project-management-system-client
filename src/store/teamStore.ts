import { proxy } from 'valtio';
import $axios from '@/_api/axios';

type Role = 'admin' | 'manager' | 'member';

type AddTeamPayload =
  | {
      mode: 'existing';
      projectId: string;
      email: string;
      role: Role;
    }
  | {
      mode: 'new';
      projectId: string;
      name: string;
      email: string;
      password: string;
      role: Role;
      department?: string;
      skills?: string[];
    };

export const teamStore = proxy({
  list: [] as any[],
  loading: false,
  page: 1,
  limit: 10,
  total: 0,
    taskMembers: [] as any[],  
  taskLoading: false,

  async getProjectTeam(projectId: string, page = 1) {
    this.loading = true;

    const res = await $axios.get(
      `/team/project/${projectId}?page=${page}&limit=${this.limit}`,
    );

    

    this.list = res.data.data;
    this.total = res.data.meta.total;
    this.page = page;
    this.loading = false;
  },

  async addTeamMember(payload: AddTeamPayload) {
    return $axios.post('/team', payload);
  },

  async updateTeamMember(teamId: string, payload: any) {
    const res = await $axios.patch(`/team/${teamId}`, payload);

    this.list = this.list.map((m) =>
      m._id === teamId ? res.data.data : m,
    );

    return res;
  },

  async removeTeamMember(teamId: string) {
    await $axios.delete(`/team/${teamId}`);
    this.list = this.list.filter((m) => m._id !== teamId);
  },

 
});
