'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { reportStore } from '@/store/reportStore';
import ProgressBar from '../myReports/ProgressBar';
import HoursBarChart from '../myReports/HourseBarChart';
import StatCard from './StarCard';


export default function ProjectReportView() {
  const { projectId } = useParams();
  const snap = useSnapshot(reportStore);

  useEffect(() => {
    reportStore.getProjectReport(projectId as string);
  }, [projectId]);

  if (snap.loading) {
    return <p className="p-6">Loading project report...</p>;
  }

  if (snap.error) {
    return (
      <p className="p-6 text-sm text-red-500">
        {snap.error}
      </p>
    );
  }

  if (!snap.project) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        No report data found
      </p>
    );
  }

  const {
    totalTasks,
    completedTasks,
    remainingTasks,
    progressPercent,
    totalEstimatedHours,
    totalLoggedHours,
  } = snap.project;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Project Report
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={totalTasks} />
        <StatCard label="Completed" value={completedTasks} />
        <StatCard label="Remaining" value={remainingTasks} />
        <StatCard label="Progress" value={`${progressPercent}%`} />
      </div>

      {/* PROGRESS BAR */}
      <ProgressBar percent={progressPercent} />

      {/* HOURS CHART */}
      <HoursBarChart
        estimated={totalEstimatedHours}
        logged={totalLoggedHours}
      />
    </div>
  );
}
