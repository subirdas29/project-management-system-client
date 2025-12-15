/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';

import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import projectStore from '@/store/projectStore';
import { sprintStore } from '@/store/sprintStore';

import SprintCard from '@/components/pages/projects/sprints/SprintCard';
import CreateSprintModal from '@/components/pages/projects/sprints/CreateSprintModal';
import { Button } from '@/components/ui/button';

export default function SprintPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const projectSnap = useSnapshot(projectStore);
  const sprintSnap = useSnapshot(sprintStore);

  useEffect(() => {
    if (!projectId) return;

    projectStore.getSingleProject(projectId);
    sprintStore.getProjectSprints(projectId);
  }, [projectId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sprintSnap.list.findIndex(
      (s: any) => s._id === active.id,
    );
    const newIndex = sprintSnap.list.findIndex(
      (s: any) => s._id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) return;

    // ✅ optimistic UI reorder
    const newList = arrayMove(
      [...sprintSnap.list],
      oldIndex,
      newIndex,
    );

    sprintStore.list = newList;

    // ✅ TYPE FIX HERE (_id instead of sprintId)
    const items: { _id: string; order: number }[] =
      newList.map((sprint: any, index: number) => ({
        _id: sprint._id,
        order: index + 1,
      }));

    try {
      await sprintStore.reorderSprints(projectId, items);
    } catch {
      // fallback reload
      sprintStore.getProjectSprints(projectId);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {projectSnap.single.data?.title} – Sprints
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/projects/${projectId}/tasks`,
              )
            }
            className="cursor-pointer"
          >
            All Tasks
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/projects/${projectId}/kanban`,
              )
            }
            className="cursor-pointer"
          >
            Kanban Board
          </Button>

          <CreateSprintModal projectId={projectId} />
        </div>
      </div>

      {/* SPRINT LIST */}
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
