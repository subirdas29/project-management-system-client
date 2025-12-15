'use client';

import { useState } from 'react';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LogTimeModal from '@/components/ui/logTimeModal/LogTimeModal';
import TaskComments from './taskComments/TaskComments';



const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

export default function TaskDetails({ task }: { task: any }) {
  const [logOpen, setLogOpen] = useState(false);
  const snap = useSnapshot(taskStore);

  // 🔥 Always use updated task if exists
  const t = snap.single?._id === task._id ? snap.single : task;

  /* -----------------------------
     TIME LOG PER USER
  ----------------------------- */
  const perUser: Record<string, number> = {};

  (t.timeLogs || []).forEach((log: any) => {
    let uid: string | undefined;

    if (typeof log.userId === 'string') uid = log.userId;
    else if (log.userId?._id) uid = log.userId._id.toString();

    if (!uid) return;
    perUser[uid] = (perUser[uid] || 0) + Number(log.hours || 0);
  });

  return (
    <div className="space-y-6">
      {/* =====================================================
         HEADER
      ===================================================== */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t.title}</h1>

        <div className="flex flex-wrap gap-2 items-center">
          <span
            className={`px-2 py-1 rounded text-xs capitalize ${STATUS_COLOR[t.status]}`}
          >
            {t.status}
          </span>

          <Badge variant="outline" className="capitalize">
            Priority: {t.priority}
          </Badge>

          {t.sprintId && (
            <Badge variant="secondary">
              Sprint {t.sprintId.sprintNumber}
            </Badge>
          )}
        </div>
      </div>

      {/* =====================================================
         MAIN GRID
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------- LEFT ---------------- */}
        <div className="lg:col-span-2 space-y-4">
          {/* DESCRIPTION */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {t.description || '—'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <p>
                  <strong>Due Date:</strong>{' '}
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : '—'}
                </p>
                <p>
                  <strong>Estimate:</strong>{' '}
                  {t.estimateHours || 0} hrs
                </p>
                <p>
                  <strong>Project:</strong>{' '}
                  {t.projectId?.title || '—'}
                </p>
                <p>
                  <strong>Client:</strong>{' '}
                  {t.projectId?.client || '—'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ASSIGNEES */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="font-medium">Assignees</p>

              {t.assignees?.length ? (
                <ul className="text-sm space-y-1">
                  {t.assignees.map((u: any, i: number) => (
                    <li key={u._id ?? i}>
                      {u.name}
                      <span className="text-muted-foreground">
                        {u.email ? ` (${u.email})` : ' (—)'}
                      </span>{' '}
                      <span className="capitalize text-muted-foreground">
                        ({u.role})
                      </span>
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

          {/* SUBTASKS */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="font-medium">Subtasks</p>

              {t.subtasks?.length ? (
                <ul className="text-sm space-y-1">
                  {t.subtasks.map((s: any, i: number) => (
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

        {/* ---------------- RIGHT ---------------- */}
        <div className="space-y-4">
          {/* TIME TRACKING */}
          <Card className="lg:sticky lg:top-4">
            <CardContent className="p-4 space-y-3">
              <p className="font-medium">Time Tracking</p>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Estimated:</strong>{' '}
                  {t.estimateHours || 0} hrs
                </p>
                <p>
                  <strong>Logged:</strong>{' '}
                  {t.loggedHours || 0} hrs
                </p>
              </div>

              {t.assignees?.length && (
                <div className="pt-2 border-t space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Logged by
                  </p>

                  <ul className="text-sm space-y-1">
                    {t.assignees.map((u: any, i: number) => {
                      const uid = u._id?.toString();
                      return (
                        <li
                          key={uid ?? i}
                          className="flex justify-between"
                        >
                          <span>
                            {u.name}
                            <span className="text-muted-foreground">
                              {u.email ? ` (${u.email})` : ''}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            {(perUser[uid] ?? 0).toFixed(2)} h
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <Button
                size="sm"
                className="w-full"
                onClick={() => setLogOpen(true)}
              >
                + Log Time
              </Button>
            </CardContent>

            <LogTimeModal
              open={logOpen}
              onClose={() => setLogOpen(false)}
              taskId={t._id}
            />
          </Card>

          {/* ACTIVITY LOG */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="font-medium">Activity Log</p>

              {t.activityLog?.length ? (
                t.activityLog.map((log: any, i: number) => (
                  <div
                    key={i}
                    className="border-l-2 pl-3 text-sm space-y-0.5"
                  >
                    <p className="text-muted-foreground">
                      • {log.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.userId?.name || 'System'} —{' '}
                      {new Date(
                        log.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* =====================================================
         ATTACHMENTS
      ===================================================== */}
      {/* <Card>
        <CardContent className="p-4">
          <TaskAttachments taskId={t._id} />
        </CardContent>
      </Card> */}

      {/* =====================================================
         COMMENTS
      ===================================================== */}
      <Card>
        <CardContent className="p-4">
          <TaskComments taskId={t._id} />
        </CardContent>
      </Card>
    </div>
  );
}
