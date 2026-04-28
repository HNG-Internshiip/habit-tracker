// ── src/lib/theme.ts ─────────────────────────────────────────────────────────
const THEME_KEY = 'habit-tracker-theme';

export function getSavedTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'dark';
}

export function saveTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}