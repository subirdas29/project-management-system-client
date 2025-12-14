'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import Link from 'next/link';



import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import projectStore from '@/store/projectStore';

export default function ProjectOverviewClient({
  projectId,
}: {
  projectId: string;
}) {
  const snap = useSnapshot(projectStore);

  useEffect(() => {
    projectStore.getSingleProject(projectId);
    projectStore.getProjectOverview(projectId);
  }, [projectId]);

  const project = snap.single.data;
  const overview = snap.overview.data;

  if (!project) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{project.title}</h1>
          <p className="text-sm text-muted-foreground">
            {project.client}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}/sprints`}>Sprints</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}/tasks`}>Tasks</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}/team`}>Team</Link>
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={overview?.progress ?? 0} />
          <div className="text-sm text-muted-foreground">
            {overview?.completedTasks ?? 0} / {overview?.totalTasks ?? 0}{' '}
            tasks completed
          </div>
        </CardContent>
      </Card>

      {/* Sprints quick list */}
      <Card>
        <CardHeader>
          <CardTitle>Sprints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {overview?.sprints?.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between text-sm"
            >
              <span>
                Sprint {s.sprintNumber}: {s.title}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
