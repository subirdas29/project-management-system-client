'use client';

import Link from 'next/link';
import { useSnapshot } from 'valtio';

import { cn } from '@/lib/utils';
import authStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

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
   const router = useRouter();

  return (
    <aside className="hidden lg:flex w-64 border-r bg-background min-h-screen flex-col">
      
      {/* TOP */}
      <div>
        <div className="p-4 font-semibold">
          Product Management
        </div>

        <nav className="px-2 space-y-1">
      
          <NavItem href="/dashboard" label="Dashboard" />

        
          {(user?.role === 'admin' ||
            user?.role === 'manager') && (
            <>
              <NavItem
                href="/dashboard/projects"
                label="Projects"
              />

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

      
          {user?.role === 'member' && (
            <>
              <NavItem
                href="/dashboard/projects"
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
      </div>

     
      <div className="mt-auto p-4 border-t">
        <button
             onClick={() => {
                  authStore.logout();
                  router.replace('/login');
                }}
          className="w-full rounded-lg px-3 py-2 text-sm text-left
                      hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
