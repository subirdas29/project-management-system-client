'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';

import projectStore from '@/store/projectStore';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function ProjectOverview({
  projectId,
}: {
  projectId: string;
}) {
  const snap = useSnapshot(projectStore);
  const router = useRouter();

  useEffect(() => {
    projectStore.getProjectOverview(projectId);
  }, [projectId]);

  const data = snap.overview.data;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        {data.project.title}
      </h1>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p><strong>Client:</strong> {data.project.client}</p>
          <p><strong>Status:</strong> {data.project.status}</p>
          <p>
            <strong>Tasks:</strong>{' '}
            {data.completedTasks} / {data.totalTasks}
          </p>

          <Progress value={data.progress} />
        </CardContent>
      </Card>

     
      <Button
        onClick={() =>
          router.push(
            `/dashboard/projects/${projectId}/sprints`,
          )
        }
      >
        Manage Sprints & Tasks
      </Button>
    </div>
  );
}
