'use client';

import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';



import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import projectStore from '@/store/projectStore';
import authStore from '@/store/authStore';
import Link from 'next/link';

export default function ProjectsPageClient() {
  const { user } = useSnapshot(authStore);
  const snap = useSnapshot(projectStore);
  const [search, setSearch] = useState('');

  useEffect(() => {
    projectStore.getAllProjects(
      search ? `?search=${encodeURIComponent(search)}` : '',
    );
  }, [search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            All active and archived projects
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search by title or client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {user?.role === 'admin' && (
            <Button asChild>
              <Link href="/projects/create">Create Project</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {snap.list.data.map((project) => (
          <Link key={project._id} href={`/projects/${project._id}`}>
            <Card className="hover:shadow-sm transition">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium line-clamp-1">
                    {project.title}
                  </div>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  {project.client}
                </div>

                <div className="text-xs text-muted-foreground">
                  Tasks: {project.taskStats?.total ?? 0} • Done:{' '}
                  {project.taskStats?.completed ?? 0}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
