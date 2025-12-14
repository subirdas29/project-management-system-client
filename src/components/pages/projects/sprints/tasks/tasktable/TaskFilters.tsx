'use client';

import { useSnapshot } from 'valtio';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { taskStore } from '@/store/taskStore';

export default function TaskTableFilters({
  projectId,
}: {
  projectId: string;
}) {
  const snap = useSnapshot(taskStore);

  return (
    <div className="flex gap-2 flex-wrap">
    
      <Select
        value={snap.table.filters.status}
        onValueChange={(value) => {
          taskStore.setTableFilters({
            projectId,
            status: value,
          });
          taskStore.getTasksTable();
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="inprogress">In Progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* PRIORITY FILTER */}
      <Select
        value={snap.table.filters.priority}
        onValueChange={(value) => {
          taskStore.setTableFilters({
            projectId,
            priority: value,
          });
          taskStore.getTasksTable();
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
