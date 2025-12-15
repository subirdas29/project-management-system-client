'use client';

import CommentForm from './CommentForm';
import { taskCommentStore } from '@/store/taskCommentStore';

export default function ReplyForm({
  taskId,
  parentComment,
  onDone,
}: {
  taskId: string;
  parentComment: string;
  onDone: () => void;
}) {
  return (
    <div className="ml-4 border-l pl-3">
      <CommentForm
        placeholder="Write a reply…"
        onSubmit={async (text) => {
          await taskCommentStore.addComment({
            taskId,
            content: text,
            parentComment,
          });
          onDone();
        }}
      />
    </div>
  );
}
