// Real authentication service using Firebase Auth
import { useAuth } from '@/hooks/useAuth';

// Re-export types for backward compatibility
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  plan: 'free' | 'premium';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Legacy auth service for compatibility - now uses the useAuth hook
export const authService = {
  signInWithGoogle: async (): Promise<User> => {
    throw new Error('Use useAuth hook instead of authService.signInWithGoogle');
  },
  
  signOut: async (): Promise<void> => {
    throw new Error('Use useAuth hook instead of authService.signOut');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    throw new Error('Use useAuth hook instead of authService.getCurrentUser');
  }
};