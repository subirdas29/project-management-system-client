'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { taskStore } from '@/store/taskStore';

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

type FormData = {
  title: string;
  description?: string;
};

export default function CreateTaskModal({
  sprintId,
}: {
  sprintId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await taskStore.createTask({
        title: data.title,
        description: data.description,
        sprintId, 
      });

      toast.success('Task created');
      setOpen(false);
      form.reset();

      // refresh task list for this sprint
      await taskStore.getTasks({ sprintId });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Failed to create task',
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label>Title</Label>
            <Input
              {...form.register('title', { required: true })}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...form.register('description')} />
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
