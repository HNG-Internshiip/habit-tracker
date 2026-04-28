import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

// ── Components under test ────────────────────────────────────────────────────
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';

// ── Storage helpers ──────────────────────────────────────────────────────────
import { getSession, getUsers } from '@/lib/storage';

// ── Reset localStorage before each test ─────────────────────────────────────
beforeEach(() => {
  localStorage.clear();
  mockReplace.mockClear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'alice@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    // Session must be created in localStorage
    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('alice@example.com');
    });

    // User must be stored
    const users = getUsers();
    expect(users.some((u) => u.email === 'alice@example.com')).toBe(true);

    // Must redirect to /dashboard
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();

    // First signup
    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'bob@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    // Reset and render fresh form for duplicate signup attempt
    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([
        {
          id: 'u1',
          email: 'bob@example.com',
          password: 'password123',
          createdAt: new Date().toISOString(),
        },
      ])
    );
    mockReplace.mockClear();
    const { unmount } = render(<SignupForm />);

    await user.type(screen.getAllByTestId('auth-signup-email')[1], 'bob@example.com');
    await user.type(screen.getAllByTestId('auth-signup-password')[1], 'different');
    await user.click(screen.getAllByTestId('auth-signup-submit')[1]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    });

    expect(mockReplace).not.toHaveBeenCalledWith('/dashboard');
    unmount();
  });

  it('submits the login form and stores the active session', async () => {
    // Pre-seed a user
    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([
        {
          id: 'u-login-1',
          email: 'carol@example.com',
          password: 'secret',
          createdAt: new Date().toISOString(),
        },
      ])
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'carol@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'secret');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('carol@example.com');
      expect(session?.userId).toBe('u-login-1');
    });

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'ghost@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpass');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid email or password'
      );
    });

    expect(getSession()).toBeNull();
    expect(mockReplace).not.toHaveBeenCalledWith('/dashboard');
  });
});