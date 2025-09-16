"use client";

import { create } from "zustand";
import getFormattedDate from "../app/chat/tools";


// alert(getFormattedDate());
export const globalStore = create((set, get) => ({

  socket: null,
  isConnect: false,
  username: null,
  token: null,

  friends: [],
  messages: [],
  room: "",
  profile_img: "",



setMessages: (messagesArray) => set({ messages: messagesArray }),


addMessage: (data) => set((state) => {
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

  
  setRoom: (room) => set({ room }),
  
  setImg: (img) => set({ profile_img: img }),
  


  addFriend: (friend) =>
    set((state) => ({
      friends: [...state.friends, friend],
    })),

  setFriends: (friends) => set({ friends }),

  removeFriend: (id) =>
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== id),
    })),

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
