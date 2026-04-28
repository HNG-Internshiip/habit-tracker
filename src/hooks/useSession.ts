// ── src/hooks/useSession.ts ──────────────────────────────────────────────────
'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@/types/auth';
import { getSession } from '@/lib/auth';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setLoading(false);
  }, []);

  return { session, loading, setSession };
}
