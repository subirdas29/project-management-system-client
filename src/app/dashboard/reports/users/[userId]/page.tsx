'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSnapshot } from 'valtio';

import { reportStore } from '@/store/reportStore';
import ReportStatCard from '@/components/pages/reports/myReports/ReportStatCard';
import HoursBarChart from '@/components/pages/reports/myReports/HourseBarChart';

export default function UserReportPage() {
  const { userId } = useParams();
  const snap = useSnapshot(reportStore);

  useEffect(() => {
    reportStore.getUserReport(userId as string);
  }, [userId]);

  if (snap.loading) {
    return <p className="p-6">Loading user report...</p>;
  }

  if (!snap.user) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        No report found
      </p>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">
        User Report
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportStatCard label="Total Tasks" value={snap.user.totalTasks} />
        <ReportStatCard label="Completed" value={snap.user.completedTasks} />
        <ReportStatCard label="Remaining" value={snap.user.remainingTasks} />
        <ReportStatCard
          label="Logged Hours"
          value={`${snap.user.totalLoggedHours} h`}
        />
      </div>

      <HoursBarChart
        estimated={snap.user.totalEstimatedHours}
        logged={snap.user.totalLoggedHours}
      />
    </div>
  );
}
