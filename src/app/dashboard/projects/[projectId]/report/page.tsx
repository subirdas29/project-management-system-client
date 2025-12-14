'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { reportStore } from '@/store/reportStore';
import projectStore from '@/store/projectStore';


import { Progress } from '@/components/ui/progress';
import ReportStatCard from '@/components/pages/reports/myReports/ReportStatCard';

export default function ProjectReportPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const reportSnap = useSnapshot(reportStore);
  const projectSnap = useSnapshot(projectStore);

  useEffect(() => {
    projectStore.getSingleProject(projectId);
    reportStore.getProjectReport(projectId);
  }, [projectId]);

  const data = reportSnap.project.data;
  if (!data) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-semibold">
        {projectSnap.single.data?.title} – Report
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportStatCard
          label="Total Tasks"
          value={data.totalTasks}
        />
        <ReportStatCard
          label="Completed"
          value={data.completedTasks}
        />
        <ReportStatCard
          label="Remaining"
          value={data.remainingTasks}
        />
        <ReportStatCard
          label="Est. Hours"
          value={data.totalEstimatedHours}
        />
      </div>

      {/* PROGRESS */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Progress: {data.progressPercent}%
        </p>
        <Progress value={data.progressPercent} />
      </div>
    </div>
  );
}
