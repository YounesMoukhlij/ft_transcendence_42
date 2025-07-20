"use client";

import {create} from 'zustand';


export const globalStore = create((set , get ) =>{


    let name = localStorage.getItem('name');
    set({ username: name });

    return {
    socket : null,
    isConnect : false,
    username : localStorage.getItem('name'), 
    token: null,



    connect: () =>{
        if (get().socket) return ;
        const ws = new WebSocket('ws://localhost:4444/ws');
        ws.onopen = () => {
            console.log("here is connect ");
            ws.send(get().username);
        };
        set({socket: ws})

        ws.onclose = () => {
            console.log(' Disconnected');
        };
    },
    };
});