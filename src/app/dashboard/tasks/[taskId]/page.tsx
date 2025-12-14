'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const snap = useSnapshot(taskStore);

  useEffect(() => {
    taskStore.getSingleTask(taskId);
  }, [taskId]);

  const task = snap.single;

  if (!task) return null;

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">{task.title}</h1>

      <div className="flex gap-2">
        <Badge>{task.status}</Badge>
        <Badge variant="outline">{task.priority}</Badge>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p>
            <strong>Description:</strong>
          </p>
          <p className="text-muted-foreground">
            {task.description || '—'}
          </p>

          <p>
            <strong>Due Date:</strong>{' '}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : '—'}
          </p>

          <p>
            <strong>Estimate:</strong>{' '}
            {task.estimateHours || 0} hrs
          </p>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-medium">Activity</h3>

          {task.activityLog?.map((log: any, i: number) => (
            <p key={i} className="text-sm text-muted-foreground">
              {log.action} –{' '}
              {new Date(log.createdAt).toLocaleString()}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
