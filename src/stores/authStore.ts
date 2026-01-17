import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: (phone) =>
        set({
          isLoggedIn: true,
          user: {
            id: `user_${Date.now()}`,
            phone,
            name: '',
          },
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
        }),

      updateProfile: (name) =>
        set((state) => ({
          user: state.user ? { ...state.user, name } : null,
        })),
    }),
    {
      name: 'zipto-auth',
    }
  )
);
