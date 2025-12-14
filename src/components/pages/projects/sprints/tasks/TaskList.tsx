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

  useEffect(() => {
    if (!snap.listBySprint[sprintId]) {
      taskStore.getTasks({ sprintId });
    }
  }, [sprintId]);

  const tasks = snap.listBySprint[sprintId] || [];

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex justify-between border rounded p-2"
        >
          <span>{task.title}</span>
          <span className="capitalize text-sm">
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
}
