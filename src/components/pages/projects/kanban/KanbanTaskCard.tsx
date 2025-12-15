/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { TTask } from '@/types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

export default function KanbanTaskCard({
  task,
}: {
  task: TTask;
}) {
  const router = useRouter();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: task._id,
    data: { status: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const sprintTitle =
    typeof task.sprintId === 'object' &&
    task.sprintId !== null &&
    'title' in task.sprintId
      ? (task.sprintId as any).title
      : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-background border rounded p-2 space-y-1"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-1">
          <span
            {...listeners}
            className="cursor-grab text-muted-foreground mt-1"
            title="Drag task"
          >
            <GripVertical size={14} />
          </span>

          <p className="font-medium text-sm leading-tight">
            {task.title}
          </p>
        </div>

        <button
          onClick={() =>
            router.push(`/dashboard/task/${task._id}`)
          }
          title="View task"
          className="cursor-pointer"
        >
          <Eye size={14} />
        </button>
      </div>

      {/* STATUS */}
      <span
        className={`inline-block px-2 py-0.5 rounded text-[10px] my-3 capitalize ${
          STATUS_COLOR[task.status]
        }`}
      >
        {task.status}
      </span>

      {/* SPRINT INFO */}
      {sprintTitle && (
        <p className="text-[10px] text-muted-foreground">
          Sprint: {sprintTitle}
        </p>
      )}
    </div>
  );
}
