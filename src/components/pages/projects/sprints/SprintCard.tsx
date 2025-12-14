'use client';

import TaskList from './tasks/TaskList';
import CreateTaskModal from './tasks/CreateTaskModal';

export default function SprintCard({ sprint }: any) {
  return (
    <div className="border rounded p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">
          Sprint {sprint.sprintNumber}: {sprint.title}
        </h2>

     
        <CreateTaskModal sprintId={sprint._id} />
      </div>

      <TaskList sprintId={sprint._id} />
    </div>
  );
}
