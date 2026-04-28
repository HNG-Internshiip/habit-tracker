'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import type { Session } from '@/types/auth';

interface Props {
  children: (session: Session) => React.ReactNode;
}

/**
 * ProtectedRoute — TRD §6 required component.
 *
 * Reads the session from localStorage on mount.
 * If no valid session exists, redirects to /login.
 * If a valid session exists, renders children with the session injected.
 *
 * Usage:
 *   <ProtectedRoute>
 *     {(session) => <Dashboard session={session} />}
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/login');
    } else {
      setSession(s);
      setChecked(true);
    }
  }, [router]);

  if (!checked || !session) return null;

  return <>{children(session)}</>;
}