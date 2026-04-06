import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthPage } from './AuthPage';

let currentAuthState: any;

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => currentAuthState,
}));

vi.mock('./RegistrationChatbot', () => ({
  RegistrationChatbot: () => null,
}));

vi.mock('./SignupForm', () => ({
  SignupForm: () => null,
}));

const renderAuthPage = () =>
  render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>
  );

const createAuthState = (overrides: Partial<Record<string, unknown>> = {}) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  userRole: 'user',
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  hasRole: vi.fn(() => false),
  isAdmin: vi.fn(() => false),
  canManageUsers: vi.fn(() => false),
  clearError: vi.fn(),
  sessionManager: null,
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
  sendSignupOtp: vi.fn(),
  ...overrides,
});

describe('AuthPage OTP flow', () => {
  beforeEach(() => {
    currentAuthState = createAuthState();
  });

  it('keeps the auth form mounted during OTP send and advances to code entry', async () => {
    const user = userEvent.setup();
    let resolveSendOtp: ((value: { success: boolean }) => void) | undefined;

    const sendOtp = vi.fn(
      () =>
        new Promise<{ success: boolean }>((resolve) => {
          resolveSendOtp = resolve;
        })
    );

    currentAuthState = createAuthState({ sendOtp });

    const view = renderAuthPage();

    await user.type(screen.getByLabelText(/email address/i), 'admin@vieclinic.com');
    await user.click(screen.getByRole('button', { name: /send sign-in code/i }));

    await waitFor(() => expect(sendOtp).toHaveBeenCalledWith('admin@vieclinic.com'));

    currentAuthState = { ...currentAuthState, loading: true };
    view.rerender(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    await act(async () => {
      resolveSendOtp?.({ success: true });
    });

    currentAuthState = { ...currentAuthState, loading: false };
    view.rerender(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Enter Code')).toBeInTheDocument();
    });

    expect(screen.getByText(/we sent a 6-digit code to admin@vieclinic.com/i)).toBeInTheDocument();
  });
});