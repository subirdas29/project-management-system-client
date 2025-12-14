'use client';

import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye } from 'lucide-react';

import { taskStore } from '@/store/taskStore';
import ConfirmDialog from '@/components/ui/confirmModal/ConfirmModal';
import EditTaskModal from './EditTaskModal';


const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

export default function TaskList({
  sprintId,
}: {
  sprintId: string;
}) {
  const router = useRouter();
  const snap = useSnapshot(taskStore);

  const tasks = snap.listBySprint[sprintId] || [];

  const [editTask, setEditTask] = useState<any>(null);
  const [deleteTask, setDeleteTask] = useState(null);

  useEffect(() => {
    taskStore.getTasks({ sprintId });
  }, [sprintId]);

const handleDelete = async () => {
  await taskStore.deleteTask(
    deleteTask._id,
    sprintId,
  );
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
          <div>
            <p className="font-medium">{task.title}</p>

            <p className="text-xs text-muted-foreground">
              Due:{' '}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : '—'}
            </p>
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
                router.push(
                  `/dashboard/task/${task._id}`,
                )
              }
            >
              <Eye size={16} className='cursor-pointer'/>
            </button>

            {/* Edit */}
            <button className='cursor-pointer' onClick={() => setEditTask(task)}>
              <Pencil size={16} />
            </button>

            {/* Delete */}
          <button onClick={() => setDeleteTask(task)} className='cursor-pointer'>
  <Trash2 size={16} />
</button>

          </div>
        </div>
      ))}

      {/* Edit Task */}
      {editTask && (
        <EditTaskModal
          open
          task={editTask}
          onClose={() => setEditTask(null)}
        />
      )}

      {/* Delete Task */}
      <ConfirmDialog
  open={!!deleteTask}
  title="Delete Task"
  description="Are you sure?"
  confirmText="Delete"
  onCancel={() => setDeleteTask(null)}
  onConfirm={handleDelete}
/>

    </div>
  );
}
