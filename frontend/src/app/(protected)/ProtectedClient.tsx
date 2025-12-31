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
    socketBlockState, setInviterData, addFriend, updateTypingStatus
  } = useUserStore();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    connect();
    // alert("socket connected");
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

    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "notify")
      {
        if (data.title == "request friend") {
          addPendingRequests({
            sender_user: data.sender_user,
            sender_username: data.sender_username,
            notify_id: data.notify_id,
          });
          } else if (data.title == "friend request accepted") {
            removeSentRequests(data.sender_user);
            addFriend({ id_user: data.sender_user });
          }
          // setNotification(prev => [{
          //   sender_user: data.sender_user,
          //   title: data.title,
          //   sender_username: data.sender_username,
          //   sender_profile_img: data.sender_profile_img,
          //   notify_id: data.notify_id,
          //   expired: data.expired,
          //   tournamentId: data.tournamentId
          // }, ...prev]);
        } else if (type == "unfriend") {
          removeFriend(data.id_user);
        } else if (type == "rejected") {
          removeSentRequests(data.getter_user);
        } else if (type == "canceled request") {
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

      if (type === "start_game" || type === "game_challenge_accepted") {
        const challengeId = data?.challengeId;
        if (challengeId && typeof window !== "undefined") {
          localStorage.setItem("pendingChallengeId", String(challengeId));
        }

        setGameMode("remote");
        router.push("/game/customize");
      }
      if (type === "block") socketBlockState(data.blockedByUser1, data.blockedByUser2, data.id);
      if (type === "unfriend") removeFriend(data.id_user);
      if (type === "status") updateFriendStatus(data.status, data.friend);
      if (type === "game_invite") {
        Set_Display_game_invite(true);
        setInviterData(data);
        setTimeout(() => Set_Display_game_invite(false), 5000);
      }
      if (type === "test") addFriend(data);
      if (type === "isTyping") {
        updateTypingStatus(1, data.friendId);
        setTimeout(() => updateTypingStatus(0, data.friendId), 2000);
      }
      if (type === "seen") updateSeenMessage(data.conv_id);

    };
  }, [socket, user?.sound_notification, contactId, router, setGameMode]);

  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}
