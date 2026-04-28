'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import Link from 'next/link';

/**
 * SignupForm — TRD §10
 *
 * Required test ids:
 *   auth-signup-email
 *   auth-signup-password
 *   auth-signup-submit
 */
export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = signUp(email, password);

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.replace('/dashboard');
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create account</h2>

      {error && (
        <div role="alert" className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <button
          data-testid="auth-signup-submit"
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}