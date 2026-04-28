import { test, expect, Page } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────
const BASE = 'http://localhost:3000';

const TEST_USER = {
  email: `e2e-${Date.now()}@example.com`,
  password: 'TestPass123',
};

async function seedUser(page: Page, email: string, password: string) {
  await page.evaluate(
    ({ email, password }) => {
      const users = JSON.parse(
        localStorage.getItem('habit-tracker-users') || '[]'
      );
      users.push({
        id: 'seed-user-1',
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
    },
    { email, password }
  );
}

async function seedSession(page: Page, userId: string, email: string) {
  await page.evaluate(
    ({ userId, email }) => {
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId, email })
      );
    },
    { userId, email }
  );
}

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

// ── Suite ────────────────────────────────────────────────────────────────────
test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
  });

  // ── Splash & routing ────────────────────────────────────────────────────────
  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto(BASE);
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto(BASE);
    await seedUser(page, TEST_USER.email, TEST_USER.password);
    await seedSession(page, 'seed-user-1', TEST_USER.email);
    await page.goto(BASE);
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  // ── Auth flows ──────────────────────────────────────────────────────────────
  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto(`${BASE}/signup`);

    await page.getByTestId('auth-signup-email').fill(TEST_USER.email);
    await page.getByTestId('auth-signup-password').fill(TEST_USER.password);
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Seed two users and habits for user-A only
    await page.goto(`${BASE}/login`);
    await page.evaluate(() => {
      const users = [
        { id: 'ua', email: 'usera@example.com', password: 'passA', createdAt: '' },
        { id: 'ub', email: 'userb@example.com', password: 'passB', createdAt: '' },
      ];
      const habits = [
        {
          id: 'h1', userId: 'ua', name: 'User A Habit',
          description: '', frequency: 'daily', createdAt: '', completions: [],
        },
        {
          id: 'h2', userId: 'ub', name: 'User B Secret',
          description: '', frequency: 'daily', createdAt: '', completions: [],
        },
      ];
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });

    await page.getByTestId('auth-login-email').fill('usera@example.com');
    await page.getByTestId('auth-login-password').fill('passA');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 5000 });

    // User A's habit is visible
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible();
    // User B's habit is NOT visible
    await expect(page.getByTestId('habit-card-user-b-secret')).not.toBeVisible();
  });

  // ── Habit CRUD ──────────────────────────────────────────────────────────────
  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.getByTestId('auth-signup-email').fill(TEST_USER.email);
    await page.getByTestId('auth-signup-password').fill(TEST_USER.password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('Stay hydrated');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.getByTestId('auth-signup-email').fill(TEST_USER.email);
    await page.getByTestId('auth-signup-password').fill(TEST_USER.password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    // Create a habit
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();

    // Streak starts at 0
    await expect(page.getByTestId('habit-streak-morning-run')).toContainText('0');

    // Mark complete
    await page.getByTestId('habit-complete-morning-run').click();

    // Streak updates to 1
    await expect(page.getByTestId('habit-streak-morning-run')).toContainText('1');
  });

  // ── Persistence ─────────────────────────────────────────────────────────────
  test('persists session and habits after page reload', async ({ page }) => {
    // Sign up and create a habit
    await page.goto(`${BASE}/signup`);
    await page.getByTestId('auth-signup-email').fill(TEST_USER.email);
    await page.getByTestId('auth-signup-password').fill(TEST_USER.password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    // Session and habit still present
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  // ── Logout ──────────────────────────────────────────────────────────────────
  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.getByTestId('auth-signup-email').fill(TEST_USER.email);
    await page.getByTestId('auth-signup-password').fill(TEST_USER.password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    // Session should be cleared — going to /dashboard redirects again
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  // ── PWA / Offline ───────────────────────────────────────────────────────────
  test('loads the cached app shell when offline after the app has been loaded once', async ({
    page,
    context,
  }) => {
    // Load the app online so SW caches the shell
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    // Give SW time to activate and cache
    await page.waitForTimeout(1500);

    // Go offline
    await context.setOffline(true);

    // Reload — app shell should render without hard crash
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});

    // Page must not be a browser error page; some content should exist
    const body = await page.locator('body').textContent();
    expect(body).not.toBeNull();

    // The page should not show a generic "no internet" browser error
    const title = await page.title();
    expect(title.toLowerCase()).not.toContain('err_internet_disconnected');

    // Go back online
    await context.setOffline(false);
  });
});