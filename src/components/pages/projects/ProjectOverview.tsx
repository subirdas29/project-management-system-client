'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';

import projectStore from '@/store/projectStore';
import authStore from '@/store/authStore';
import { teamStore } from '@/store/teamStore';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProjectOverview({
  projectId,
}: {
  projectId: string;
}) {
  const projectSnap = useSnapshot(projectStore);
  const teamSnap = useSnapshot(teamStore);
  const { user } = useSnapshot(authStore);
  const router = useRouter();

  useEffect(() => {
    projectStore.getProjectOverview(projectId);
    teamStore.getProjectTeam(projectId);
  }, [projectId]);

  const data = projectSnap.overview.data;
  if (!data) return null;

  const { project, sprintStats, progress } = data;


  const canManageTeam = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="space-y-6">
 
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {project.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Client: {project.client || 'N/A'}
          </p>
        </div>

        <div className="flex gap-2">
          {canManageTeam && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/projects/${projectId}/team`,
                )
              }
            >
              Team & Roles
            </Button>
          )}

          <Button
            onClick={() =>
              router.push(
                `/dashboard/projects/${projectId}/sprints`,
              )
            }
          >
            Sprints & Tasks
          </Button>
        </div>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* STATUS */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Status
            </p>
            <Badge className="capitalize">
              {project.status}
            </Badge>
          </CardContent>
        </Card>

        {/* TIMELINE */}
        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Timeline
            </p>
            <p className="text-sm">
              Start:{' '}
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : 'N/A'}
            </p>
            <p className="text-sm">
              End:{' '}
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </CardContent>
        </Card>

        {/* BUDGET */}
        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Budget
            </p>
            <p className="text-lg font-medium">
              {project.budget
                ? `$${project.budget.toLocaleString()}`
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-medium">Description</p>
          <p className="text-sm text-muted-foreground">
            {project.description || 'N/A'}
          </p>
        </CardContent>
      </Card>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Total Sprints
            </p>
            <p className="text-2xl font-semibold">
              {sprintStats?.totalSprints ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Total Tasks
            </p>
            <p className="text-2xl font-semibold">
              {sprintStats?.totalTasks ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Completed Tasks
            </p>
            <p className="text-2xl font-semibold text-green-600">
              {sprintStats?.completedTasks ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Progress
            </p>
            <p className="text-2xl font-semibold">
              {progress ?? 0}%
            </p>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-medium">
            Overall Completion
          </p>
          <Progress value={progress ?? 0} />
          <p className="text-xs text-muted-foreground">
            Based on completed tasks (status = done)
          </p>
        </CardContent>
      </Card>

 
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Project Team
            </h3>
            <Badge variant="secondary">
              {teamSnap.list.length} Members
            </Badge>
          </div>

          {teamSnap.loading && (
            <p className="text-sm text-muted-foreground">
              Loading team members...
            </p>
          )}

          {!teamSnap.loading && teamSnap.list.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No team members assigned to this project
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamSnap.list.map((member) => (
              <div
                key={member._id}
                className="border rounded-lg p-3 space-y-1"
              >
                <p className="font-medium">
                  {typeof member.userId === 'object' ? member.userId?.name : member.userId}
                </p>

                <p className="text-xs text-muted-foreground">
                  {typeof member.userId === 'object' ? member.userId?.email : 'N/A'}
                </p>

                <Badge
                  variant="outline"
                  className="capitalize text-xs"
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
