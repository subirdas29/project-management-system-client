'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';
import TaskTableFilters from './TaskFilters';
import TaskTableRow from './TaskTableRow';


export default function TaskTable({
  projectId,
}: {
  projectId: string;
}) {
  const snap = useSnapshot(taskStore);

 
  useEffect(() => {
    taskStore.setTableFilters({ projectId });
    taskStore.getTasksTable();
  }, [projectId]);

  const { data, loading, error } = snap.table;

  return (
    <div className="space-y-4">
      <TaskTableFilters projectId={projectId} />

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignees</th>
              <th>Due</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              data.map((task) => (
                <TaskTableRow key={task._id} task={task} />
              ))}

            {!loading && !data.length && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-muted-foreground"
                >
                  No tasks found
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
