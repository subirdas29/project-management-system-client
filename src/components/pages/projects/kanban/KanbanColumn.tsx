/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useDroppable } from '@dnd-kit/core';
import KanbanTaskCard from './KanbanTaskCard';

export default function KanbanColumn({
  title,
  status,
  tasks,
}: {
  title: string;
  status: string;
  tasks: any[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded p-3 space-y-2 min-h-[300px] transition ${
        isOver ? 'bg-muted' : 'bg-muted/40'
      }`}
    >
      <h2 className="font-medium text-sm">{title}</h2>

      {tasks.map((task) => (
        <KanbanTaskCard key={task._id} task={task} />
      ))}

      {!tasks.length && (
        <p className="text-xs text-muted-foreground">
          Drop tasks here
        </p>
      )}
    </div>
  );
}
