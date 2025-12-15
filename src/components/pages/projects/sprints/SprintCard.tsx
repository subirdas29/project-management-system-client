'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSnapshot } from 'valtio';

import { sprintStore } from '@/store/sprintStore';
import authStore from '@/store/authStore';

import TaskList from './tasks/TaskList';
import EditSprintModal from './EditSprintModal';
import ConfirmDialog from '@/components/ui/confirmModal/ConfirmModal';
import SprintDetailsModal from './SprintDetailsModal';
import CreateTaskModal from './tasks/CreateTaskModal';


type TSprintUI = {
  _id: string;
  projectId?: string;
  sprintNumber?: number;
  title: string;
  startDate?: string;
  endDate?: string;
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function SprintCard({
  sprint,
}: {
  sprint: TSprintUI;
}) {
  const { user } = useSnapshot(authStore);

  const isAdminOrManager =
    user?.role === 'admin' || user?.role === 'manager';

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: sprint._id,
    disabled: !isAdminOrManager,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await sprintStore.deleteSprint(sprint._id);
      toast.success('Sprint deleted');
    } catch {
      toast.error('Failed to delete sprint');
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border rounded p-4 space-y-3 bg-background"
    >
      
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
       
          {isAdminOrManager && (
            <span
              {...listeners}
              className="cursor-grab text-muted-foreground mt-1"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </span>
          )}

          <div>
            <h2 className="font-semibold">
              Sprint {sprint.sprintNumber}:{' '}
              {sprint.title}
            </h2>

            <p className="text-xs text-muted-foreground">
              {formatDate(sprint.startDate)} →{' '}
              {formatDate(sprint.endDate)}
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
       
          <button
            onClick={() => setDetailsOpen(true)}
            className="cursor-pointer"
            title="View sprint details"
          >
            <Eye size={16} />
          </button>

        
          {isAdminOrManager && (
            <button
              onClick={() => setEditOpen(true)}
              className="cursor-pointer"
              title="Edit sprint"
            >
              <Pencil size={16} />
            </button>
          )}

         
          {isAdminOrManager && (
            <button
              onClick={() => setDeleteOpen(true)}
              className="cursor-pointer"
              title="Delete sprint"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          )}

         
          {isAdminOrManager && sprint.projectId && (
            <CreateTaskModal
              projectId={sprint.projectId}
              sprintId={sprint._id}
            />
          )}
        </div>
      </div>

      {/* TASK LIST */}
      <TaskList sprintId={sprint._id} />

      {/* MODALS */}
      <SprintDetailsModal
        open={detailsOpen}
        sprintId={sprint._id}
        onClose={() => setDetailsOpen(false)}
      />

      {isAdminOrManager && (
        <>
          <EditSprintModal
            open={editOpen}
            sprint={sprint}
            onClose={() => setEditOpen(false)}
          />

          <ConfirmDialog
            open={deleteOpen}
            title="Delete Sprint"
            description="Are you sure you want to delete this sprint?"
            confirmText="Delete"
            onCancel={() => setDeleteOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
}
