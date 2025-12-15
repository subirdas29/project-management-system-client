'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';

import authStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const NavItem = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => (
  <Link
    href={href}
    className="block rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
  >
    {label}
  </Link>
);

export default function MobileSidebar() {
  const { user } = useSnapshot(authStore);
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 p-0 flex flex-col"
      >
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>

       
        <div>
          <div className="p-4 font-semibold border-b">
            Product Management
          </div>

          <nav className="px-2 py-2 space-y-1">
           
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
      </SheetContent>
    </Sheet>
  );
}
