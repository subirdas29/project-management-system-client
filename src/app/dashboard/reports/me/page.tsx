'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { reportStore } from '@/store/reportStore';

import ReportStatCard from '@/components/pages/reports/myReports/ReportStatCard';
import HoursBarChart from '@/components/pages/reports/myReports/HourseBarChart';
import TimeBreakdownTable from '@/components/pages/reports/myReports/TimeBreakdownTable';

export default function MyReportPage() {
  const snap = useSnapshot(reportStore);

  useEffect(() => {
    reportStore.getMyReport();
  }, []);

  if (!snap.me) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">My Report</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportStatCard label="Total Tasks" value={snap.me.totalTasks} />
        <ReportStatCard label="Completed" value={snap.me.completedTasks} />
        <ReportStatCard label="Remaining" value={snap.me.remainingTasks} />
        <ReportStatCard
          label="Logged Hours"
          value={`${snap.me.totalLoggedHours} h`}
        />
      </div>

      <HoursBarChart
        estimated={snap.me.totalEstimatedHours}
        logged={snap.me.totalLoggedHours}
      />

    </div>
  );
}
