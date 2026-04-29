import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";
const HABITS_KEY = "habit-tracker-habits";

function read<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

function write<T>(key: string, value: T): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(value));
}

// ── Users ─────────────────────
export const getUsers = (): User[] => read(USERS_KEY, []);
export const saveUsers = (u: User[]) => write(USERS_KEY, u);

// ── Session ────────────────────
export const getSession = (): Session | null => read(SESSION_KEY, null);
export const saveSession = (s: Session | null) => write(SESSION_KEY, s);
export const clearSession = () => saveSession(null);

// ── Habits ─────────────────────
export const getHabits = (): Habit[] => read(HABITS_KEY, []);
export const saveHabits = (h: Habit[]) => write(HABITS_KEY, h);