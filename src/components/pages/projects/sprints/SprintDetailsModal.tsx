'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { sprintStore } from '@/store/sprintStore';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export default function SprintDetailsModal({
  open,
  sprintId,
  onClose,
}: {
  open: boolean;
  sprintId: string;
  onClose: () => void;
}) {
  const snap = useSnapshot(sprintStore);

  useEffect(() => {
    if (open && sprintId) {
      sprintStore.getSprintDetails(sprintId);
    }
  }, [open, sprintId]);

  const sprint = snap.single.data;
  if (!sprint) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Sprint {sprint.sprintNumber} Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p>
            <strong>Title:</strong> {sprint.title}
          </p>

          <p>
            <strong>Duration:</strong>{' '}
            {new Date(sprint.startDate).toLocaleDateString()} –{' '}
            {new Date(sprint.endDate).toLocaleDateString()}
          </p>

          <p>
            <strong>Total Tasks:</strong>{' '}
            {sprint.totalTasks}
          </p>

          <p>
            <strong>Completed:</strong>{' '}
            {sprint.completedTasks}
          </p>

          <Progress value={sprint.progress} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
