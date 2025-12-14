'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';
import projectStore from '@/store/projectStore';
import KanbanBoard from '@/components/pages/projects/kanban/page';



export default function KanbanPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const projectSnap = useSnapshot(projectStore);

  useEffect(() => {
    projectStore.getSingleProject(projectId);
    taskStore.getTasks({ projectId });
  }, [projectId]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        {projectSnap.single.data?.title} – Kanban Board
      </h1>

      <KanbanBoard />
    </div>
  );
}
