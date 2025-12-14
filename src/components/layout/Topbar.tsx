
'use client';

import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';

import authStore from '@/store/authStore';
import MobileSidebar from '@/components/layout/MobileSidebar';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Topbar() {
  const { user } = useSnapshot(authStore);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <span className="font-semibold">MPMS</span>
        </div>

        {/* Right */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {user.name}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  authStore.logout();
                  router.replace('/login');
                }}
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
