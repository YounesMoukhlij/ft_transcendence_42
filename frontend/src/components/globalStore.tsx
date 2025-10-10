"use client";
import { create } from "zustand";
import getFormattedDate from "../app/chat/tools";

interface Friend {
  username: string;
  status?: string;
  LastMessage?: string;
  LastMessageTime?: string;
  profile_img?: string;
  [key: string]: any;
}

interface Message {
  sender: string;
  conv_id: string;
  message: string;
  created_at: string;
  isSeen: boolean;
}

interface MessageData {
  sender: string;
  conv_id: string;
  message: string;
  isSeen: boolean;
}

interface GlobalState {
  socket: WebSocket | null;
  isConnect: boolean;
  username: string | null;
  token: string | null;
  friends: Friend[];
  messages: Message[];
  room: string;
  profile_img: string;
  double_block: number;
  user_block: string;
  removeFriend: (usernameToRemove: string) => Friend[];
  setDboubleBlock: (num: number) => void;
  Setuser_block: (UserBlock: string) => void;
  setMessages: (messagesArray: Message[]) => void;
  addMessage: (data: MessageData) => void;
  setRoom: (room: string) => void;
  setImg: (img: string) => void;
  addFriend: (friend: Friend) => void;
  updateLastMessage: (message: string, friend: string) => void;
  updateFriendStatus: (status: string, friend: string) => void;
  setFriends: (friends: Friend[]) => void;
  connect: () => void;
}

export const globalStore = create<GlobalState>((set, get) => ({
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
  
  removeFriend: (usernameToRemove: string) => set((state) => {
    const index = state.friends.findIndex(user => user.username === usernameToRemove);
    if (index !== -1)
      state.friends.splice(index, 1);
    
    return state.friends;
  }),
  setDboubleBlock: (num: number) => set({ double_block: num }),
  Setuser_block: (UserBlock: string) => set({ user_block: UserBlock }),
  setMessages: (messagesArray: Message[]) => set({ messages: messagesArray }),
  addMessage: (data: MessageData) => set((state) => {
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
  
  setRoom: (room: string) => set({ room }),
  
  setImg: (img: string) => set({ profile_img: img }),
  
  addFriend: (friend: Friend) =>
    set((state) => ({
      friends: [...state.friends, friend],
    })),
  updateLastMessage: (message: string, friend: string) =>
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
  updateFriendStatus: (status: string, friend: string) => 
    set((state) => {
      console.log("status ====>", friend, "            ", status);
      return {
        friends: state.friends.map(f =>
          f.username === friend ? { ...f, status: status } : f 
        ),
      };
    }),
  
  setFriends: (friends: Friend[]) => set({ friends }),
  connect: () => {
    if (get().socket) return;
    const ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/ws`
    );
    ws.onopen = () => {
      console.log("Connected");
      ws.send(get().username || "");
    };
    ws.onclose = () => {
      console.log("Disconnected");
    };
    set({ socket: ws });
  },
}));