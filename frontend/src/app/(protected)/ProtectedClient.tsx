"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { useGameContext } from "@/components/GameContext";


export default function ProtectedClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setGameMode } = useGameContext();

  const {
    user, removePendingRequests, updateSeenMessage, contactId, socket, addMessage,connect, removeSentRequests, addPendingRequests ,
    updateLastMessage, removeFriend, updateFriendStatus, Set_Display_game_invite,
    socketBlockState, setInviterData, addFriend, updateTypingStatus , addNotification , deleteNotification , addBot
  } = useUserStore();


  const sentRequests = useUserStore.getState().sentRequests;

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };


  useEffect(() => {
    if (!socket)
      connect();
    const a = new Audio("/sound/message.mp3");
    setAudio(a);

    const unlock = () => {
      a.play().catch(() => {});
      a.pause();
      a.currentTime = 0;
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  useEffect(() => {
    if (!socket) return;

    // alert("here");
    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === "notify")
      {
        if (data.title == "request friend") {
          addNotification(data);
          addPendingRequests({
            sender_user: data.sender_user,
            sender_username: data.sender_username,
            notify_id: data.notify_id,
          });

        } else if (data.title == "friend request accepted") {

          addNotification(data);
          const sentRequests = useUserStore.getState().sentRequests;
          removeSentRequests(data.sender_user);
          addFriend({ id_user: data.sender_user , conversation_id: data.room_id });
        } else if (data.title == "game challenge") {
          // Handle game challenge notifications
          addNotification(data);
        }
      }

      if (type == "unfriend") {
        removeFriend(data.id_user);
      } else if (type == "rejected") {
        removeSentRequests(data.getter_user);
      } else if (type == "canceled request") {
        deleteNotification(data.notify_id);
        removePendingRequests(data.sender_user);
      }
      if (type === "message") {
        if (user.sound_notification) playSound();
        addMessage(data);

        updateLastMessage(
          {
            lastMessage: data.message,
            sender: data.sender_user_id,
            lastMessageTime: new Date().toISOString(),
          },
          data.sender_user_id
        );
      }

      else if (type === "start_game" || type === "game_challenge_accepted") {
        const challengeId = data?.challengeId;
        if (challengeId && typeof window !== "undefined") {
          localStorage.setItem("pendingChallengeId", String(challengeId));
        }

        setGameMode("remote");
        router.push("/game/customize");
      }
      else if (type === "block") socketBlockState(data.blockedByUser1, data.blockedByUser2, data.id);
      else if (type === "unfriend") removeFriend(data.id_user);
      else if (type === "status") updateFriendStatus(data.status, data.friend);
      else if (type === "game_invite") {
        Set_Display_game_invite(true);
        setInviterData(data);
        setTimeout(() => Set_Display_game_invite(false), 5000);
      }
      
      
      else if (type === "your turn") addBot(data);
      else if (type === "gameInvitation") {
        // Handle real-time game invitation from friend
        // This is sent by GameManager.sendFriendInvitation
        const invitationData = {
          notify_id: Date.now(), // Temporary ID for real-time display
          getter_user: user?.id_user,
          sender_user: data.payload?.from?.id,
          sender_username: data.payload?.from?.username,
          title: "game challenge",
          sender_profile_img: null, // Will be fetched from notification API
          expired: null,
          // Store invitation data for acceptance
          invitationData: data.payload
        };
        addNotification(invitationData);
      }
      else if (type === "test") addFriend(data);
      else if (type === "isTyping") {
        updateTypingStatus(1, data.friendId);
        setTimeout(() => updateTypingStatus(0, data.friendId), 2000);
      }
      else if (type === "seen") updateSeenMessage(data.conv_id);

    };
  }, [socket, user?.sound_notification, contactId, router, setGameMode]);

  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
