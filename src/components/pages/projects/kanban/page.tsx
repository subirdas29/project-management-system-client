'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard() {
  const snap = useSnapshot(taskStore);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    if (active.data.current?.status === newStatus) return;

    await taskStore.updateTaskStatus(taskId, newStatus);
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            id={col.key}
            className="border rounded p-3 min-h-[400px]"
          >
            <h2 className="font-medium mb-2">{col.label}</h2>

            {snap.list
              .filter((t) => t.status === col.key)
              .map((task) => (
                <div
                  key={task._id}
                  className="border rounded p-2 mb-2 bg-background"
                >
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Priority: {task.priority}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </DndContext>
  );
}
