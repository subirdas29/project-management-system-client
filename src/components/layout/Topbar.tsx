'use client';

import { useSnapshot } from 'valtio';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import authStore from '@/store/authStore';
import MobileSidebar from '@/components/layout/MobileSidebar';

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

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <span className="font-semibold">Product Management</span>
        </div>

        {/* Right */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <Button
  variant="ghost"
  className="
    flex items-center gap-1 px-3
   border-2
    rounded-md
    hover:bg-accent
  "
>
    
  <span className="font-medium">{user.name}</span>
  <ChevronDown className="h-4 w-4 text-muted-foreground" />
</Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-1 ">
                <p className="text-sm font-medium ">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  Role: {user.role}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

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
