'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';

import { taskStore } from '@/store/taskStore';
import { teamStore } from '@/store/teamStore';
import authStore from '@/store/authStore';

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
  const teamSnap = useSnapshot(teamStore);
  const { user } = useSnapshot(authStore);

  const isAdminOrManager =
    user?.role === 'admin' || user?.role === 'manager';
  const isMember = user?.role === 'member';

  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      estimateHours: undefined,
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      assignees: [],
    },
  });

  /* 🔄 modal open হলে task data reset */
  useEffect(() => {
    if (open && task) {
      form.reset({
        title: task.title ?? '',
        description: task.description ?? '',
        estimateHours: task.estimateHours ?? undefined,
        priority: task.priority ?? 'medium',
        status: task.status ?? 'todo',
        dueDate: task.dueDate
          ? task.dueDate.split('T')[0]
          : '',
        assignees: (task.assignees || [])
          .map((u: any) => u?._id)
          .filter(Boolean),
      });
    }
  }, [open, task, form]);

  /* 👥 team load only for admin/manager */
  useEffect(() => {
    if (open && isAdminOrManager && task?.projectId?._id) {
      teamStore.getProjectTeam(task.projectId._id);
    }
  }, [open, isAdminOrManager, task?.projectId?._id]);

 
  const onSubmit = async (data: FormData) => {
  try {
    if (isMember && task?.status === 'done') {
      toast.error('Completed task cannot be updated');
      return;
    }

    let payload: any = {};

    if (isAdminOrManager) {
      payload = {
        ...data,
        assignees: (data.assignees || []).filter(Boolean),
      };
    }

    if (isMember) {
      payload = {
        status: data.status,
      };
    }

    await taskStore.updateTask(task._id, payload);
    toast.success('Task updated successfully');
    onClose();
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || 'Failed to update task',
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
          {isAdminOrManager && (
            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...form.register('title', { required: true })} />
            </div>
          )}

          {/* DESCRIPTION */}
          {isAdminOrManager && (
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea {...form.register('description')} />
            </div>
          )}

          {/* ESTIMATE */}
          {isAdminOrManager && (
            <div className="space-y-1">
              <Label>Estimate Hours</Label>
              <Input
                type="number"
                {...form.register('estimateHours', {
                  valueAsNumber: true,
                })}
              />
            </div>
          )}

          {/* PRIORITY */}
          {isAdminOrManager && (
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
          )}

          {/* STATUS (everyone, but member no done) */}
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

                {isAdminOrManager && (
                  <SelectItem value="done">Done</SelectItem>
                )}
              </SelectContent>
            </Select>

            {isMember && (
              <p className="text-xs text-muted-foreground">
                Only manager or admin can mark task as done
              </p>
            )}
          </div>

          {/* DUE DATE */}
          {isAdminOrManager && (
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input type="date" {...form.register('dueDate')} />
            </div>
          )}

          {/* ASSIGNEES */}
          {isAdminOrManager && (
            <div className="space-y-2">
              <Label>Assignees</Label>

              <div className="border rounded p-2 space-y-1 max-h-40 overflow-y-auto">
                {teamSnap.loading && (
                  <p className="text-xs text-muted-foreground">
                    Loading team members...
                  </p>
                )}

                {!teamSnap.loading &&
                  teamSnap.list.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No team members found
                    </p>
                  )}

                {teamSnap.list.map((team) => (
                  <label
                    key={team._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form
                        .watch('assignees')
                        .includes(team.userId._id)}
                      onChange={(e) => {
                        const prev =
                          form.getValues('assignees') || [];
                        form.setValue(
                          'assignees',
                          e.target.checked
                            ? [...prev, team.userId._id]
                            : prev.filter(
                                (id) => id !== team.userId._id,
                              ),
                        );
                      }}
                    />
                    <span>
                      {team.userId.name}{' '}
                      <span className="text-muted-foreground">
                        ({team.role})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
