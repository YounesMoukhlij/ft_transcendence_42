"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import {formatMessageTime} from './tools'
import api from "@/lib/api"
import { useUserStore } from "@/store/userStore";
import {friendType} from "./types";
import {getProfileImageUrl} from "@/lib/utils"
import { useTranslation } from '@/contexts/LanguageContext';

const formatXP = (xp) => {
  const units = ['', 'K', 'M', 'B', 'T', 'Q']
  let unitIndex = 0
  let value = xp

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000
    unitIndex++
  }

  return (
    value >= 10
      ? Math?.floor(value) + units[unitIndex]
      : value?.toFixed(1).replace(/\.0$/, '') + units[unitIndex]
  )
}


export function useDeblock() {

  const { user, updateDeBlockState } = useUserStore();


  async function handleDeblock(item){


    if (item.blockedByUser1 !== user.id_user && item.blockedByUser2 !== user.id_user || item?.isBot)
      return ;
    
    await api.post(`/api/Deblock`, {
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
  const { user, updateBlockState, removeFriend, setContactId} = useUserStore();

  async function handleUnfriend(friendId: number, conversationId: number) {
    if (friendId == -2)
        return ;
    await api.post(`/api/unfriend`,
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

  async function handleBlock(item: friendType) {
    if (item.blockedByUser1 === user.id_user || item.blockedByUser2 === user.id_user || item?.isBot)
      return;

    await api.post(
      `/api/block`,
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
  const { friends, user, contactId, setContactId } = useUserStore();
  const [friend, SetFriend] = useState(null);
  const { handleDeblock } = useDeblock();
  const { handleUnfriend, handleBlock } = useFriendActions();

  console.log("These are friends : === >", friends);
  const {t} = useTranslation();
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
    <div className="w-full h-full flex">
      <div className="w-full p-6 rounded-2xl bg-gray-900 shadow-2xl flex flex-col items-center gap-5">
        

        <div className="relative">
          <img 
            src={getProfileImageUrl(friend.profile_img)} 
            className="w-32 h-32 rounded-full border-3 border-gray-600 object-cover shadow-lg" 
          />
          <div
            className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-gray-900 ${
              friend.status ? 'bg-green-500' : 'bg-gray-600'
            }`}
          />
        </div>


        <div className="text-center w-full">
          <h1 className="text-2xl font-bold text-white mb-1 ">{friend.username}</h1>
          <h2 className="text-sm text-gray-400 mb-3">{friend.fullname}</h2>
          

          <div className="flex items-center justify-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
            <span className={`w-2 h-2 rounded-full ${friend.status ? 'bg-green-500' : 'bg-gray-600'}`}></span>
            {!friend.status ? (
              <p className="text-gray-400 text-sm">
               {t('chat.lastSeen')}: {formatMessageTime(friend.lastseen)}
              </p>
            ) : (
              <p className="text-green-400 text-sm font-medium">{t('chat.online')}</p>
            )}
          </div>
        </div>


        {friend.bio?.length > 0 && (
          <div className="w-full bg-gray-800 p-4 rounded-xl">
            <p className="text-gray-300 text-sm text-center leading-relaxed break-words">
              {friend.bio}
            </p>
          </div>
        )}

        <div className="w-full grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400 pt-2 mb-1 font-medium">{t('chat.xp')}</p>
            <p className="text-xl font-bold w-[4rem] text-center  text-white">{formatXP(friend.xp)}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1 font-medium">{t('chat.wins')}</p>
            <p className="text-xl font-bold text-green-400">{friend.wins}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1 font-medium">{t('chat.losses')}</p>
            <p className="text-xl font-bold text-red-400">{friend.losses}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-auto">
          <div className="flex gap-3">
            {friend.blockedByUser1 !== user.id_user && friend.blockedByUser2 !== user.id_user ? (
              <button
                onClick={() => handleBlock(friend)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl py-3 font-semibold text-white"
              >
                {t('chat.block')}
              </button>
            ) : (
              <button
                onClick={() => handleDeblock(friend)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors rounded-xl py-3 font-semibold"
              >
                {t('chat.unblock')}
              </button>
            )}

            <button
              onClick={() => handleUnfriend(friend.id_user, friend.conversation_id)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors rounded-xl py-3 font-semibold"
            >
              {t('chat.unfriend')}
            </button>
          </div>

          <button
            onClick={() => redirect(`/profile/${friend.id_user}`)}
            className="w-full bg-white hover:bg-gray-200 transition-colors rounded-xl py-3 font-bold text-black"
          >
            {t('chat.viewProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}