// Authentication service - Firebase Auth integration placeholder
// In a real implementation, this would connect to Firebase Auth

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  plan: 'free' | 'premium';
  region: 'IN' | 'INTL';
  promptsUsed: number;
  maxPrompts: number;
  projectsCount: number;
  maxProjects: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Mock authentication functions for demo
export const authService = {
  // Sign in with Google
  signInWithGoogle: async (): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      uid: 'mock-user-id',
      name: 'John Doe',
      email: 'john@example.com',
      photoURL: '',
      plan: 'free',
      region: 'IN',
      promptsUsed: 0,
      maxPrompts: 5,
      projectsCount: 0,
      maxProjects: 5
    };
    
    return mockUser;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  // Get current user
  getCurrentUser: (): User | null => {
    // In real app, this would check Firebase Auth state
    return null;
  },

  // Update user region
  updateUserRegion: async (uid: string, region: 'IN' | 'INTL'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated user region:', uid, region);
  },

  // Update user plan
  updateUserPlan: async (uid: string, plan: 'free' | 'premium'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated user plan:', uid, plan);
  },

  // Increment prompt usage
  incrementPromptUsage: async (uid: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Incremented prompt usage for user:', uid);
  }
};