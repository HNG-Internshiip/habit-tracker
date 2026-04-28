/**
 * Calculates the current streak for a habit (TRD §9).
 *
 * Rules:
 *  - Deduplicate completions before processing
 *  - Sort dates ascending
 *  - If today is not completed → streak is 0
 *  - If today is completed → count consecutive calendar days backwards from today
 *
 * @param completions  Array of YYYY-MM-DD date strings
 * @param today        Override today's date (YYYY-MM-DD); defaults to local date
 */
export function calculateCurrentStreak(
	completions: string[],
	today?: string
): number {
	const todayStr = today ?? new Date().toISOString().slice(0, 10);

	// Deduplicate
	const unique = [...new Set(completions)];

	if (!unique.includes(todayStr)) return 0;

	// Sort ascending so we can walk backwards easily
	unique.sort();

	let streak = 0;
	const cursor = new Date(todayStr);

	while (true) {
		const dateStr = cursor.toISOString().slice(0, 10);
		if (!unique.includes(dateStr)) break;
		streak++;
		// Move one day back
		cursor.setUTCDate(cursor.getUTCDate() - 1);
	}

	return streak;
}