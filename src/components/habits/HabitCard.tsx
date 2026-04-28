'use client';

import { useState, useRef } from 'react';
import type { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { Pencil, Trash2, AlertTriangle, Flame, Repeat, Briefcase, Sunset, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const FREQ_MAP: Record<string, { label: string; Icon: LucideIcon }> = {
  daily:    { label: 'Daily',    Icon: Repeat       },
  weekdays: { label: 'Weekdays', Icon: Briefcase    },
  weekends: { label: 'Weekends', Icon: Sunset       },
  weekly:   { label: 'Weekly',   Icon: CalendarDays },
};

interface Props {
  habit:    Habit;
  today:    string;
  onEdit:   (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function HabitCard({ habit, today, onEdit, onDelete, onToggle }: Props) {
  const [confirming,  setConfirming]  = useState(false);
  const [streakAnim,  setStreakAnim]  = useState(false);
  const [checkAnim,   setCheckAnim]   = useState(false);
  const prevStreak = useRef(calculateCurrentStreak(habit.completions, today));

  const slug      = getHabitSlug(habit.name);
  const completed = habit.completions.includes(today);
  const streak    = calculateCurrentStreak(habit.completions, today);

  function handleToggle() {
    onToggle(habit.id);
    setCheckAnim(true);
    setTimeout(() => setCheckAnim(false), 400);
    // Only animate streak when completing (not uncompleting)
    if (!completed && streak + 1 > prevStreak.current) {
      setStreakAnim(true);
      setTimeout(() => setStreakAnim(false), 450);
    }
    prevStreak.current = streak;
  }

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className="habit-card animate-fade-up rounded-2xl border p-4 mb-3"
      style={{
        background: completed
          ? 'color-mix(in srgb, var(--gold) 6%, var(--surface))'
          : 'var(--surface)',
        borderColor: completed ? 'color-mix(in srgb, var(--gold) 30%, var(--border))' : 'var(--border)',
      }}
    >
      {/* ── Top row ───────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">

        {/* Circle toggle */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-pressed={completed}
          aria-label={completed ? `Unmark ${habit.name}` : `Mark ${habit.name} as done`}
          className="shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] rounded-full transition-transform active:scale-90"
        >
          {completed ? (
            <svg
              width="24" height="24" viewBox="0 0 24 24"
              className={checkAnim ? 'animate-check' : ''}
            >
              <circle cx="12" cy="12" r="11" fill="var(--gold)" />
              <path d="M7.5 12.5l3 3 6-6"
                stroke="#1A1814" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11"
                stroke="var(--border)" strokeWidth="1.8"
                className="transition-colors group-hover:stroke-[var(--gold)]" />
            </svg>
          )}
        </button>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm leading-snug truncate transition-colors ${
            completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text)]'
          }`}>
            {habit.name}
          </p>
          {habit.description && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {habit.description}
            </p>
          )}
        </div>

        {/* Frequency badge */}
        {(() => {
          const f = FREQ_MAP[habit.frequency] ?? FREQ_MAP.daily;
          return (
            <div
              className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold"
              style={{
                background: 'rgba(201,168,76,0.12)',
                color: 'var(--gold)',
                border: '1px solid rgba(201,168,76,0.25)',
              }}
            >
              <f.Icon size={10} />
              {f.label}
            </div>
          );
        })()}

        {/* Streak badge */}
        <div
          data-testid={`habit-streak-${slug}`}
          aria-label={`Streak: ${streak} day${streak !== 1 ? 's' : ''}`}
          className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-xs font-extrabold transition-colors ${
            streakAnim ? 'animate-streak' : ''
          }`}
          style={{
            background: streak > 0 ? 'rgba(255,107,43,0.12)' : 'var(--surface-alt)',
            color:      streak > 0 ? '#FF6B2B' : 'var(--text-muted)',
          }}
        >
          <Flame
            size={11}
            fill={streak > 0 ? '#FF6B2B' : 'none'}
            stroke={streak > 0 ? '#FF6B2B' : 'var(--text-muted)'}
          />
          {streak}
        </div>
      </div>

      {/* ── Delete confirmation ───────────────────────────────────────────── */}
      {confirming ? (
        <div
          className="mt-4 rounded-xl p-3 animate-fade-in"
          style={{ background: 'var(--danger-bg)', border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: 'var(--danger)' }} className="shrink-0" />
            <p className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>
              Delete &ldquo;{habit.name}&rdquo;?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => { setConfirming(false); onDelete(habit.id); }}
              className="flex-1 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--danger)]"
              style={{ background: 'var(--danger)' }}
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              style={{
                border: '1px solid color-mix(in srgb, var(--danger) 35%, transparent)',
                color: 'var(--danger)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── Action row ─────────────────────────────────────────────────── */
        <div
          className="flex items-center justify-end gap-1.5 mt-3 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit.id)}
            aria-label={`Edit ${habit.name}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2"
            style={{
              background: 'var(--edit-bg)',
              color: 'var(--edit-color)',
            }}
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${habit.name}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2"
            style={{
              background: 'var(--del-bg)',
              color: 'var(--del-color)',
            }}
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </article>
  );
}