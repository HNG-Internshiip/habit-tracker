import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
  const today = '2024-06-15';
  const yesterday = '2024-06-14';
  const twoDaysAgo = '2024-06-13';
  const threeDaysAgo = '2024-06-12';

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    // Only yesterday — today is missing
    expect(calculateCurrentStreak([yesterday], today)).toBe(0);
    // Multiple past days but not today
    expect(calculateCurrentStreak([yesterday, twoDaysAgo], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    // Just today → 1
    expect(calculateCurrentStreak([today], today)).toBe(1);
    // Today and yesterday → 2
    expect(calculateCurrentStreak([today, yesterday], today)).toBe(2);
    // Three consecutive days → 3
    expect(calculateCurrentStreak([today, yesterday, twoDaysAgo], today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    // Duplicates of today should still yield streak of 1
    expect(calculateCurrentStreak([today, today, today], today)).toBe(1);
    // Duplicates across a range
    expect(
      calculateCurrentStreak([today, today, yesterday, yesterday], today)
    ).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    // today + twoDaysAgo but NOT yesterday → streak = 1 (gap breaks it)
    expect(calculateCurrentStreak([today, twoDaysAgo], today)).toBe(1);
    // today + yesterday + threeDaysAgo but NOT twoDaysAgo → streak = 2
    expect(
      calculateCurrentStreak([today, yesterday, threeDaysAgo], today)
    ).toBe(2);
  });
});