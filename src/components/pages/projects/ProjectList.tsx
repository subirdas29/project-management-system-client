'use client';

import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import projectStore from '@/store/projectStore';
import authStore from '@/store/authStore';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import CreateProjectModal from './ProjectCreateClient';
import ConfirmDialog from '@/components/ui/confirmModal/ConfirmModal';

import type { TProject, TProjectStatus } from '@/types/project';


type TProjectFilterStatus = TProjectStatus | 'all';


type TModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; project: TProject };

const statusStyles: Record<TProjectStatus, string> = {
  planned: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
  archived: 'bg-gray-200 text-gray-600',
};

export default function ProjectList() {
  const router = useRouter();

  const { user } = useSnapshot(authStore);
  const snap = useSnapshot(projectStore);

  const [status, setStatus] =
    useState<TProjectFilterStatus>('all');

  const [modal, setModal] = useState<TModalState>({
    mode: 'closed',
  });

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    projectStore.getAllProjects({
      status: status === 'all' ? undefined : status,
    });
  }, [status]);


 
  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);

      const [, err] = await projectStore.deleteProject(id);

      if (err) {
        toast.error('Failed to delete project');
        return;
      }

      toast.success('Project deleted successfully');
      setDeleteId(null);

      await projectStore.getAllProjects({
        status: status === 'all' ? undefined : status,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
 
      <div className="flex justify-between items-center">
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(value as TProjectFilterStatus)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">
              Completed
            </SelectItem>
            <SelectItem value="archived">
              Archived
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setModal({ mode: 'create' })}>
          Create Project
        </Button>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snap.list.data.map((project: TProject) => (
          <Card key={project._id} className="relative">
            <CardContent className="p-4 space-y-2">
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() =>
                    setModal({
                      mode: 'edit',
                      project,
                    })
                  }
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() =>
                    setDeleteId(project._id)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="font-medium">
                {project.title}
              </p>

              {/* STATUS BADGE */}
              <span
                className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                  statusStyles[project.status]
                }`}
              >
                {project.status.toUpperCase()}
              </span>

              <p className="text-sm text-muted-foreground">
                {project.client}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  router.push(
                    `/dashboard/projects/${project._id}`
                  )
                }
              >
                View Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

   
      <CreateProjectModal
        open={modal.mode !== 'closed'}
        project={
          modal.mode === 'edit'
            ? modal.project
            : undefined
        }
        onClose={() => setModal({ mode: 'closed' })}
      />

 
      <ConfirmDialog
        open={!!deleteId}
        loading={deleting}
        title="Delete Project"
        description="Are you sure you want to delete this project?"
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={() =>
          deleteId && handleDelete(deleteId)
        }
      />
    </div>
  );
}
