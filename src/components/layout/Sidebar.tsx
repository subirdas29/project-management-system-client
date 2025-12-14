'use client';

import Link from 'next/link';
import { useSnapshot } from 'valtio';

import { cn } from '@/lib/utils';
import authStore from '@/store/authStore';

const NavItem = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => (
  <Link
    href={href}
    className={cn(
      'block rounded-lg px-3 py-2 text-sm hover:bg-muted transition',
    )}
  >
    {label}
  </Link>
);

export default function Sidebar() {
  const { user } = useSnapshot(authStore);

  return (
    <aside className="hidden lg:block w-64 border-r bg-background min-h-screen">
      <div className="p-4 font-semibold">
        MPMS
      </div>

      <nav className="px-2 space-y-1">
        {/* COMMON */}
        <NavItem href="/dashboard" label="Dashboard" />

        {/* ADMIN / MANAGER */}
        {(user?.role === 'admin' ||
          user?.role === 'manager') && (
          <>
            <NavItem
              href="/dashboard/projects"
              label="Projects"
            />

            {/* REPORTS */}
            <div className="pt-2">
              <p className="px-3 text-xs text-muted-foreground uppercase">
                Reports
              </p>

              <NavItem
                href="/dashboard/reports"
                label="All Projects Report"
              />
               <NavItem
                href="/dashboard/reports/users"
                label="Users Report"
              />
             
              <NavItem
                href="/dashboard/reports/me"
                label="My Report"
              />
            </div>
          </>
        )}

        {/* MEMBER */}
        {user?.role === 'member' && (
          <>
            <NavItem
              href="/dashboard?view=my-tasks"
              label="My Tasks"
            />

            <div className="pt-2">
              <p className="px-3 text-xs text-muted-foreground uppercase">
                Reports
              </p>

              <NavItem
                href="/dashboard/reports/me"
                label="My Report"
              />
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
