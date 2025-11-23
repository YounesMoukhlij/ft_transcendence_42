"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

      // Connection
      socket: null,
      isConnect: false,

      // Profile
      username: null,
      token: null,
      profile_img: "",
      friends: [],
      room: "",

      // Blocking
      double_block: 0,
      user_block: "",

      // Messages
      messages: [],

      // Friend requests
      pendingRequests: [],
      sentRequests: [],

      // ----------------------
      //   SOCKET CONNECTION
      // ----------------------

      connect: () => {
        if (get().socket) return;
        if (typeof window === "undefined") return;

        const protocol =
          window.location.protocol === "https:" ? "wss" : "ws";
        const url = `${protocol}://localhost:4444/ws`;

        try {
          const ws = new WebSocket(url);

          ws.onopen = () => {
            const id = get().user?.id_user;

            if (!id) {
              console.error("User ID missing, cannot register socket");
              return;
            }

            ws.send(String(id));
            set({ isConnect: true });
            console.log("Connected WS", url);
          };

          ws.onclose = () => {
            console.log("Disconnected WS");
            set({ isConnect: false, socket: null });
          };

          ws.onerror = (err) => console.error("WebSocket error", err);

          set({ socket: ws });
        } catch (err) {
          console.error("Failed to create WebSocket:", err);
        }
      },

      // Auto-connect after hydration
      initConnection: () => {
        const id = get().user?.id_user;
        if (id) get().connect();
      },

      // ----------------------
      //   FRIENDS
      // ----------------------

      setFriends: (friends) => set({ friends }),

      addFriend: (friend) =>
        set((state) => ({
          friends: [...state.friends, friend],
        })),

      removeFriend: (id_user) =>
        set((state) => ({
          friends: state.friends.filter(
            (u) => u.id_user !== id_user
          ),
        })),

      updateFriendStatus: (status, friendId) =>
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id_user === friendId ? { ...f, status } : f
          ),
        })),

      // ----------------------
      //   FRIEND REQUESTS
      // ----------------------

      addPendingRequests: (friend) =>
        set((state) => ({
          pendingRequests: [...state.pendingRequests, friend],
        })),


  addPendingRequestsArray: (friendsArray) =>
  set(() => ({
    pendingRequests: [...friendsArray], // creates a new array, no accumulation
  })),

      removePendingRequests: (id) =>
        set((state) => ({
          pendingRequests: state.pendingRequests.filter(
            (u) => u.sender_user !== id
          ),
        })),

      addSentRequests: (friend) =>
        set((state) => ({
          sentRequests: [...state.sentRequests, friend],
        })),

  addSentRequestsArray: (friendsArray) =>
  set(() => ({
    sentRequests: [...friendsArray], // creates a new array, no accumulation
  })),

      removeSentRequests: (id) =>
        set((state) => ({
          sentRequests: state.sentRequests.filter(
            (u) => u.getter_user !== id
          ),
        })),

      // ----------------------
      //   MESSAGES
      // ----------------------

      setMessages: (messagesArray) => set({ messages: messagesArray }),

      addMessage: (data) =>
        set((state) => {
          const time = getFormattedDate();
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
          };
        }),

      updateLastMessage: (message, friendUsername) =>
        set((state) => ({
          friends: state.friends.map((f) =>
            f.username === friendUsername
              ? {
                  ...f,
                  LastMessage: message,
                  LastMessageTime: new Date().toISOString(),
                }
              : f
          ),
        })),

      // ----------------------
      //   OTHER
      // ----------------------

      setRoom: (room) => set({ room }),
      setImg: (img) => set({ profile_img: img }),
      setDboubleBlock: (num) => set({ double_block: num }),
      Setuser_block: (u) => set({ user_block: u }),

      // User auth
      setUser: (userObj) => set({ user: userObj }),
      getUser: () => get().user,
      clearUser: () => set({ user: null }),

      // Hydration flag
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),

      // what to persist
      partialize: (state) => ({
        user: state.user,
        friends: state.friends,
        profile_img: state.profile_img,
      }),

      onRehydrateStorage: (state) => {
        return (rehydrated, error) => {
          state.setHasHydrated(true);
          if (!error) state.initConnection();
        };
      },
    }
  )
);
