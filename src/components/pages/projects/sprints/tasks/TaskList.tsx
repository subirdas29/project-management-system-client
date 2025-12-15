'use client';

import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye } from 'lucide-react';

import { taskStore } from '@/store/taskStore';
import authStore from '@/store/authStore';

import ConfirmDialog from '@/components/ui/confirmModal/ConfirmModal';
import EditTaskModal from './EditTaskModal';

const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export default function TaskList({ sprintId }: { sprintId: string }) {
  const router = useRouter();
  const snap = useSnapshot(taskStore);
  const { user } = useSnapshot(authStore);

  const isMember = user?.role === 'member';

  const tasks = snap.listBySprint[sprintId] || [];

  const [editTask, setEditTask] = useState<any>(null);
  const [deleteTask, setDeleteTask] = useState<any>(null);

  useEffect(() => {
    taskStore.getTasks({ sprintId });
  }, [sprintId]);

  const handleDelete = async () => {
    await taskStore.deleteTask(deleteTask._id, sprintId);
    setDeleteTask(null);
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="border rounded p-3 flex justify-between items-center hover:bg-muted/40"
        >
          {/* LEFT */}
          <div className="space-y-1">
            <p className="font-medium">{task.title}</p>

            <div className="flex gap-2 items-center text-xs">
              {/* Priority */}
              <span
                className={`px-2 py-0.5 rounded capitalize ${PRIORITY_COLOR[task.priority]}`}
              >
                {task.priority}
              </span>

              {/* Due date */}
              <span className="text-muted-foreground">
                Due:{' '}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : '—'}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Status */}
            <span
              className={`px-2 py-1 rounded text-xs capitalize ${STATUS_COLOR[task.status]}`}
            >
              {task.status}
            </span>

            {/* View */}
            <button
              onClick={() =>
                router.push(`/dashboard/task/${task._id}`)
              }
              title="View task"
            >
              <Eye size={16} className="cursor-pointer" />
            </button>

            {/* Edit (everyone can open, permission handled inside modal) */}
            <button
              onClick={() => setEditTask(task)}
              title="Edit task"
            >
              <Pencil size={16} className="cursor-pointer" />
            </button>

            {/* ❌ Delete (hidden for member) */}
            {!isMember && (
              <button
                onClick={() => setDeleteTask(task)}
                title="Delete task"
              >
                <Trash2
                  size={16}
                  className="cursor-pointer text-red-500"
                />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Edit Task Modal */}
      {editTask && (
        <EditTaskModal
          open
          task={editTask}
          onClose={() => setEditTask(null)}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        confirmText="Delete"
        onCancel={() => setDeleteTask(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
