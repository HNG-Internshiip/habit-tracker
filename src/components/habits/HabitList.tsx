import type { Habit } from '@/types/habit';
import HabitCard from './HabitCard';
import { Sprout } from 'lucide-react';

interface Props {
  habits:   Habit[];
  today:    string;
  onEdit:   (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2 px-1">
      {label}
    </p>
  );
}

export default function HabitList({ habits, today, onEdit, onDelete, onToggle }: Props) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-20 animate-fade-in"
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: 'var(--surface-alt)' }}
        >
          <Sprout size={36} className="text-[var(--text-muted)]" strokeWidth={1.5} />
        </div>
        <p className="font-bold text-base text-[var(--text)]">No habits yet</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Tap <span style={{ color: 'var(--gold)' }}>+</span> to create your first habit.
        </p>
      </div>
    );
  }

  const pending   = habits.filter(h => !h.completions.includes(today));
  const completed = habits.filter(h =>  h.completions.includes(today));

  return (
    <section aria-label="Your habits">
      {pending.length > 0 && (
        <div className="mb-1">
          {completed.length > 0 && (
            <SectionLabel label={`To do · ${pending.length}`} />
          )}
          {pending.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              today={today}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className={pending.length ? 'mt-5' : ''}>
          <SectionLabel label={`Completed · ${completed.length}`} />
          {completed.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              today={today}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}