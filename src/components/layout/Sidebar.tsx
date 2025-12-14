
'use client';

import Link from 'next/link';
import { useSnapshot } from 'valtio';

import { cn } from '@/lib/utils';
import authStore from '@/store/authStore';

const NavItem = ({ href, label }: { href: string; label: string }) => (
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
      <div className="p-4 font-semibold">MPMS</div>

      <nav className="px-2 space-y-1">
        <NavItem href="/dashboard" label="Dashboard" />

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <>
            <NavItem href="/dashboard/projects" label="Projects" />
            <NavItem href="/dashboard/reports" label="Reports" />
          </>
        )}

        {user?.role === 'member' && (
          <NavItem
            href="/dashboard?view=my-tasks"
            label="My Tasks"
          />
        )}
      </nav>
    </aside>
  );
}
