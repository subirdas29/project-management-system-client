'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  Plus,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { sprintStore } from '@/store/sprintStore';

import TaskList from './tasks/TaskList';
import CreateTaskModal from './tasks/CreateTaskModal';
import EditSprintModal from './EditSprintModal';
import SprintDetailsModal from './SprintDetailsModal';
import ConfirmDialog from '@/components/ui/confirmModal/ConfirmModal';

export default function SprintCard({ sprint }: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: sprint._id });

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
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            {...listeners}
            className="cursor-grab text-muted-foreground"
          >
            <GripVertical size={16} />
          </span>

          <h2 className="font-semibold">
            Sprint {sprint.sprintNumber}: {sprint.title}
          </h2>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setDetailsOpen(true)}>
            <Eye size={16} />
          </button>

          <button onClick={() => setEditOpen(true)}>
            <Pencil size={16} />
          </button>

          <button onClick={() => setDeleteOpen(true)}>
            <Trash2 size={16} />
          </button>

          <CreateTaskModal sprintId={sprint._id} />
        </div>
      </div>

      {/* TASK LIST */}
      <TaskList sprintId={sprint._id} />

      {/* MODALS */}
      <SprintDetailsModal
        open={detailsOpen}
        sprint={sprint}
        onClose={() => setDetailsOpen(false)}
      />

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
    </div>
  );
}
