/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';

import { taskStore } from '@/store/taskStore';
import { teamStore } from '@/store/teamStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

export default function CreateTaskModal({
  sprintId,
  projectId,
}: {
  sprintId: string;
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const teamSnap = useSnapshot(teamStore);

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

  useEffect(() => {
    if (open && projectId) {
      teamStore.getProjectTeam(projectId);
    }
  }, [open, projectId]);

  const onSubmit = async (data: FormData) => {
    try {
      await taskStore.createTask({
        ...data,
        sprintId,
      });

      toast.success('Task created successfully');
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Failed to create task',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          + Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...form.register('title', { required: true })} />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea {...form.register('description')} />
          </div>

          {/* Estimate */}
          <div>
            <Label>Estimate (hours)</Label>
            <Input
              type="number"
              {...form.register('estimateHours', {
                valueAsNumber: true,
              })}
            />
          </div>

          {/* Priority */}
          <div>
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

          {/* Status */}
          <div>
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

          {/* Due Date */}
          <div>
            <Label>Due Date</Label>
            <Input type="date" {...form.register('dueDate')} />
          </div>

          {/* Assign Users */}
          <div>
            <Label>Assign Users</Label>

            <div className="border rounded p-2 max-h-40 overflow-auto space-y-1">
              {teamSnap.loading && (
                <p className="text-xs text-muted-foreground">
                  Loading team members...
                </p>
              )}

              {!teamSnap.loading &&
                teamSnap.list.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No team members found for this project
                  </p>
                )}

              {teamSnap.list.map((team) => {
                // ✅ SAFE user extraction
                const user =
                  typeof team.userId === 'object' &&
                  team.userId !== null
                    ? team.userId
                    : null;

                if (!user) return null;

                return (
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
                    <span>
                      {user.name ?? 'Unnamed user'}{' '}
                      <span className="text-muted-foreground">
                        ({team.role})
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
