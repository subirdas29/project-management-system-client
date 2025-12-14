'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export default function SprintDetailsModal({
  open,
  sprint,
  onClose,
}: {
  open: boolean;
  sprint: any;
  onClose: () => void;
}) {
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
            {sprint.totalTasks || 0}
          </p>

          <p>
            <strong>Completed:</strong>{' '}
            {sprint.completedTasks || 0}
          </p>

          <Progress value={sprint.progress || 0} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
