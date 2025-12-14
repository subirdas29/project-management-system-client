'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { sprintStore } from '@/store/sprintStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormData = {
  title: string;
  startDate: string;
  endDate: string;
};

export default function CreateSprintModal({
  projectId,
}: {
  projectId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      startDate: '',
      endDate: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await sprintStore.createSprint({
        title: data.title,
        projectId,
        startDate: data.startDate,
        endDate: data.endDate,
      });

      toast.success('Sprint created successfully');
      setOpen(false);
      form.reset();

      // refresh sprint list
      await sprintStore.getProjectSprints(projectId);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Failed to create sprint',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer'>Create Sprint</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Sprint</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label>Title</Label>
            <Input
              {...form.register('title', { required: true })}
              placeholder="Sprint title"
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              {...form.register('startDate', {
                required: true,
              })}
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              {...form.register('endDate', {
                required: true,
              })}
            />
          </div>

          <Button className="w-full" type="submit">
            Create Sprint
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
