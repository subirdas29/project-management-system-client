'use client';

import { useState } from 'react';
import { useSnapshot } from 'valtio';

import { taskStore } from '@/store/taskStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LogTimeModal from '@/components/ui/logTimeModal/LogTimeModal';

const STATUS_COLOR: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

export default function TaskDetails({ task }: { task: any }) {
  const [logOpen, setLogOpen] = useState(false);
  const snap = useSnapshot(taskStore);


  const t = snap.single?._id === task._id ? snap.single : task;

  const perUser: Record<string, number> = {};

  (t.timeLogs || []).forEach((log: any) => {
    let uid: string | undefined;

    if (log?.userId) {
      if (typeof log.userId === 'string') {
        uid = log.userId;
      } else if (log.userId?._id) {
        uid = log.userId._id.toString();
      }
    }

    if (!uid) return;

    perUser[uid] = (perUser[uid] || 0) + Number(log.hours || 0);
  });

  return (
    <div className="space-y-4">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      {/* STATUS + PRIORITY */}
      <div className="flex gap-2 flex-wrap">
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

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {/* DESCRIPTION */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p><strong>Description:</strong></p>
              <p className="text-muted-foreground">
                {t.description || '—'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Due Date:</strong>{' '}
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : '—'}
                </p>
                <p>
                  <strong>Estimate:</strong> {t.estimateHours || 0} hrs
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
              <h3 className="font-medium">Assignees</h3>

              {t.assignees?.length ? (
                <ul className="text-sm space-y-1">
                  {t.assignees.map((u: any, i: number) => (
                    <li key={u._id?.toString() ?? `assignee-${i}`}>
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

          {/* SUBTASKS */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-medium">Subtasks</h3>

              {t.subtasks?.length ? (
                <ul className="text-sm space-y-1">
                  {t.subtasks.map((s: any, i: number) => (
                    <li key={`${s.title}-${i}`}>
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

        {/* RIGHT */}
        <div className="space-y-4">
          {/* TIME TRACKING */}
          <Card className="lg:sticky lg:top-4">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-medium">Time Tracking</h3>

              <div className="text-sm space-y-1">
                <p><strong>Estimated:</strong> {t.estimateHours || 0} hrs</p>
                <p><strong>Logged:</strong> {t.loggedHours || 0} hrs</p>
              </div>

              {/* 🔥 USER-WISE BREAKDOWN */}
              {t.assignees?.length ? (
                <div className="pt-2 border-t space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Logged by
                  </p>

                  <ul className="text-sm space-y-1">
                    {t.assignees.map((u: any, i: number) => {
                      const uid = u._id?.toString();

                      return (
                        <li
                          key={uid ?? `log-${i}`}
                          className="flex items-center justify-between"
                        >
                          <span>{u.name}</span>
                          <span className="text-muted-foreground">
                            {(perUser[uid] ?? 0).toFixed(2)} h
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

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
              <h3 className="font-medium">Activity Log</h3>

              {t.activityLog?.length ? (
                t.activityLog.map((log: any) => (
                  <div
                    key={`${log.userId?._id ?? 'sys'}-${log.createdAt}`}
                    className="text-sm border-l-2 pl-3 space-y-0.5"
                  >
                    <p className="text-muted-foreground">
                      • {log.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.userId?.name ? (
                        <>
                          <span className="font-medium text-foreground">
                            {log.userId.name}
                          </span>{' '}
                          <span className="capitalize">
                            ({log.userId.role})
                          </span>
                        </>
                      ) : (
                        'System'
                      )}{' '}
                      — {new Date(log.createdAt).toLocaleString()}
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
    </div>
  );
}
