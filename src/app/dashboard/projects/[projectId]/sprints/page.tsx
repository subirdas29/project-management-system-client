'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { toast } from 'react-toastify';

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

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

 
    const current = [...sprintStore.list];

    const oldIndex = current.findIndex(
      (s) => s._id === active.id,
    );
    const newIndex = current.findIndex(
      (s) => s._id === over.id,
    );

    const reordered = arrayMove(
      current,
      oldIndex,
      newIndex,
    ).map((s, index) => ({
      ...s,
      order: index + 1,
    }));


    sprintStore.list = reordered;

    try {
      await sprintStore.reorderSprints(
        projectId,
        reordered.map((s) => ({
          sprintId: s._id,
          order: s.order,
        })),
      );
    } catch {
      toast.error('Failed to reorder sprints');
      sprintStore.getProjectSprints(projectId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {projectSnap.single.data?.title} – Sprints
        </h1>

        <CreateSprintModal projectId={projectId} />
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sprintSnap.list.map((s) => s._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sprintSnap.list.map((sprint) => (
              <SprintCard
                key={sprint._id}
                sprint={sprint}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
