'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import AppLogo from '@/components/shared/AppLogo';

export default function SignupForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const result = signUp(email, password);
		if (!result.ok) {
  setError(result.error ?? "Invalid email or password");
  setLoading(false);
  return;
}
		router.replace('/dashboard');
	}

	return (
		<div className="animate-fade-up w-full">
			{/* Centered logo + title */}
			<div className="flex flex-col items-center mb-8">
				<AppLogo size={56} className="mb-4" />
				<h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
					Get started
				</h1>
				<p className="text-sm text-[var(--text-muted)] mt-1">
					Create your free account
				</p>
			</div>

			{/* Card */}
			<div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-lg">
				{error && (
					<div
						role="alert"
						className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl text-sm animate-fade-in"
						style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)' }}
					>
						<AlertCircle size={15} className="shrink-0" />
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} noValidate className="space-y-4">
					<div>
						<label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-1.5">
							Email address
						</label>
						<div className="relative">
							<Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
							<input
								id="signup-email"
								data-testid="auth-signup-email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="input-field w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-1.5">
							Password
						</label>
						<div className="relative">
							<Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
							<input
								id="signup-password"
								data-testid="auth-signup-password"
								type="password"
								autoComplete="new-password"
								required
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="••••••••"
								className="input-field w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
							/>
						</div>
					</div>

					<button
						data-testid="auth-signup-submit"
						type="submit"
						disabled={loading}
						className="btn-gold w-full py-3 rounded-xl text-sm mt-2 disabled:opacity-50"
					>
						{loading
							? <span className="flex items-center justify-center gap-2">
								<span className="w-4 h-4 border-2 border-[#1A1814]/30 border-t-[#1A1814] rounded-full animate-spin" />
								Creating account…
							</span>
							: 'Sign up'
						}
					</button>
				</form>

				<p className="mt-5 text-center text-sm text-[var(--text-muted)]">
					Already have an account?{' '}
					<Link href="/login" className="font-bold hover:underline" style={{ color: 'var(--gold)' }}>
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}