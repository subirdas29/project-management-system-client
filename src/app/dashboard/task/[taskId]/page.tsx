'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';
import TaskDetails from '@/components/pages/projects/sprints/tasks/TaskDetails';


export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const snap = useSnapshot(taskStore);

  useEffect(() => {
    taskStore.getSingleTask(taskId);
  }, [taskId]);

  if (!snap.single) return null;

  return <TaskDetails task={snap.single} />;
}
