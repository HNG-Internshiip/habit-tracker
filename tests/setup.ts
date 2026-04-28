// tests/setup.ts
// Create this file at: tests/setup.ts  (NOT src/tests/setup.ts)

import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// ── localStorage mock ─────────────────────────────────────────────────────────
// jsdom provides localStorage, but we reset it between tests to keep
// each test hermetic.
beforeEach(() => {
	localStorage.clear();
});

afterEach(() => {
	localStorage.clear();
	vi.restoreAllMocks();
});

// ── crypto.randomUUID ─────────────────────────────────────────────────────────
// jsdom does not always expose crypto.randomUUID; polyfill if missing.
if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.randomUUID) {
	let counter = 0;
	Object.defineProperty(globalThis, 'crypto', {
		value: {
			randomUUID: () => `test-uuid-${++counter}`,
		},
		writable: true,
	});
}

// ── Next.js router (global fallback) ─────────────────────────────────────────
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		replace: vi.fn(),
		push: vi.fn(),
		back: vi.fn(),
	}),
	usePathname: () => '/',
	useSearchParams: () => new URLSearchParams(),
}));