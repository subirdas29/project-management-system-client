'use client';

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import { Card, CardContent } from '@/components/ui/card';
import projectStore from '@/store/projectStore';

export default function DashboardStats() {
  const projectSnap = useSnapshot(projectStore);

  const isLoading = projectSnap.list.loading;
  const dataLength = projectSnap.list.data.length;

  useEffect(() => {
    if (!isLoading && dataLength === 0) {
      projectStore.getAllProjects();
    }
  }, [isLoading, dataLength]);

  const totalProjects = dataLength;
  const activeProjects = projectSnap.list.data.filter(
    (p) => p.status === 'active',
  ).length;

  const stats = [
    { label: 'Total Projects', value: totalProjects },
    { label: 'Active Projects', value: activeProjects },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
