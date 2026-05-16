import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isWeb } from '@/constants/platform';

type AuthStore = {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;

  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      logIn: () => {
        set((state) => {
          return {
            ...state,
            isLoggedIn: true,
          };
        });
      },
      logOut: () => {
        set((state) => {
          return {
            ...state,
            isLoggedIn: false,
          };
        });
      },

      _hasHydrated: false,
      setHasHydrated: (hasHydrated: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: hasHydrated,
        }));
      },
    }),
    {
      name: 'auth-store',
      storage: isWeb
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => ({
            setItem: (key: string, value: string) =>
              SecureStore.setItemAsync(key, value),
            getItem: (key: string) => SecureStore.getItemAsync(key),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          })),
      onRehydrateStorage: () => {
        return (state) => state?.setHasHydrated(true);
      },
    },
  ),
);
