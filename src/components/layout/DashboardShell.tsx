'use client';

import AuthGate from '@/components/shared/AuthGate';

import Topbar from '@/components/layout/Topbar';
import Sidebar from './Sidebar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-muted/40">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Topbar />
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
