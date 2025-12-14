'use client';

import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';

import authStore from '@/store/authStore';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Topbar() {
  const { user } = useSnapshot(authStore);
  const router = useRouter();

  const handleLogout = () => {
    authStore.logout();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left: Page title / Logo */}
        <div className="font-semibold text-sm md:text-base">
          Project Management System
        </div>

        {/* Right: User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-sm font-medium">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
