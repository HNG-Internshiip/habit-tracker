'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logIn } from '@/lib/auth';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import AppLogo from '@/components/shared/AppLogo';
import HomeButton from "@/components/shared/HomeButton";

export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const result = logIn(email, password);
		if (!result.ok) {
			setError(result.error ?? "Invalid email or password");
			setLoading(false);
			return;
		}
		router.replace('/dashboard');
	}

	return (
		<div className="min-h-screen flex flex-col pb-28">
			<div className="animate-fade-up flex flex-col items-center pt-42 mb-8">
				<AppLogo size={56} className="mb-4" />
				<h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
					Welcome back
				</h1>
				<p className="text-sm text-[var(--text-muted)] mt-1">
					Log in to your account
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
					{/* Email */}
					<div>
						<label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-1.5">
							Email address
						</label>
						<div className="relative">
							<Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
							<input
								id="login-email"
								data-testid="auth-login-email"
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

					{/* Password */}
					<div>
						<label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-1.5">
							Password
						</label>
						<div className="relative">
							<Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
							<input
								id="login-password"
								data-testid="auth-login-password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="••••••••"
								className="input-field w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
							/>
						</div>
					</div>

					<button
						data-testid="auth-login-submit"
						type="submit"
						disabled={loading}
						className="btn-gold w-full py-3 rounded-xl text-sm mt-2 disabled:opacity-50"
					>
						{loading
							? <span className="flex items-center justify-center gap-2">
								<span className="w-4 h-4 border-2 border-[#1A1814]/30 border-t-[#1A1814] rounded-full animate-spin" />
								Logging in…
							</span>
							: 'Log in'
						}
					</button>
				</form>

				<p className="mt-5 text-center text-sm text-[var(--text-muted)]">
					Don&apos;t have an account?{' '}
					<Link href="/signup" className="font-bold hover:underline" style={{ color: 'var(--gold)' }}>
						Sign up
					</Link>
				</p>
			</div>

			<HomeButton />
		</div>
	);
}