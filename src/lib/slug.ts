/**
 * Converts a habit name into a stable URL-safe slug.
 *
 * Rules (per TRD §9):
 *  1. Trim leading/trailing spaces
 *  2. Lowercase
 *  3. Collapse one-or-more spaces to a single hyphen
 *  4. Remove any character that is not alphanumeric or a hyphen
 */
export function getHabitSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')   // collapse consecutive hyphens left by removed chars
    .replace(/^-+|-+$/g, ''); // strip any leading/trailing hyphens
}