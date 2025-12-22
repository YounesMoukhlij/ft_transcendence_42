// "use client";

// import React, { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar";
// import Sidebar from "../../components/Sidebar";
// import { useUserStore } from "@/store/userStore";
// import { redirect } from "next/navigation";
// import { ToastContainer } from "react-toastify";

// export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   const {
//     user, friends, updateSeenMessage, contactId, socket, addMessage,
//     updateLastMessage, removeFriend, updateFriendStatus, Set_Display_game_invite,
//     socketBlockState, setInviterData, addFriend, updateTypingStatus
//   } = useUserStore();

//   const [notificationAudio, setNotificationAudio] = useState<HTMLAudioElement | null>(null);

//   const playNotificationSound = () => {
//     if (!notificationAudio) return;
//     notificationAudio.currentTime = 0;
//     notificationAudio.play().catch(() => {});
//   };

//   useEffect(() => {
//     const audio = new Audio("/sound/message.mp3");
//     setNotificationAudio(audio);

//     const unlockAudio = () => {
//       audio.play().catch(() => {});
//       audio.pause();
//       audio.currentTime = 0;
//       window.removeEventListener("click", unlockAudio);
//     };

//     window.addEventListener("click", unlockAudio);
//     return () => window.removeEventListener("click", unlockAudio);
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     socket.onmessage = (event: MessageEvent) => {
//       const { type, data } = JSON.parse(event.data);

//       if (type === "message") {
//         if (user.sound_notification) playNotificationSound();
//         addMessage(data);

//         updateLastMessage(
//           {
//             lastMessage: data.message,
//             sender: data.sender_user_id,
//             lastMessageTime: new Date().toISOString(),
//           },
//           data.sender_user_id
//         );

//         if (contactId !== -1) {
//           const convId = friends.find(item => item.id_user === contactId)?.conversation_id;
//           if (convId) {
//             socket.send(
//               JSON.stringify({ type: "isSeen", contactId, convId, sender: data.sender_user_id })
//             );
//           }
//         }
//       }

//       if (type === "block") socketBlockState(data.blockedByUser1, data.blockedByUser2, data.id);
//       if (type === "unfriend") removeFriend(data.id_user);
//       if (type === "status") updateFriendStatus(data.status, data.friend);
//       if (type === "game_invite") {
//         Set_Display_game_invite(true);
//         setInviterData(data);
//         setTimeout(() => Set_Display_game_invite(false), 5000);
//       }
//       if (type === "test") addFriend(data);
//       if (type === "start_game") redirect("/game");
//       if (type === "isTyping") {
//         updateTypingStatus(1, data.friendId);
//         setTimeout(() => updateTypingStatus(0, data.friendId), 2000);
//       }
//       if (type === "seen") updateSeenMessage(data.conv_id);
//     };
//   }, [socket, user?.sound_notification, contactId]);

//   return (
//     <div className="h-[100vh] flex flex-col debug">
//       <Navbar />

//       <div className="flex flex-1 pt-24 md:pt-28 gap-4 p-4 box-border scroll-none">
//         <Sidebar />

//         <main className="flex-1 h-full overflow-y-auto ">
//           {children}
//         </main>

//       </div>
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           theme="dark"
//         />
//     </div>
//   );
// }
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedClient from "./ProtectedClient";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 return (
    <ProtectedClient>
      {/* Outer wrapper: Full screen height */}
      <div className="min-h-screen flex flex-col bg-transparent text-white">
        
        {/* 1. Navbar: Fixed at top */}
        <Navbar />

        {/* 2. Content Wrapper
          flex-row: Aligns Sidebar and Main side-by-side
          pt-28: Clears space for the fixed Navbar (24 + padding)
          gap-6: Space between sidebar and main content
        */}
        <div className="flex flex-1 pt-28 px-4 pb-4 gap-6 max-w-[98%] mx-auto w-full">
          
          {/* Left: Sidebar (Auto width, Sticky behavior handled inside component) */}
          <Sidebar />

          {/* Right: Main Content (Takes remaining space) */}
          <main className="flex-1 w-full overflow-y-auto rounded-3xl bg-transparent">
            {children}
          </main>

        </div>
      </div>
    </ProtectedClient>
  );
}
