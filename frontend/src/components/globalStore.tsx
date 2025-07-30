"use client";

import { create } from 'zustand';

export const globalStore = create((set, get) => ({
  socket: null,
  isConnect: false,
  username: null,
  token: null,


  connect: () => {
    if (get().socket) return;


    const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/ws`);

    ws.onopen = () => {
      console.log("Connected");
      ws.send(get().username || '');
    };

    ws.onclose = () => {
      console.log('Disconnected');
    };

    set({ socket: ws });
  },
}));
