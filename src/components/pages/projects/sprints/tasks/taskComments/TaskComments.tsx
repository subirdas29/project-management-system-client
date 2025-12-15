'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { taskCommentStore } from '@/store/taskCommentStore';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function TaskComments({
  taskId,
}: {
  taskId: string;
}) {
  const snap = useSnapshot(taskCommentStore);

  useEffect(() => {
    taskCommentStore.getComments(taskId);
  }, [taskId]);

  const parents = snap.list.filter(
    (c) => !c.parentComment,
  );
  const replies = snap.list.filter(
    (c) => c.parentComment,
  );

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Comments</h3>

      <CommentForm
        onSubmit={(text) =>
          taskCommentStore.addComment({
            taskId,
            content: text,
          })
        }
      />

      {parents.map((c) => (
        <CommentItem
          key={c._id}
          comment={c}
          replies={replies.filter(
            (r) => r.parentComment === c._id,
          )}
        />
      ))}
    </div>
  );
}
