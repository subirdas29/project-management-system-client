'use client';

import { useForm } from 'react-hook-form';
import { sprintStore } from '@/store/sprintStore';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


type TSprintUI = {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
};


type TEditSprintForm = {
  title: string;
  startDate?: string;
  endDate?: string;
};

export default function EditSprintModal({
  open,
  sprint,
  onClose,
}: {
  open: boolean;
  sprint: TSprintUI;
  onClose: () => void;
}) {
  const form = useForm<TEditSprintForm>({
    defaultValues: {
      title: sprint?.title,
      startDate: sprint?.startDate?.slice(0, 10),
      endDate: sprint?.endDate?.slice(0, 10),
    },
  });

  const onSubmit = async (data: TEditSprintForm) => {
    try {
      await sprintStore.updateSprint(sprint._id, data);
      toast.success('Sprint updated');
      onClose();
    } catch {
      toast.error('Failed to update sprint');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sprint</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <Input
            {...form.register('title')}
            placeholder="Title"
          />

          <Input
            type="date"
            {...form.register('startDate')}
          />

          <Input
            type="date"
            {...form.register('endDate')}
          />

          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
