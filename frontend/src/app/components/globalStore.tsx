import {create} from 'zustand';


const globalStore = create((set . get ) =>({
    socket : null,
    isConnect : false,
    username : null , 
    token: null,

    connect: () =>{
        if (get().socket) return ;
        
    }
}))