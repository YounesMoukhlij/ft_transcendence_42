import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      refreshToken: null, //
      _hasHydrated: false,

      // Actions
      setUser: (userObj, refreshToken) => set({ user: userObj, refreshToken: refreshToken }), // 
      getUser: () => get().user,
      clearUser: () => set({ user: null, refreshToken: null }), //
      getRefreshToken: () => get().refreshToken, // 

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ user: state.user, refreshToken: state.refreshToken }), //

      onRehydrateStorage: (state) => {
        console.log('hydration started');
        return (state, error) => {
          if (error) {
            console.error('An error occurred during hydration:', error);
          } else {
            console.log('hydration finished');
            state.setHasHydrated(true);
          }
        }
      }
    }
  )
)