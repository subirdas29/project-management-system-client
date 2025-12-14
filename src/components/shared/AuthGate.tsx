'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';
import authStore from '@/store/authStore';

const PUBLIC_ROUTES = ['/login'];

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const authSnap = useSnapshot(authStore);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
 
      if (PUBLIC_ROUTES.includes(pathname)) {
        if (mounted) setChecking(false);
        return;
      }

  
      const [me] = await authStore.reAuthorizeWithToken();

      if (!mounted) return;

   
      if (!me) {
        router.replace('/login');
        return;
      }

     
      setChecking(false);
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

 
  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">
          Checking session...
        </div>
      </div>
    );
  }


  if (!authSnap.isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
