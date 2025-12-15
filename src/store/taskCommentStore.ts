import { proxy } from 'valtio';
import $axios from '@/_api/axios';
import authStore from './authStore';

export const taskCommentStore = proxy({
  list: [] as any[],
  loading: false,

  async getComments(taskId: string) {
    this.loading = true;
    const res = await $axios.get(`/comments/task/${taskId}`);
    this.list = res.data.data;
    this.loading = false;
  },

  async addComment(payload: {
    taskId: string;
    content: string;
    parentComment?: string;
  }) {
    const res = await $axios.post('/comments', payload);

    const comment = res.data.data;

    const auth = authStore.user;
    if (!auth) {
    
      return comment;
    }

    // 🔥 Instant UI fix
    if (typeof comment.userId === 'string') {
      comment.userId = {
        _id: auth._id,
        name: auth.name,
        email: auth.email,
        role: auth.role,
      };
    }

    this.list.push(comment);
    return comment;
  },

  async updateComment(commentId: string, content: string) {
    const res = await $axios.patch(`/comments/${commentId}`, {
      content,
    });

    const updated = res.data.data;

    this.list = this.list.map((c) => {
      if (c._id !== commentId) return c;

      return {
        ...c,
        content: updated.content,
        updatedAt: updated.updatedAt,
      };
    });
  },

  async deleteComment(commentId: string) {
    await $axios.delete(`/comments/${commentId}`);
    this.list = this.list.filter(
      (c) => c._id !== commentId,
    );
  },
});
