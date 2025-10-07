
// import { create } from 'zustand'

// export const useUserStore = create((set) => ({
//   // Initial state
//   user: null,

//   // Actions (functions to change state)
//   setUser: (userObj) => set({ user: userObj }),

//   // Function to clear user data
//   clearUser: () => set({ user: null }),
// }))



import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (userObj) => set({ user: userObj }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // localStorage key
      getStorage: () => localStorage,
    }
  )
)
