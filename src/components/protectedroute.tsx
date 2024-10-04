"use client"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/') {
      router.push('/');
    }
  }, [user, loading, router, pathname]);


  return (pathname === '/' || user) ? <>{children}</> : null;
};

export default ProtectedRoute;