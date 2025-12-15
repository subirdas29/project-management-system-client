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



type TPriority = 'low' | 'medium' | 'high';
type TStatus = 'todo' | 'inprogress' | 'review' | 'done';

type TFormData = {
  title: string;
  description?: string;
  estimateHours?: number;
  priority: TPriority;
  status: TStatus;
  dueDate?: string;
  assignees: string[];
};

type TTaskUI = {
  _id: string;
  title?: string;
  description?: string;
  estimateHours?: number;
  priority?: TPriority;
  status?: TStatus;
  dueDate?: string;
  assignees?: Array<
    | string
    | {
        _id: string;
        name?: string;
      }
  >;
  projectId?: {
    _id: string;
  };
};

type TTeamMemberUI = {
  _id: string;
  role: 'admin' | 'manager' | 'member';
  userId:
    | string
    | {
        _id: string;
        name?: string;
      };
};

type TUpdateTaskPayload =
  | Partial<TFormData>
  | { status: TStatus };



export default function EditTaskModal({
  open,
  task,
  onClose,
}: {
  open: boolean;
  task: TTaskUI | null;
  onClose: () => void;
}) {
  const teamSnap = useSnapshot(teamStore);
  const { user } = useSnapshot(authStore);

  const isAdminOrManager =
    user?.role === 'admin' || user?.role === 'manager';
  const isMember = user?.role === 'member';

  const form = useForm<TFormData>({
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
    if (open && task) {
      form.reset({
        title: task.title ?? '',
        description: task.description ?? '',
        estimateHours: task.estimateHours,
        priority: task.priority ?? 'medium',
        status: task.status ?? 'todo',
        dueDate: task.dueDate
          ? task.dueDate.split('T')[0]
          : '',
        assignees: (task.assignees || [])
          .map((u) =>
            typeof u === 'string' ? u : u._id,
          )
          .filter(Boolean),
      });
    }
  }, [open, task, form]);


  useEffect(() => {
    if (
      open &&
      isAdminOrManager &&
      task?.projectId?._id
    ) {
      teamStore.getProjectTeam(task.projectId._id);
    }
  }, [open, isAdminOrManager, task?.projectId?._id]);

  const onSubmit = async (data: TFormData) => {
    try {
      if (isMember && task?.status === 'done') {
        toast.error(
          'Completed task cannot be updated',
        );
        return;
      }

      let payload: TUpdateTaskPayload;

      if (isAdminOrManager) {
        payload = {
          ...data,
          assignees: data.assignees.filter(Boolean),
        };
      } else {
        payload = { status: data.status };
      }

      await taskStore.updateTask(task!._id, payload);
      toast.success('Task updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update task');
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
              <Input
                {...form.register('title', {
                  required: true,
                })}
              />
            </div>
          )}

          {/* DESCRIPTION */}
          {isAdminOrManager && (
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                {...form.register('description')}
              />
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
                  form.setValue(
                    'priority',
                    v as TPriority,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Low
                  </SelectItem>
                  <SelectItem value="medium">
                    Medium
                  </SelectItem>
                  <SelectItem value="high">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* STATUS */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(v) =>
                form.setValue(
                  'status',
                  v as TStatus,
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">
                  To Do
                </SelectItem>
                <SelectItem value="inprogress">
                  In Progress
                </SelectItem>
                <SelectItem value="review">
                  Review
                </SelectItem>
                {isAdminOrManager && (
                  <SelectItem value="done">
                    Done
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {isMember && (
              <p className="text-xs text-muted-foreground">
                Only admin or manager can mark
                task as done
              </p>
            )}
          </div>

          {/* DUE DATE */}
          {isAdminOrManager && (
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input
                type="date"
                {...form.register('dueDate')}
              />
            </div>
          )}

          {/* ASSIGNEES */}
          {isAdminOrManager && (
            <div className="space-y-2">
              <Label>Assignees</Label>

              <div className="border rounded p-2 space-y-1 max-h-40 overflow-y-auto">
                {teamSnap.list.map(
                  (team: TTeamMemberUI) => {
                    const userId =
                      typeof team.userId ===
                      'string'
                        ? team.userId
                        : team.userId._id;

                    return (
                      <label
                        key={team._id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={form
                            .watch('assignees')
                            .includes(userId)}
                          onChange={(e) => {
                            const prev =
                              form.getValues(
                                'assignees',
                              ) || [];

                            form.setValue(
                              'assignees',
                              e.target.checked
                                ? [...prev, userId]
                                : prev.filter(
                                    (id) =>
                                      id !== userId,
                                  ),
                            );
                          }}
                        />

                        <span>
                          {typeof team.userId ===
                          'string'
                            ? 'Unknown User'
                            : team.userId.name}{' '}
                          <span className="text-muted-foreground">
                            ({team.role})
                          </span>
                        </span>
                      </label>
                    );
                  },
                )}
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
