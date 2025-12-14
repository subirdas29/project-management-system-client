'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import projectStore from '@/store/projectStore';
import { sprintStore } from '@/store/sprintStore';
import SprintCard from '@/components/pages/projects/sprints/SprintCard';
import CreateSprintModal from '@/components/pages/projects/sprints/CreateSprintModal';




export default function SprintPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const projectSnap = useSnapshot(projectStore);
  const sprintSnap = useSnapshot(sprintStore);

  useEffect(() => {
    projectStore.getSingleProject(projectId);
    sprintStore.getProjectSprints(projectId);
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {projectSnap.single.data?.title} – Sprints
        </h1>

        <CreateSprintModal projectId={projectId} />
      </div>

      {sprintSnap.list.map((sprint) => (
        <SprintCard key={sprint._id} sprint={sprint} />
      ))}
    </div>
  );
}
