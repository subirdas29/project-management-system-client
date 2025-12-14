'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { taskStore } from '@/store/taskStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LogTimeModal({
  open,
  onClose,
  taskId,
}: {
  open: boolean;
  onClose: () => void;
  taskId: string;
}) {
  const form = useForm<{ hours: number }>({
    defaultValues: { hours: 0 },
  });

  const onSubmit = async (data: { hours: number }) => {
    try {
      await taskStore.logTaskTime(taskId, data.hours);
      toast.success('Time logged successfully');
      onClose();
      form.reset();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Failed to log time',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label>Hours worked</Label>
            <Input
              type="number"
              step="0.25"
              min="0.25"
              {...form.register('hours', {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
