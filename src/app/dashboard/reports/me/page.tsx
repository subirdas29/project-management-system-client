'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { reportStore } from '@/store/reportStore';

import ReportStatCard from '@/components/pages/reports/myReports/ReportStatCard';
import HoursBarChart from '@/components/pages/reports/myReports/HourseBarChart';

export default function MyReportPage() {
  const snap = useSnapshot(reportStore);

  useEffect(() => {
    reportStore.getMyReport();
  }, []);


  if (snap.loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Loading report...
      </div>
    );
  }

  if (!snap.me || !Array.isArray(snap.me) || snap.me.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No report data available
      </div>
    );
  }

  const projects = snap.me;


  const summary = projects.reduce(
    (acc, p) => {
      acc.totalTasks += p.totalTasks || 0;
      acc.completedTasks += p.completedTasks || 0;
      acc.remainingTasks += p.remainingTasks || 0;
      acc.totalEstimatedHours += p.totalEstimatedHours || 0;
      acc.totalLoggedHours += p.totalLoggedHours || 0;
      return acc;
    },
    {
      totalTasks: 0,
      completedTasks: 0,
      remainingTasks: 0,
      totalEstimatedHours: 0,
      totalLoggedHours: 0,
    },
  );

  return (
    <div className="space-y-8">
     
      <div>
        <h1 className="text-2xl font-semibold">My Report</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your assigned project tasks and time logs
        </p>
      </div>

   
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <ReportStatCard label="Total Tasks" value={summary.totalTasks} />
        <ReportStatCard
          label="Completed"
          value={summary.completedTasks}
        />
        <ReportStatCard
          label="Remaining"
          value={summary.remainingTasks}
        />
        <ReportStatCard
          label="Logged Hours"
          value={`${summary.totalLoggedHours} h`}
        />
      </div>

  
      <div className="rounded-lg border bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">
          Hours Overview
        </h2>
        <HoursBarChart
          estimated={summary.totalEstimatedHours}
          logged={summary.totalLoggedHours}
        />
      </div>

 
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Project Breakdown
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map(project => (
            <div
              key={project.projectId}
              className="rounded-lg border p-4 transition hover:shadow-sm"
            >
              <div className="mb-2">
                <h3 className="font-medium">
                  {project.projectTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Project ID: {project.projectId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <span className="block text-muted-foreground">
                    Total Tasks
                  </span>
                  <span className="font-medium">
                    {project.totalTasks}
                  </span>
                </div>

                <div>
                  <span className="block text-muted-foreground">
                    Completed
                  </span>
                  <span className="font-medium">
                    {project.completedTasks}
                  </span>
                </div>

                <div>
                  <span className="block text-muted-foreground">
                    Remaining
                  </span>
                  <span className="font-medium">
                    {project.remainingTasks}
                  </span>
                </div>

                <div>
                  <span className="block text-muted-foreground">
                    Logged Hours
                  </span>
                  <span className="font-medium">
                    {project.totalLoggedHours} h
                  </span>
                </div>

                <div>
                  <span className="block text-muted-foreground">
                    Progress
                  </span>
                  <span className="font-medium">
                    {project.progressPercent ?? 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
