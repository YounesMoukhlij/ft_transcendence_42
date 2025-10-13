import { create } from 'zustand'
import { persist } from 'zustand/middleware' 

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      _hasHydrated: false, // 👈 New state flag

      // Actions
      setUser: (userObj) => set({ user: userObj }),
      getUser: () => get().user,
      clearUser: () => set({ user: null }),
      
      // 👈 Action to set the flag
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ user: state.user }),
      
      // 👈 Lifecycle hook for hydration completion
      onRehydrateStorage: (state) => {
        console.log('hydration started');
        return (state, error) => {
          if (error) {
            console.error('An error occurred during hydration:', error);
          } else {
            console.log('hydration finished');
            state.setHasHydrated(true); // Set the flag when done
          }
        }
      }
    }
  )
)