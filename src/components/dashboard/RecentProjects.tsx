'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import projectStore from '@/store/projectStore';

export default function RecentProjects() {
  const router = useRouter();
  const snap = useSnapshot(projectStore);

  useEffect(() => {
    projectStore.getAllProjects({
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {snap.list.data.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects found
          </p>
        )}

        {snap.list.data.map((project) => (
          <div
            key={project._id}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0"
          >
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-muted-foreground">
                {project.client} •{' '}
                <span className="capitalize">
                  {project.status}
                </span>
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() =>
                router.push(
                  `/dashboard/projects/${project._id}`,
                )
              }
            >
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
