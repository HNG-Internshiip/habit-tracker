'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logOut } from '@/lib/auth';
import { useHabits } from '@/hooks/useHabits';
import HabitList from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLogo from '@/components/shared/AppLogo';
import { useTheme } from '@/components/shared/ThemeProvider';
import type { Session } from '@/types/auth';
import { LogOut, Plus, Sun, Moon } from 'lucide-react';

// ── Inner dashboard content (receives verified session) ──────────────────────
function DashboardContent({ session }: { session: Session }) {
	const router = useRouter();
	const { theme, toggle } = useTheme();

	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const { habits, addHabit, updateHabit, deleteHabit, toggleCompletion } =
		useHabits(session.userId);

	const today = new Date().toISOString().slice(0, 10);
	const doneCount = habits.filter(h => h.completions.includes(today)).length;
	const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;

	function handleLogout() {
		logOut();
		router.replace('/login');
	}

	function handleSave(name: string, description: string, frequency: string) {
		if (editingId) {
			updateHabit(editingId, name, description);
			setEditingId(null);
		} else {
			addHabit(name, description, frequency as "daily" | "weekly" | "weekdays" | "weekends");
		}
		setShowForm(false);
	}

	function handleEdit(id: string) {
		setEditingId(id);
		setShowForm(true);
	}

	function handleCancel() {
		setEditingId(null);
		setShowForm(false);
	}

	const editingHabit = habits.find(h => h.id === editingId) ?? null;

	// Today's date display
	const dateLabel = new Date().toLocaleDateString('en-US', {
		weekday: 'long', month: 'long', day: 'numeric',
	});

	return (
		<div data-testid="dashboard-page" className="min-h-screen flex flex-col bg-[var(--bg)] transition-colors">

			{/* ── Header ──────────────────────────────────────────────────────── */}
			<header
				className="sticky top-0 z-30 border-b border-[var(--border)] animate-fade-in"
				style={{ background: 'var(--surface)', backdropFilter: 'blur(12px)' }}
			>
				<div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
					<AppLogo size={32} />
					<div className="flex-1">
						<p className="text-sm font-extrabold text-[var(--text)] leading-none tracking-tight">
							Habit Tracker
						</p>
						<p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-none">
							{dateLabel}
						</p>
					</div>

					{/* Theme toggle */}
					<button
						onClick={toggle}
						aria-label="Toggle theme"
						className="theme-toggle w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-sub)] hover:text-[var(--gold)] bg-[var(--surface-alt)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
					>
						{theme === 'dark'
							? <Sun size={16} />
							: <Moon size={16} />
						}
					</button>

					{/* Logout */}
					<button
						data-testid="auth-logout-button"
						onClick={handleLogout}
						className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--danger)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
					>
						<LogOut size={13} />
						<span className="hidden sm:inline">Log out</span>
					</button>
				</div>

				{/* Progress bar — only when habits exist */}
				{habits.length > 0 && (
					<div className="max-w-2xl mx-auto px-4 pb-3">
						<div className="flex justify-between items-center mb-1.5">
							<span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
								Today&apos;s progress
							</span>
							<span className="text-[10px] font-extrabold" style={{ color: 'var(--gold)' }}>
								{doneCount} / {habits.length} &nbsp;·&nbsp; {pct}%
							</span>
						</div>
						<div className="h-1.5 w-full rounded-full overflow-hidden bg-[var(--surface-alt)]">
							<div
								className="progress-bar h-full rounded-full"
								style={{ width: `${pct}%` }}
								role="progressbar"
								aria-valuenow={pct}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					</div>
				)}
			</header>

			{/* ── Main ────────────────────────────────────────────────────────── */}
			<main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5">
				<HabitList
					habits={habits}
					today={today}
					onEdit={handleEdit}
					onDelete={deleteHabit}
					onToggle={id => toggleCompletion(id, today)}
				/>
			</main>

			{/* ── FAB ─────────────────────────────────────────────────────────── */}
			<button
				data-testid="create-habit-button"
				onClick={() => { setEditingId(null); setShowForm(true); }}
				aria-label="Create new habit"
				className="fab fixed bottom-6 right-5 w-14 h-14 rounded-full flex items-center justify-center text-[#1A1814] shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
				style={{
					background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))',
					boxShadow: '0 6px 24px var(--gold-glow)',
				}}
			>
				<Plus size={24} strokeWidth={2.5} />
			</button>

			{/* ── Modal ───────────────────────────────────────────────────────── */}
			{showForm && (
				<HabitForm
					initialHabit={editingHabit}
					onSave={handleSave}
					onCancel={handleCancel}
				/>
			)}
		</div>
	);
}

// ── Page export ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
	return (
		<ProtectedRoute>
			{session => <DashboardContent session={session} />}
		</ProtectedRoute>
	);
}