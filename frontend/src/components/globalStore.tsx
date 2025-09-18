"use client";

import { create } from "zustand";
import getFormattedDate from "../app/chat/tools";



export const globalStore = create((set, get) => ({

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





 removeFriend: (usernameToRemove) => set((state) => {

    const index = state.friends.findIndex(user => user.username === usernameToRemove);

    if (index !== -1)
      state.friends.splice(index, 1);
    
    return state.friends;
  }),

  setDboubleBlock : (num) => set ({double_block: num}),
  Setuser_block : (UserBlock) => set ({user_block: UserBlock}),

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
  



  // updateFriendStatus: (status, friend) => 
  // set((state) => {
  //   console.log(state.friends);
  //   console.log("status ====> " , status);
  //   return {
  //     friends: state.friends.map(f =>
  //       f.username === friend ? { ...f, status } : f
  //     ),
  //   };
  // }),



  updateFriendStatus: (status, friend) => 
  set((state) => {
    console.log("status ====>", friend , "            " ,  status);
    return {
      friends: state.friends.map(f =>
        f.username === friend ? { ...f, status: status } : f // Corrected: updating the status
      ),
    };
  }),

  
  setFriends: (friends) => set({ friends }),

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
