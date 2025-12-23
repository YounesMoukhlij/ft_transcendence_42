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

      socket: null,
      friends: [],


      messages: [],

      pendingRequests: [],
      sentRequests: [],
      contactId : -1,



connect: () => {
  const state = get();

  if (state.socket || state.isConnect) return;
  if (typeof window === "undefined") return;

  const token = state.user?.access_token; 
  console.log(token);

  if (!token) {
    return;
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  
  const url = `${protocol}://e1r8p8.1337.ma:4444/ws?token=${token}`;

  try {
    const ws = new WebSocket(url);
    console.log(url);
    ws.onopen = () => {
      set({ socket: ws, isConnect: true });
    };

    ws.onclose = () => {
      set({ socket: null, isConnect: false });
    };

    ws.onerror = (err) => {
    };

    set({ socket: ws });

  } catch (err) {
    console.error("Failed to create WebSocket:", err);
  }
},



      initConnection: () => {
        const id = get().user?.id_user;
        if (id) get().connect();
      },

    setContactId : (contactId) => set({contactId}),

    setFriends: (friends) => set({ friends }),

    updateUserSetting: (mode, status) =>
      set((state) => {
        if (mode === "sound_notification") {
          return {
            user: {
              ...state.user,
              sound_notification: status,
            },
          };
        }

        if (mode === "typing_indicator") {
          return {
            user: {
              ...state.user,
              typing_indicator: status,
            },
          };
        }
        if (mode === "read_receipts") {
          return {
            user: {
              ...state.user,
              read_receipts: status,
            },
          };
        }
        if (mode === "status_share") {
          return {
            user: {
              ...state.user,
              status_share: status,
            },
          };
        }

        return state; 
    }),


    


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
        set((state) => {
          const now = new Date();
          const currentTime =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0") + " " +
            String(now.getHours()).padStart(2, "0") + ":" +
            String(now.getMinutes()).padStart(2, "0") + ":" +
            String(now.getSeconds()).padStart(2, "0");

          return {
            friends: state.friends.map((f) =>
              f.id_user == friendId
                ? {
                    ...f,
                    status,
                    last_seen: status === 0 ? currentTime : f.last_seen
                  }
                : f
            ),
          };
        }),


  updateTypingStatus: (status, friendId) =>
  set((state) => ({
    friends: state.friends.map((f) =>
      f.id_user == friendId
        ? { ...f, isTyping: status }
        : f
    ),
  })),



updatePinStatus: (attribute, friendId, value) => {
  const isPinned = value !== -1;

  if (attribute === "user1") {
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id_user === friendId
          ? {
              ...f,
              pinnedUser1: value,
              pinnedDateUser1: getFormattedDate(),
              isPinned: isPinned
            }
          : f
      ),
    }));
  } else if (attribute === "user2") {
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id_user === friendId
          ? {
              ...f,
              pinnedUser2: value,
              pinnedDateUser2: getFormattedDate(),
              isPinned: isPinned
            }
          : f
      ),
    }));
  }
},




  updateBlockState: (mode, id, friendId) => {
    if (mode == 1) {
      set((state) => ({
        friends: state.friends.map((f) =>
          f.id_user === friendId
            ? { ...f, blockedByUser1: id }
            : f
        )
      }));
    } else if (mode == 2) {
      set((state) => ({
        friends: state.friends.map((f) =>
          f.id_user === friendId
            ? { ...f, blockedByUser2: id }
            : f
        )
      }));
    }
  },
  updateDeBlockState: (mode, friendId) => {
    if (mode == 1) {
      set((state) => ({
        friends: state.friends.map((f) =>
          f.id_user === friendId
            ? { ...f, blockedByUser1: -1 }
            : f
        )
      }));
    } else if (mode == 2) {
      set((state) => ({
        friends: state.friends.map((f) =>
          f.id_user === friendId
            ? { ...f, blockedByUser2: -1 }
            : f
        )
      }));
    }
  },


   socketBlockState: (blockedByUser1, blockedByUser2 ,  friendId) => {

      set((state) => ({
        friends: state.friends.map((f) =>
          f.id_user === friendId
            ? { ...f, blockedByUser1: blockedByUser1 , blockedByUser2:blockedByUser2}
            : f
        )
      }));
  },

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
                sender: data.sender_user_id,
                conv_id: data.conv_id,
                message: data.message,
                created_at: time,
                isSeen: data.isSeen,
              },
            ],
          };
        }),

      updateSeenMessage: (conv_id) =>
        set((state) => ({
          messages: state.messages.map((f) =>
            f.conv_id == conv_id
              ? {
                  ...f,
                  isSeen: 1,
                }
              : f
          ),
        })),

      updateLastMessage: (item, friendId) =>
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id_user == friendId
              ? {
                  ...f,
                  lastMessage: item.lastMessage,
                  lastMessageSender: item.sender,
                  lastMessageTime: item.lastMessageTime,
                }
              : f
          ),
        })),

      // ----------------------
      //   OTHER
      // ----------------------



      setRoom: (room) => set({ room }),
      setImg: (img) => set({ profile_img: img }),

      // User auth
      setUser: (userObj) => set({ user: userObj }),
      getUser: () => get().user,
      clearUser: () => set({ user: null }),
      logout: () => {
      set({ user: null }); // Clears state
       
      },

      // Hydration flag
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      getStorage: () => localStorage,
      // what to persist
      partialize: (state) => ({
        user: state.user,
        friends: state.friends,
        profile_img: state.profile_img,
      }),

      onRehydrateStorage: (state) => {
        return (state, error) => {
          state.setHasHydrated(true);
          if (!error) state.initConnection();
        };
      },
    }
  )
);
