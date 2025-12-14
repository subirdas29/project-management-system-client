'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useSnapshot } from 'valtio';

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
    className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
  >
    {label}
  </Link>
);

export default function MobileSidebar() {
  const { user } = useSnapshot(authStore);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
     
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>

        <div className="p-4 font-semibold border-b">
          MPMS
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
              <NavItem
                href="/dashboard/reports"
                label="Reports"
              />
            </>
          )}

          {user?.role === 'member' && (
            <NavItem
              href="/dashboard?view=my-tasks"
              label="My Tasks"
            />
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
