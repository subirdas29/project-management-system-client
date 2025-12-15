import { proxy } from 'valtio';
import $axios from '@/_api/axios';
import type { TTeamMember, TTeamRole } from '@/types/team';

type Role = TTeamRole;

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
  list: [] as TTeamMember[],
  loading: false,
  page: 1,
  limit: 10,
  total: 0,

  taskMembers: [] as TTeamMember[],
  taskLoading: false,

  async getProjectTeam(projectId: string, page = 1) {
    this.loading = true;

    const res = await $axios.get<{
      data: TTeamMember[];
      meta: { total: number };
    }>(
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

  async updateTeamMember(
    teamId: string,
    payload: Partial<TTeamMember>,
  ) {
    const res = await $axios.patch<{ data: TTeamMember }>(
      `/team/${teamId}`,
      payload,
    );

    this.list = this.list.map((m) =>
      m._id === teamId ? res.data.data : m,
    );

    return res;
  },

  async removeTeamMember(teamId: string) {
    await $axios.delete(`/team/${teamId}`);

    this.list = this.list.filter(
      (m) => m._id !== teamId,
    );
  },
});
