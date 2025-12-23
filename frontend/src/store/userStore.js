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
        // Only skip if socket exists AND is open or connecting
        const existingSocket = get().socket;
        if (existingSocket) {
          if (existingSocket.readyState === WebSocket.OPEN) {
            console.log('Socket already open, skipping connect');
            return;
          }
          if (existingSocket.readyState === WebSocket.CONNECTING) {
            console.log('Socket already connecting, skipping connect');
            return;
          }
          // If socket exists but is closed/closing, close it first
          if (existingSocket.readyState === WebSocket.CLOSED || existingSocket.readyState === WebSocket.CLOSING) {
            console.log('Cleaning up closed/closing socket before reconnecting');
            try {
              existingSocket.close();
            } catch {
              // Ignore errors when closing
            }
            set({ socket: null, isConnect: false });
          }
        }

        if (typeof window === "undefined") return;

        // Get user ID from state or localStorage
        const getUserId = () => {
          const stateUser = get().user;
          if (stateUser?.id_user) return stateUser.id_user;

          // Fallback to localStorage
          try {
            const stored = localStorage.getItem('user-storage');
            if (stored) {
              const parsed = JSON.parse(stored);
              return parsed?.state?.user?.id_user || null;
            }
          } catch (e) {
            // Ignore parse errors
          }
          return null;
        };

        const id = getUserId();
        if (!id) {
          console.warn("User ID not available yet, WebSocket connection will be delayed");
          // Retry after a short delay if user might be loading
          setTimeout(() => {
            const retryId = getUserId();
            if (retryId && !get().socket) {
              get().connect();
            }
          }, 500);
          return;
        }

        // Build WebSocket URL using smart detection (works for both local and network IP)
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";

        // Smart host detection: use env var if set and not localhost, otherwise use current hostname
        // This ensures network access works automatically
        const envHost = process.env.NEXT_PUBLIC_BACKEND_IP || process.env.NEXT_PUBLIC_BACKENDIP;
        const envPort = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_BACKENDPORT || '4444';

        let host;
        if (envHost && envHost.trim() !== '' && envHost !== 'localhost' && envHost !== '127.0.0.1') {
          // Use env var if explicitly set to non-localhost
          host = envHost;
        } else {
          // Use current hostname (runtime detection) - works for network access
          // e.g., if frontend is at http://192.168.1.100:3000, WS will be at ws://192.168.1.100:4444/ws
          host = window.location.hostname;
        }

        const url = `${protocol}://${host}:${envPort}/ws`;

        console.log('Attempting to connect WebSocket to:', url);

        try {
          const ws = new WebSocket(url);

          ws.onopen = () => {
            console.log("WebSocket opened successfully:", url);
            // Get user ID again (in case it wasn't available when connect was called)
            const userId = getUserId();

            if (!userId) {
              console.warn("User ID still missing when socket opened, will retry...");
              // Wait a bit and retry sending the ID
              const retryInterval = setInterval(() => {
                const retryUserId = getUserId();
                if (retryUserId && ws.readyState === WebSocket.OPEN) {
                  ws.send(String(retryUserId));
                  set({ isConnect: true });
                  console.log("Connected WS (retry) - User ID sent:", retryUserId, url);
                  clearInterval(retryInterval);
                } else if (ws.readyState !== WebSocket.OPEN) {
                  console.warn("Socket closed while waiting for user ID");
                  clearInterval(retryInterval);
                }
              }, 200);

              // Stop retrying after 5 seconds
              setTimeout(() => clearInterval(retryInterval), 5000);
              return;
            }

            ws.send(String(userId));
            set({ isConnect: true });
            console.log("Connected WS - User ID sent:", userId, url);
          };

          ws.onclose = (event) => {
            console.log("Disconnected WS", {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean,
              url
            });
            set({ isConnect: false, socket: null });
          };

          ws.onerror = (err) => {
            console.error("WebSocket error:", {
              error: err,
              url,
              readyState: ws.readyState
            });
            set({ isConnect: false });
          };

          set({ socket: ws });
        } catch (err) {
          console.error("Failed to create WebSocket:", err);
        }
      },

      // Auto-connect after hydration
      initConnection: () => {
        // Get user ID from state or localStorage
        const getUserId = () => {
          const stateUser = get().user;
          if (stateUser?.id_user) return stateUser.id_user;

          // Fallback to localStorage
          try {
            const stored = localStorage.getItem('user-storage');
            if (stored) {
              const parsed = JSON.parse(stored);
              return parsed?.state?.user?.id_user || null;
            }
          } catch (e) {
            // Ignore parse errors
          }
          return null;
        };

        const id = getUserId();
        if (id) {
          get().connect();
        } else {
          // Retry after a short delay if user might still be loading
          setTimeout(() => {
            const retryId = getUserId();
            if (retryId) {
              get().connect();
            }
          }, 300);
        }
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
