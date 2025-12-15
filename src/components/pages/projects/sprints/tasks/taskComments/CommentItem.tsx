'use client';

import { useState } from 'react';
import { useSnapshot } from 'valtio';
import authStore from '@/store/authStore';
import { taskCommentStore } from '@/store/taskCommentStore';
import CommentForm from './CommentForm';
import ReplyForm from './ReplyForm';
import { Button } from '@/components/ui/button';

export default function CommentItem({
  comment,
  replies,
}: {
  comment: any;
  replies: any[];
}) {
  const { user } = useSnapshot(authStore);
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  console.log('CommentItem Rendered',comment.userId);

  const isOwner = user?._id === comment.userId._id;

  return (
    <div className="space-y-2 border-l-2 pl-3">
      <p className="text-sm font-medium">
        {comment.userId.name} - {comment.userId.role}
        <span className="text-muted-foreground">
          {' '}
          ({comment.userId.email})
        </span>
      </p>

      {!editing ? (
        <p className="text-sm">{comment.content}</p>
      ) : (
        <CommentForm
          initialValue={comment.content}
          onSubmit={(text) => {
            taskCommentStore.updateComment(comment._id, text);
            setEditing(false);
          }}
        />
      )}

      <div className="flex gap-2 text-xs">
        <Button
          variant="ghost"
       
          onClick={() => setReplying(!replying)}
        >
          Reply
        </Button>

        {isOwner && (
          <>
            <Button
              variant="ghost"
             
              onClick={() => setEditing(!editing)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
         
              className="text-red-500"
              onClick={() =>
                taskCommentStore.deleteComment(comment._id)
              }
            >
              Delete
            </Button>
          </>
        )}
      </div>

      {replying && (
        <ReplyForm
          taskId={comment.taskId}
          parentComment={comment._id}
          onDone={() => setReplying(false)}
        />
      )}

      <div className="ml-4 space-y-2">
        {replies.map((r) => (
          <CommentItem
            key={r._id}
            comment={r}
            replies={[]}
          />
        ))}
      </div>
    </div>
  );
}
