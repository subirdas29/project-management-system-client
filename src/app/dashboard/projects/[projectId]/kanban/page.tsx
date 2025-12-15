/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';

import { DndContext, DragEndEvent } from '@dnd-kit/core';

import { taskStore } from '@/store/taskStore';
import projectStore from '@/store/projectStore';
import authStore from '@/store/authStore';

import KanbanColumn from '@/components/pages/projects/kanban/KanbanColumn';
import { Button } from '@/components/ui/button';



type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done';



const COLUMNS: { key: TaskStatus; title: string }[] = [
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
  const { user } = useSnapshot(authStore);

  useEffect(() => {
    projectStore.getSingleProject(projectId);

    taskStore.setTableFilters({ projectId });
    taskStore.getTasksTable();
  }, [projectId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const fromStatus = active.data.current?.status as TaskStatus;
    const toStatus = over.id as TaskStatus;

    if (fromStatus === toStatus) return;

    if (user?.role === 'member') {
      if (fromStatus === 'review' && toStatus === 'done') {
        toast.error('Only manager or admin can mark a task as done');
        return;
      }

      if (fromStatus === 'todo' && toStatus === 'done') {
        toast.error('You must move the task to review first');
        return;
      }
    }

    try {
      await taskStore.updateTaskStatus(taskId, toStatus);
      taskStore.getTasksTable();
    } catch {
      taskStore.getTasksTable();
    }
  };

  const allTasks = taskSnap.table.data || [];
  const loggedInUserId = user?._id;

  const visibleTasks =
    user?.role === 'member'
      ? allTasks.filter((task) =>
          task.assignees?.some(
            (u: any) =>
              (typeof u === 'string' ? u : u._id) === loggedInUserId,
          ),
        )
      : allTasks;

  const tasksByStatus: Record<TaskStatus, typeof visibleTasks> = {
    todo: visibleTasks.filter((t) => t.status === 'todo'),
    inprogress: visibleTasks.filter((t) => t.status === 'inprogress'),
    review: visibleTasks.filter((t) => t.status === 'review'),
    done: visibleTasks.filter((t) => t.status === 'done'),
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
              tasks={[...tasksByStatus[col.key]]}
            />
          ))}
        </div>
      </DndContext>

      {user?.role === 'member' && visibleTasks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center pt-4">
          You have no tasks assigned in this project
        </p>
      )}
    </div>
  );
}
