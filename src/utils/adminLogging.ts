import { useAuthContext } from '@/components/auth/AuthProvider';

// Get current user role without hooks (for use in stores/services)
let currentUserRole: string | null = null;

// Update role when auth changes
export const updateUserRole = (role: string | null) => {
  currentUserRole = role;
};

// Check if current user should see technical logs
export const shouldShowTechnicalLogs = (): boolean => {
  return currentUserRole === 'admin' || currentUserRole === 'super_admin' || currentUserRole === 'moderator';
};

// Admin-only console logging
export const adminLog = (message: string, ...args: any[]) => {
  if (shouldShowTechnicalLogs()) {
    console.log(message, ...args);
  }
};

export const adminWarn = (message: string, ...args: any[]) => {
  if (shouldShowTechnicalLogs()) {
    console.warn(message, ...args);
  }
};

export const adminError = (message: string, ...args: any[]) => {
  if (shouldShowTechnicalLogs()) {
    console.error(message, ...args);
  }
};

// User-friendly messages for regular users
export const userLog = (message: string, ...args: any[]) => {
  if (!shouldShowTechnicalLogs()) {
    console.log(message, ...args);
  }
};