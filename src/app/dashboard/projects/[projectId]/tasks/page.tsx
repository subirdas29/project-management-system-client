'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import TaskTable from '@/components/pages/projects/sprints/tasks/tasktable/TaskTable';

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(
                `/dashboard/projects/${projectId}/sprints`,
              )
            }
          >
            <ArrowLeft size={16} />
          </Button>

          <h1 className="text-xl font-semibold">
            All Tasks
          </h1>
        </div>
      </div>

      {/* TASK TABLE */}
      <TaskTable projectId={projectId} />
    </div>
  );
}
