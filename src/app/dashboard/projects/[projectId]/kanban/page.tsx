'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { DndContext, DragEndEvent } from '@dnd-kit/core';

import { taskStore } from '@/store/taskStore';
import projectStore from '@/store/projectStore';

import KanbanColumn from '@/components/pages/projects/kanban/KanbanColumn';
import { Button } from '@/components/ui/button';

const COLUMNS = [
  { key: 'todo', title: 'To Do' },
  { key: 'inprogress', title: 'In Progress' },
  { key: 'review', title: 'Review' },
  { key: 'done', title: 'Done' },
];

export default function KanbanPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const taskSnap = useSnapshot(taskStore);
  const projectSnap = useSnapshot(projectStore);

  useEffect(() => {
    projectStore.getSingleProject(projectId);

   
    taskStore.setTableFilters({ projectId });
    taskStore.getTasksTable();
  }, [projectId]);

 const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over) return;

  const taskId = active.id as string;
  const newStatus = over.id as string;

  if (active.data.current?.status === newStatus) return;

  try {
    await taskStore.updateTaskStatus(taskId, newStatus);
    taskStore.getTasksTable(); 
  } catch {
    taskStore.getTasksTable(); 
  }
};


  const tasks = taskSnap.table.data;

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    inprogress: tasks.filter((t) => t.status === 'inprogress'),
    review: tasks.filter((t) => t.status === 'review'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {projectSnap.single.data?.title} – Kanban
        </h1>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/projects/${projectId}/sprints`)
          }
        >
          ← Back to Sprints
        </Button>
      </div>

      {/* BOARD */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.key}
              status={col.key}
              title={col.title}
              tasks={tasksByStatus[col.key]}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
