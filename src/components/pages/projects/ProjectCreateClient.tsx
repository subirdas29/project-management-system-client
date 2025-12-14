'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';

import projectStore from '@/store/projectStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type FormData = {
  title: string;
  client: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: 'planned' | 'active' | 'completed' | 'archived';
  thumbnail?: string;
};

interface Props {
  open: boolean;
  project?: Partial<FormData> & { _id?: string };
  onClose: () => void;
}

const formatDate = (date?: string) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export default function CreateProjectModal({
  open,
  project,
  onClose,
}: Props) {
  useSnapshot(projectStore);

  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      client: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: undefined,
      status: 'planned',
      thumbnail: '',
    },
  });


  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title ?? '',
        client: project.client ?? '',
        description: project.description ?? '',
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate),
        budget: project.budget,
        status: project.status ?? 'planned',
        thumbnail: project.thumbnail ?? '',
      });
    } else {
      form.reset({
        title: '',
        client: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: undefined,
        status: 'planned',
        thumbnail: '',
      });
    }
  }, [project, form]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      budget: data.budget ? Number(data.budget) : undefined,
    };

    const res = project?._id
      ? await projectStore.updateProject(project._id, payload)
      : await projectStore.createProject(payload);

    const [, err] = res;

    if (err) {
      toast.error(
        project?._id
          ? 'Failed to update project'
          : 'Failed to create project',
      );
      return;
    }

    toast.success(
      project?._id
        ? 'Project updated successfully'
        : 'Project created successfully',
    );

    await projectStore.getAllProjects();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {project?._id ? 'Edit Project' : 'Create Project'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label>Title</Label>
            <Input {...form.register('title', { required: true })} />
          </div>

          <div>
            <Label>Client</Label>
            <Input {...form.register('client', { required: true })} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...form.register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input type="date" {...form.register('startDate')} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" {...form.register('endDate')} />
            </div>
          </div>

          <div>
            <Label>Budget</Label>
            <Input type="number" {...form.register('budget')} />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(v) =>
                form.setValue('status', v as FormData['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thumbnail URL</Label>
            <Input {...form.register('thumbnail')} />
          </div>

          <Button className="w-full" type="submit">
            {project?._id ? 'Update Project' : 'Create Project'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
