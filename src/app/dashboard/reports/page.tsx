'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSnapshot } from 'valtio';

import projectStore from '@/store/projectStore';

export default function AllProjectsReport() {
  const snap = useSnapshot(projectStore);

  useEffect(() => {
    projectStore.getAllProjects();
  }, []);

  if (snap.list.loading) {
    return <p className="p-6">Loading projects...</p>;
  }

  if (snap.list.error) {
    return (
      <p className="p-6 text-sm text-red-500">
        {snap.list.error}
      </p>
    );
  }

  const projects = snap.list.data; 

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        All Projects Report
      </h1>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects found
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/reports/project/${project._id}`}
              className="block border rounded-lg p-4 hover:bg-muted transition"
            >
              <p className="font-medium">
                {project.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Client: {project.client}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
