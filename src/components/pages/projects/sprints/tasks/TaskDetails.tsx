'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

export default function TaskDetails({ task }: { task: any }) {
  return (
    <div className="space-y-4">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold">{task.title}</h1>

      {/* STATUS + PRIORITY */}
      <div className="flex gap-2 flex-wrap">
        <span
          className={`px-2 py-1 rounded text-xs capitalize ${STATUS_COLOR[task.status]}`}
        >
          {task.status}
        </span>

        <Badge variant="outline" className="capitalize">
          Priority: {task.priority}
        </Badge>

        {task.sprintId && (
          <Badge variant="secondary">
            Sprint {task.sprintId.sprintNumber}
          </Badge>
        )}
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT SIDE (2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          {/* MAIN INFO */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p>
                <strong>Description:</strong>
              </p>
              <p className="text-muted-foreground">
                {task.description || '—'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Due Date:</strong>{' '}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : '—'}
                </p>

                <p>
                  <strong>Estimate:</strong>{' '}
                  {task.estimateHours || 0} hrs
                </p>

                <p>
                  <strong>Project:</strong>{' '}
                  {task.projectId?.title || '—'}
                </p>

                <p>
                  <strong>Client:</strong>{' '}
                  {task.projectId?.client || '—'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ASSIGNEES */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Assignees</h3>

              {task.assignees?.length ? (
                <ul className="text-sm space-y-1">
                  {task.assignees.map((u: any) => (
                    <li key={u._id}>
                      {u.name} ({u.role})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No assignees
                </p>
              )}
            </CardContent>
          </Card>

          {/* ATTACHMENTS */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Attachments</h3>

              {task.attachments?.length ? (
                <ul className="text-sm list-disc ml-4">
                  {task.attachments.map(
                    (file: string, i: number) => (
                      <li key={i}>
                        <a
                          href={file}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {file}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No attachments
                </p>
              )}
            </CardContent>
          </Card>

          {/* SUBTASKS */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Subtasks</h3>

              {task.subtasks?.length ? (
                <ul className="text-sm space-y-1">
                  {task.subtasks.map((s: any, i: number) => (
                    <li key={i}>
                      {s.isDone ? '✅' : '⬜'} {s.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No subtasks
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE – ACTIVITY LOG */}
  
<div className="space-y-4">
  <Card className="lg:sticky lg:top-4">
    <CardContent className="p-4 space-y-3">
      <h3 className="font-medium">Activity Log</h3>

      {task.activityLog?.length ? (
        task.activityLog.map((log: any, i: number) => {
          const user = log.userId;

          return (
            <div
              key={i}
              className="text-sm border-l-2 pl-3 space-y-0.5"
            >
              <p className="text-muted-foreground">
                • {log.action}
              </p>

              <p className="text-xs text-muted-foreground">
                {user?.name ? (
                  <>
                    <span className="font-medium text-foreground">
                      {user.name}
                    </span>{' '}
                    <span className="capitalize">
                      ({user.role})
                    </span>
                  </>
                ) : (
                  'System'
                )}{' '}
                —{' '}
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">
          No activity yet
        </p>
      )}
    </CardContent>
  </Card>
</div>

      </div>
    </div>
  );
}
