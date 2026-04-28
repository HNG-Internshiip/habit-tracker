import type { User, Session } from '@/types/auth';
import type { Habit } from '@/types/habit';

// ── Keys ─────────────────────────────────────────────────────────────────────
const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';
const HABITS_KEY = 'habit-tracker-habits';

// ── Helpers ──────────────────────────────────────────────────────────────────
function read<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function write<T>(key: string, value: T): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(value));
}

// ── Users ────────────────────────────────────────────────────────────────────
export function getUsers(): User[] {
	return read<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]): void {
	write(USERS_KEY, users);
}

// ── Session ──────────────────────────────────────────────────────────────────
export function getSession(): Session | null {
	return read<Session | null>(SESSION_KEY, null);
}

export function saveSession(session: Session | null): void {
	write(SESSION_KEY, session);
}

export function clearSession(): void {
	saveSession(null);
}

// ── Habits ───────────────────────────────────────────────────────────────────
export function getHabits(): Habit[] {
	return read<Habit[]>(HABITS_KEY, []);
}

export function saveHabits(habits: Habit[]): void {
	write(HABITS_KEY, habits);
}