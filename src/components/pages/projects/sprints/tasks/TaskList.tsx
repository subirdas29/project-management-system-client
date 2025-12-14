'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { taskStore } from '@/store/taskStore';

export default function TaskList({
  sprintId,
}: {
  sprintId: string;
}) {
  const snap = useSnapshot(taskStore);
  const tasks = snap.listBySprint[sprintId] || [];

  useEffect(() => {
    taskStore.getTasks({ sprintId });
  }, [sprintId]);

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="border rounded p-2 flex justify-between"
        >
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-muted-foreground">
              Due:{' '}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : '—'}
            </p>
          </div>

          <span className="capitalize text-sm">
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
}
