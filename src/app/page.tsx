'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logOut } from '@/lib/auth';
import { useHabits } from '@/hooks/useHabits';
import HabitList from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import type { Session } from '@/types/auth';
import { LogOut, Plus, CheckSquare } from 'lucide-react';

function DashboardContent({ session }: { session: Session }) {
	const router = useRouter();
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const { habits, addHabit, updateHabit, deleteHabit, toggleCompletion } =
		useHabits(session.userId);

	const today = new Date().toISOString().slice(0, 10);
	const doneCount = habits.filter(h => h.completions.includes(today)).length;

	function handleLogout() {
		logOut();
		router.replace('/login');
	}

	function handleSave(name: string, description: string) {
		if (editingId) {
			updateHabit(editingId, name, description);
			setEditingId(null);
		} else {
			addHabit(name, description);
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

	return (
		<div data-testid="dashboard-page" className="min-h-screen bg-slate-50">
			{/* Header */}
			<header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg">
				<div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<CheckSquare size={22} className="text-indigo-200" />
						<span className="text-lg font-bold tracking-tight">Habit Tracker</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-xs text-indigo-200 hidden sm:block truncate max-w-[140px]">
							{session.email}
						</span>
						<button
							data-testid="auth-logout-button"
							onClick={handleLogout}
							className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
						>
							<LogOut size={14} />
							Log out
						</button>
					</div>
				</div>
			</header>

			{/* Progress bar */}
			{habits.length > 0 && (
				<div className="bg-white border-b border-slate-200">
					<div className="max-w-2xl mx-auto px-4 py-3">
						<div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
							<span>Today&apos;s progress</span>
							<span className="font-semibold text-indigo-600">{doneCount} / {habits.length}</span>
						</div>
						<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
								style={{ width: `${habits.length ? (doneCount / habits.length) * 100 : 0}%` }}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Main */}
			<main className="max-w-2xl mx-auto px-4 py-6">
				{!showForm && (
					<button
						data-testid="create-habit-button"
						onClick={() => setShowForm(true)}
						className="w-full mb-5 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
					>
						<Plus size={18} />
						New Habit
					</button>
				)}

				{showForm && (
					<HabitForm
						initialHabit={editingHabit}
						onSave={handleSave}
						onCancel={handleCancel}
					/>
				)}

				<HabitList
					habits={habits}
					today={today}
					onEdit={handleEdit}
					onDelete={deleteHabit}
					onToggle={id => toggleCompletion(id, today)}
				/>
			</main>
		</div>
	);
}

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			{session => <DashboardContent session={session} />}
		</ProtectedRoute>
	);
}