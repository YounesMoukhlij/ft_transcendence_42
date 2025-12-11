"use client";
import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { GameProvider } from "../../components/GameContext";
import { useEffect ,useState } from "react";
import  {useUserStore}  from '@/store/userStore';
import { redirect } from "next/navigation";




export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode; }>)
{
  const {user , friends, updateSeenMessage ,contactId, socket , addMessage  , updateLastMessage ,removeFriend, updateFriendStatus , Set_Display_game_invite
   ,socketBlockState, setInviterData, addFriend  , updateTypingStatus}  = useUserStore();


  const [notificationAudio, setNotificationAudio] = useState<HTMLAudioElement | null>(null);

 const playNotificationSound = () => {
  if (!notificationAudio) return;
  notificationAudio.currentTime = 0;
  notificationAudio.play().catch(() => {});
};

  useEffect(() => {
    const audio = new Audio("/sound/message.mp3");
    setNotificationAudio(audio);

    const unlockAudio = () => {
      audio.play().catch(() => {});
      audio.pause();
      audio.currentTime = 0;
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);


  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      
      const { type, data } = JSON.parse(event.data);
      if (type === "message") {

        if (user.sound_notification)
          playNotificationSound();
        addMessage(data);

        const updateLastMessageObject = {
          lastMessage: data.message,
          sender: data.sender_user_id,
          lastMessageTime: new Date().toISOString()
        };
        updateLastMessage(updateLastMessageObject , data.sender_user_id);
      
      if (contactId != -1){
        const convId = friends.find(item => item.id_user === contactId).conversation_id;
        socket.send(
          JSON.stringify({
          type: "isSeen",
          contactId,
          convId,
          "sender": data.sender_user_id
        }))
      }


      }
      else if (type === "block") {
        socketBlockState(data.blockedByUser1 , data.blockedByUser2 , data.id);
      } else if (type === "unfriend") {
        removeFriend(data.id_user);
      } else if (type === "status") {
        updateFriendStatus(data.status, data.friend);
      }
      else if (type === "game_invite") {
        Set_Display_game_invite(true);
        setInviterData(data);

        setTimeout(() => {
          Set_Display_game_invite(false);
        }, 5000);
          
      }
      else if (type === "test") {
        addFriend(data);
      }
      else if (type === "start_game") {
        redirect("/game");
      }
      else if (type === "isTyping"){

        setTimeout(() => {
          updateTypingStatus(0 , data.friendId);
        }, 2000);
        updateTypingStatus(1 , data.friendId);
      }
      else if (type === "seen"){
        updateSeenMessage(data.conv_id);
      }

    };
  }, [socket , user?.sound_notification , contactId]);

  return (

    <html lang="en" className="h-full">
      <head>
        <title>Ping Pong Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      {/* 1. h-screen: Force body to be exactly screen height 
          2. overflow-hidden: Prevent the body itself from scrolling (we scroll inner content instead)
      */}
      <body className="h-screen bg-black overflow-hidden text-white">
        {/* <GameProvider> */}
          {/* Navbar is fixed (z-50), so it sits on top of everything */}
          <Navbar />
          
          {/* Main Container:
             1. pt-24 md:pt-28: Adds TOP padding to account for the fixed Navbar height. 
             2. h-full: Fills the screen height.
             3. overflow-hidden: Ensures no leakage from this container triggers parent scroll.
          */}
          <div className="flex h-full pt-24 md:pt-28 gap-4 p-4 box-border overflow-hidden">
            
            {/* Sidebar Component */}
            <Sidebar />
            
            {/* Content Area:
               1. overflow-y-auto: Scroll ONLY vertically IF content exceeds height ("if needed").
               2. overflow-x-hidden: Prevent horizontal scrolling completely.
               3. w-full: Takes remaining width.
               4. h-full: Fills the flex container's available height.
            */}
            <div className="w-full md:w-[90%] bg-transparent h-full overflow-y-auto overflow-x-hidden rounded-3xl relative z-0">
              {children}
            </div>
          </div>
          
          
          {/* <ParticlesBackground id="particles" /> */}
        {/* </GameProvider>  */}

        {/* <ToastContainer 
          position="top-right" 
          autoClose={2000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="dark"
        /> */}
      </body>
    </html>
  );
}


