'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';

import { taskStore } from '@/store/taskStore';
import { userStore } from '@/store/userStore';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FormData = {
  title: string;
  description?: string;
  estimateHours?: number;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'review' | 'done';
  dueDate?: string;
  assignees: string[];
};

export default function EditTaskModal({
  open,
  task,
  onClose,
}: {
  open: boolean;
  task: any;
  onClose: () => void;
}) {
  const usersSnap = useSnapshot(userStore);

  const form = useForm<FormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      estimateHours: task.estimateHours,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
        ? task.dueDate.split('T')[0]
        : '',
      assignees: task.assignees?.map((u: any) => u._id) || [],
    },
  });

  useEffect(() => {
    userStore.getAllUsers();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await taskStore.updateTask(task._id, data);
      toast.success('Task updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Failed to update task',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* TITLE */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input {...form.register('title', { required: true })} />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea {...form.register('description')} />
          </div>

          {/* ESTIMATE */}
          <div className="space-y-1">
            <Label>Estimate Hours</Label>
            <Input
              type="number"
              {...form.register('estimateHours', {
                valueAsNumber: true,
              })}
            />
          </div>

          {/* PRIORITY */}
          <div className="space-y-1">
            <Label>Priority</Label>
            <Select
              value={form.watch('priority')}
              onValueChange={(v) =>
                form.setValue('priority', v as any)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* STATUS */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(v) =>
                form.setValue('status', v as any)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="inprogress">
                  In Progress
                </SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DUE DATE */}
          <div className="space-y-1">
            <Label>Due Date</Label>
            <Input type="date" {...form.register('dueDate')} />
          </div>

          {/* ASSIGNEES */}
          <div className="space-y-2">
            <Label>Assignees</Label>

            <div className="border rounded p-2 space-y-1 max-h-40 overflow-y-auto">
              {usersSnap.list.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form
                      .watch('assignees')
                      .includes(user._id)}
                    onChange={(e) => {
                      const prev =
                        form.getValues('assignees');

                      form.setValue(
                        'assignees',
                        e.target.checked
                          ? [...prev, user._id]
                          : prev.filter(
                              (id) => id !== user._id,
                            ),
                      );
                    }}
                  />
                  {user.name}{' '}
                  <span className="text-muted-foreground">
                    ({user.role})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
