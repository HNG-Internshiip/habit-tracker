'use client';

import { useState, useEffect, useRef } from 'react';
import { validateHabitName } from '@/lib/validators';
import type { Habit } from '@/types/habit';
import { AlertCircle, X, Save, Plus, Repeat, Briefcase, Sunset, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Toast from '@/components/shared/Toast';

const FREQUENCIES: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'daily',    label: 'Daily',    Icon: Repeat      },
  { value: 'weekdays', label: 'Weekdays', Icon: Briefcase   },
  { value: 'weekends', label: 'Weekends', Icon: Sunset      },
  { value: 'weekly',   label: 'Weekly',   Icon: CalendarDays },
];

type Frequency = typeof FREQUENCIES[number]['value'];

interface Props {
  initialHabit?: Habit | null;
  onSave:   (name: string, description: string, frequency: Frequency) => void;
  onCancel: () => void;
}

/**
 * HabitForm — renders as a bottom-sheet modal (TRD §10).
 *
 * Required test ids:
 *   habit-form, habit-name-input, habit-description-input,
 *   habit-frequency-select, habit-save-button
 */
export default function HabitForm({ initialHabit, onSave, onCancel }: Props) {
  const [name,      setName]      = useState('');
  const [desc,      setDesc]      = useState('');
  const [freq,      setFreq]      = useState<Frequency>('daily');
  const [nameError, setNameError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDesc(initialHabit.description);
    }
    // Auto-focus name on open
    setTimeout(() => nameRef.current?.focus(), 80);
  }, [initialHabit]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onCancel(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) { setNameError(result.error); return; }
    setNameError(null);
    onSave(result.value, desc.trim(), freq);
  }

  const isEditing = !!initialHabit;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end animate-overlay"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit habit' : 'Create habit'}
    >
      {/* Sheet */}
      <div
        data-testid="habit-form"
        className="animate-sheet-up w-full bg-[var(--surface)] border-t border-[var(--border)] rounded-t-3xl p-6 pb-10"
        style={{ boxShadow: '0 -16px 48px rgba(0,0,0,0.3)' }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-glow)' }}>
              {isEditing
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                : <Plus size={15} style={{ color: 'var(--gold)' }} />
              }
            </div>
            <h2 className="text-lg font-extrabold text-[var(--text)] tracking-tight">
              {isEditing ? 'Edit Habit' : 'New Habit'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="habit-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-2">
              Habit name <span className="text-[var(--danger)] normal-case tracking-normal">*</span>
            </label>
            <input
              id="habit-name"
              ref={nameRef}
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(null); }}
              placeholder="e.g. Drink Water"
              className={`input-field w-full px-4 py-3 rounded-xl text-sm bg-[var(--surface-alt)] border text-[var(--text)] placeholder:text-[var(--text-muted)] ${
                nameError ? 'border-[var(--danger)]' : 'border-[var(--border)]'
              }`}
            />
            {nameError && (
              <p role="alert" className="flex items-center gap-1.5 mt-2 text-xs animate-fade-in" style={{ color: 'var(--danger)' }}>
                <AlertCircle size={12} /> {nameError}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="habit-description" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-2">
              Description <span className="normal-case font-normal text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              id="habit-description"
              data-testid="habit-description-input"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={2}
              placeholder="Why does this habit matter?"
              className="input-field w-full px-4 py-3 rounded-xl text-sm bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none"
            />
          </div>

          {/* Custom frequency selector — pill grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-2">
              Frequency
            </label>
            {/* Hidden native select for test-id requirement */}
            <select
              data-testid="habit-frequency-select"
              value={freq}
              onChange={e => setFreq(e.target.value as Frequency)}
              className="sr-only"
              aria-label="Frequency"
            >
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {/* Visual pill grid */}
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Select frequency">
              {FREQUENCIES.map(f => {
                const active = freq === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      if (f.value !== 'daily') {
                        setShowToast(true);
                        return;
                      }
                      setFreq(f.value);
                    }}
                    className="freq-pill flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    style={{
                      background: active ? 'rgba(201,168,76,0.12)' : 'var(--surface-alt)',
                      border: active ? '2px solid var(--gold)' : '1px solid var(--border)',
                      color: active ? 'var(--gold)' : 'var(--text-sub)',
                      transform: active ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <f.Icon
                      size={14}
                      style={{ color: active ? 'var(--gold)' : 'var(--text-muted)' }}
                    />
                    <span>{f.label}</span>
                    {active && (
                      <span className="ml-auto animate-check">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              data-testid="habit-save-button"
              type="submit"
              className="btn-gold flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm"
            >
              <Save size={15} />
              {isEditing ? 'Save changes' : 'Create habit'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center gap-1.5 px-5 border border-[var(--border)] text-[var(--text-sub)] font-semibold py-3 rounded-xl hover:bg-[var(--surface-alt)] transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            >
              <X size={15} />
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <Toast
          message="Only Daily frequency is supported for now."
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  );
}