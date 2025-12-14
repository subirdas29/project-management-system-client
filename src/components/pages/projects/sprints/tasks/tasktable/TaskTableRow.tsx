'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


import EditTaskModal from '@/components/pages/projects/sprints/tasks/EditTaskModal';
import ConfirmDialog from '@/components/ui/confirmModal/ConfirmModal';
import { taskStore } from '@/store/taskStore';
import TaskStatusBadge from './TaskStatusBadge';

export default function TaskTableRow({ task }: { task: any }) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);

  return (
    <>
      <tr className="border-t hover:bg-muted/40">
        <td className="p-3 font-medium">{task.title}</td>

        <td>
          <TaskStatusBadge status={task.status} />
        </td>

        <td className="capitalize">{task.priority}</td>

        <td>
          {task.assignees?.length
            ? task.assignees.map((u) => u.name).join(', ')
            : '—'}
        </td>

        <td>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : '—'}
        </td>

        <td className="p-3 text-right flex gap-2 justify-end">
          <button onClick={() => router.push(`/dashboard/task/${task._id}`)} className="cursor-pointer">
            <Eye size={16} />
          </button>

          <button onClick={() => setEdit(true)} className="cursor-pointer">
            <Pencil size={16} />
          </button>

          <button onClick={() => setDel(true)} className="cursor-pointer">
            <Trash2 size={16} />
          </button>
        </td>
      </tr>

      {/* Edit */}
      {edit && (
        <EditTaskModal
          open
          task={task}
          onClose={() => setEdit(false)}
        />
      )}

      {/* Delete */}
      <ConfirmDialog
        open={del}
        title="Delete Task"
        description="Are you sure?"
        confirmText="Delete"
        onCancel={() => setDel(false)}
        onConfirm={() => {
          taskStore.deleteTask(
            task._id,
            typeof task.sprintId === 'object'
              ? task.sprintId._id
              : task.sprintId,
          );
          setDel(false);
        }}
      />
    </>
  );
}
