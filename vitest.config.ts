// ── vitest.config.ts ─────────────────────────────────────────────────────────
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/lib/**'],
			thresholds: {
				lines: 80,
			},
			reporter: ['text', 'lcov', 'html'],
		},
		// Separate unit from integration via include patterns
		// npm run test:unit  → tests/unit/**
		// npm run test:integration → tests/integration/**
		include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.tsx'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
