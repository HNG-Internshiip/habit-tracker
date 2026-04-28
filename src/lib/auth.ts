import type { User, Session } from '@/types/auth';
import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage';

// ── Signup ────────────────────────────────────────────────────────────────────
export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

export function signUp(email: string, password: string): AuthResult {
  if (!email) return { ok: false, error: 'Email is required' };
  if (!password) return { ok: false, error: 'Password is required' };

  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, error: 'User already exists' };

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session: Session = { userId: newUser.id, email: newUser.email };
  saveSession(session);

  return { ok: true, session };
}

// ── Login ─────────────────────────────────────────────────────────────────────
export function logIn(email: string, password: string): AuthResult {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) return { ok: false, error: 'Invalid email or password' };

  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);

  return { ok: true, session };
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function logOut(): void {
  clearSession();
}

// ── Re-export for convenience ─────────────────────────────────────────────────
export { getSession };