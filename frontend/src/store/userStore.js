"use client";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


function getFormattedDate() {
  try {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const mi = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
  } catch {
    return new Date().toISOString()
  }
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      _hasHydrated: false,


      
      //for me 
  socket: null,
  isConnect: false,
  username: null,
  token: null,
  friends: [],
  messages: [],
  room: "",
  profile_img: "",
  double_block: 0,
  user_block: "",
  
  removeFriend: (usernameToRemove) => set((state) => ({
    friends: state.friends.filter((u) => u.username !== usernameToRemove),
  })),
  setDboubleBlock: (num) => set({ double_block: num }),
  Setuser_block: (UserBlock) => set({ user_block: UserBlock }),
  setMessages: (messagesArray) => set({ messages: messagesArray }),
  addMessage: (data) => set((state) => {
    const time = getFormattedDate()
    return {
      messages: [
        ...state.messages,
        {
          sender: data.sender,
          conv_id: data.conv_id,
          message: data.message,
          created_at: time,
          isSeen: data.isSeen,
        },
      ],
    }
  }),
  
  setRoom: (room) => set({ room }),
  
  setImg: (img) => set({ profile_img: img }),
  
  addFriend: (friend) =>
    set((state) => ({
      friends: [...state.friends, friend],
    })),
  updateLastMessage: (message, friend) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f.username === friend
          ? {
              ...f,
              LastMessage: message,
              LastMessageTime: new Date().toISOString(), 
            }
          : f
      ),
    })),
  updateFriendStatus: (status, friend) => 
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id_user == friend ? { ...f, status } : f
      ),
    })),
  
  setFriends: (friends) => set({ friends }),
  connect: () => {
    if (get().socket) return;
    if (typeof window === 'undefined') return; 

    const host = process.env.NEXT_PUBLIC_BACKENDIP || window.location.hostname || 'localhost'
    const port = process.env.NEXT_PUBLIC_BACKENDPORT || '4444'
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${protocol}://${host}:${port}/ws`

    try {
      const ws = new WebSocket(url)
      ws.onopen = () => {
        console.log('Connected', url)
        ws.send(get().user.id_user || '')
        set({ isConnect: true })
      }
      ws.onclose = () => {
        console.log('Disconnected')
        set({ isConnect: false, socket: null })
      }
      ws.onerror = (e) => {
        console.error('WebSocket error', e)
      }
      set({ socket: ws })
    } catch (e) {
      console.error('Failed to construct WebSocket', e)
    }
  },
  //end


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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('An error occurred during hydration:', error)
          } else {
            state.setHasHydrated(true)
          }
        }
      }
    }
  )
)