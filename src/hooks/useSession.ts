"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types/auth";
import { getSession } from "@/lib/auth";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = () => {
      setSession(getSession());
      setLoading(false);
    };

    sync();

    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, []);

  return { session, loading };
}