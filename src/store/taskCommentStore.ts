import { proxy } from 'valtio';
import $axios from '@/_api/axios';
import authStore from './authStore';
import type { TTaskComment } from '@/types/taskComment';

export const taskCommentStore = proxy({
  list: [] as TTaskComment[],
  loading: false,

  async getComments(taskId: string) {
    this.loading = true;

    const res = await $axios.get<{
      data: TTaskComment[];
    }>(`/comments/task/${taskId}`);

    this.list = res.data.data;
    this.loading = false;
  },

  async addComment(payload: {
    taskId: string;
    content: string;
    parentComment?: string;
  }) {
    const res = await $axios.post<{
      data: TTaskComment;
    }>('/comments', payload);

    const comment = res.data.data;

    const auth = authStore.user;
    if (!auth) {
      return comment;
    }


    if (typeof comment.userId === 'string') {
   comment.userId = {
  _id: auth._id,
  name: auth.name ?? 'Unknown',
  email: auth.email ?? '',
  role: auth.role ?? 'member',
};

    }

    this.list.push(comment);
    return comment;
  },

  async updateComment(commentId: string, content: string) {
    const res = await $axios.patch<{
      data: Pick<TTaskComment, 'content' | 'updatedAt'>;
    }>(`/comments/${commentId}`, {
      content,
    });

    const updated = res.data.data;

    this.list = this.list.map((c) =>
      c._id !== commentId
        ? c
        : {
            ...c,
            content: updated.content,
            updatedAt: updated.updatedAt,
          }
    );
  },

  async deleteComment(commentId: string) {
    await $axios.delete(`/comments/${commentId}`);

    this.list = this.list.filter(
      (c) => c._id !== commentId
    );
  },
});
