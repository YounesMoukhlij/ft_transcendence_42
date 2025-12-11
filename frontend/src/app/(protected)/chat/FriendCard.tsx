"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import {formatMessageTime} from './tools'

import axios from 'axios';

import { useUserStore } from "@/store/userStore";


export function useDeblock() {
  const { user, updateDeBlockState } = useUserStore();

    async function handleDeblock(item){
      console.log(item);

    if (item.blockedByUser1 !== user.id_user && item.blockedByUser2 !== user.id_user)
        return ;
    await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/Deblock`, {
      conv_id: item.conversation_id,
      friend_id: item.id_user 
    },{
      headers:{
        Authorization: `Bearer ${user.access_token}`

      }
    });

    if (item.blockedByUser1 === user.id_user)
        updateDeBlockState(1 , item.id_user);
    else
        updateDeBlockState(2 , item.id_user);
}

  return { handleDeblock };
}


export function useFriendActions() {
  const { user, updateBlockState, removeFriend ,  setContactId} = useUserStore();

  async function handleUnfriend(friendId: number, conversationId: number) {
    await axios.post(
      `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/unfriend`,
      {
        conv_id: conversationId,
        friend_id: friendId,
      },
      {
        headers: { Authorization: `Bearer ${user.access_token}` },
      }
    );

    setContactId(-1);
    removeFriend(friendId);
  }

  async function handleBlock(item: any) {
    if (
      item.blockedByUser1 === user.id_user ||
      item.blockedByUser2 === user.id_user
    )
      return;

    await axios.post(
      `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/block`,
      {
        conv_id: item.conversation_id,
        friend_id: item.id_user,
      },
      {
        headers: { Authorization: `Bearer ${user.access_token}` },
      }
    );

    if (item.blockedByUser1 === -1)
      updateBlockState(1, user.id_user, item.id_user);
    else
      updateBlockState(2, user.id_user, item.id_user);
  }

  return {
    handleUnfriend,
    handleBlock,
  };
}







export default function FriendCard() {
  const searchParams = useSearchParams();
  const { friends , removeFriend , user  , updateBlockState , contactId, setContactId } = useUserStore();
  const [friend , SetFriend] = useState(null);
  const { handleDeblock } = useDeblock();
  const { handleUnfriend, handleBlock } = useFriendActions();

  useEffect(() => {
    const friendId = Number(searchParams.get("friend"));

    if (!friendId) {
      setContactId(-1);
      return;
    }
    const item = friends.find(f => f.id_user === friendId);

    if (!item)
      setContactId(-1);
    else {
      setContactId(item.id_user);
      SetFriend(item);
    }

  }, [searchParams, friends]);


  if (!friend || contactId == -1)
    return ("");
return (
    <div className="w-full h-full rounded-2xl bg-white/10 border border-white/20 flex">
        <div className="w-full p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl flex flex-col items-center gap-4">

            <img src={friend.profile_img} className="w-28 h-28 rounded-full border-3 object-cover" />

            <div className="text-center">
                <h1 className="text-xl font-bold text-white">{friend.username}</h1>
                <h2 className="text-sm text-white/70">{friend.fullname}</h2>
            </div>

            <div className="flex items-center gap-2">
                <span
                    className={`w-3 h-3 rounded-full ${friend.status ? 'bg-green-400' : 'bg-red-500'}`}
                ></span>
                {!friend.status ? (
                    <p className="text-white/70 text-sm">
                        Last seen: {formatMessageTime(friend.lastseen)}
                    </p>
                ) : (
                    <p className="text-white/70 text-sm">Online</p>
                )}
            </div>

            {friend.bio?.length > 0 && (
                <p className="text-white/80 text-center bg-white/10 p-3 rounded-lg text-sm w-full break-words overflow-scroll no-scrollbar">
                    {friend.bio}
                </p>
            )}

            <div className="w-full grid grid-cols-3 gap-3 text-center text-white">
                <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/70">XP</p>
                    <p className="text-lg font-bold">{friend.xp}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/70">Wins</p>
                    <p className="text-lg font-bold">{friend.wins}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/70">Losses</p>
                    <p className="text-lg font-bold">{friend.losses}</p>
                </div>
            </div>

            <div className="flex w-full h-full flex-col justify-between">
                <div className="flex gap-3 w-full mt-2">
                    {friend.blockedByUser1 !== user.id_user &&
                    friend.blockedByUser2 !== user.id_user ? (
                        <button
                            onClick={()=>handleBlock(friend)}
                            className="flex-1 bg-gray-700 hover:bg-gray-800 transition rounded-xl py-2 font-semibold text-white hover:cursor-pointer"
                        >
                            Block
                        </button>
                    ) : (
                        <button
                            onClick={()=>handleDeblock(friend)}
                            className="flex-1 bg-red-500 hover:bg-red-600 hover:cursor-pointer transition rounded-xl py-2 font-semibold text-white"
                        >
                            unblock
                        </button>
                    )}

                    <button
                        onClick={() =>
                            handleUnfriend(friend.id_user, friend.conversation_id)
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 transition hover:cursor-pointer rounded-xl py-2 font-semibold text-white"
                    >
                        unfriend
                    </button>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => redirect(`/profile/${friend.username}`)}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 transition rounded-xl py-2 font-semibold text-white hover:cursor-pointer"
                    >
                        View profile
                    </button>
                </div>
            </div>
        </div>
    </div>
);

}


