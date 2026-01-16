import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import api from "@/lib/api"
import {EmojiClickData} from './types'
import { BsEmojiSmile } from "react-icons/bs";
import { IoGameController } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiMore2Fill } from "react-icons/ri";
import FriendList from './FriendList'

import {getFormattedDate} from './tools'
import {Message} from './types'
import {formatMessageTime} from './tools'

import { MdBlock } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { CgUnblock } from "react-icons/cg";
import { faThumbtackSlash } from '@fortawesome/free-solid-svg-icons';
import {useFriendActions} from './FriendCard'
import { FaUserMinus } from "react-icons/fa"; 
import { useDeblock } from './FriendCard';
import {getProfileImageUrl} from "@/lib/utils"
import { useTranslation } from '@/contexts/LanguageContext';


function MessageDateComponent({ date }: { date: string }) {
  const currentDate = date?.split(' ')[0];
  return (
    <div className="flex items-center justify-center my-2">
      <div className="flex-grow border-t border-gray-600" />
      <span className="mx-3 text-xs text-gray-400">{currentDate}</span>
      <div className="flex-grow border-t border-gray-600" />
    </div>
  );
}

export default function Messages(){
  const searchParams = useSearchParams();
  const messages = useUserStore((state) => state.messages);

  const {socket ,contactId ,setContactId, updatePinStatus, friends ,addMessage  , user ,  setMessages ,  updateLastMessage , bot  } = useUserStore();
  const [friend , SetFriend] = useState(null);
  const [show, setShow] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [SmallFriendList, SetSmallFriendList] = useState<boolean>(false);
  const [showMore , setshowMore] = useState<boolean>(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { handleUnfriend, handleBlock } = useFriendActions();
  const { handleDeblock } = useDeblock();
  const {t} = useTranslation();


  async function  handleGameInvite()
   {
    try{
      await api.post(`/api/sendGameChallenge`,{
        Friend_id: contactId,
      },
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
  }catch(err){
    console.log(err);
  }
  }

  useEffect(()=>{
    if (input.length > 0 && user.typing_indicator && socket){
      socket.send(
        JSON.stringify({
        type: "istyping",
        friend: contactId,
    })
  );
  }
  },[input]);

   useEffect(() => {
    const handleClickOutside = (event :MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShow(false);
        setshowMore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [disabled, setDisabled] = useState(false);

  async function handleClick(friend) {
    setDisabled(true);
    if (friend.isPinned)
    {
      if (friend.pinnedUser1 === user.id_user){
        updatePinStatus("user1" ,friend.id_user ,-1);
      }else{
        updatePinStatus("user2" ,friend.id_user ,-1);
      }
    }
    else
    {
      if (friend.pinnedUser1 === -1){
        updatePinStatus("user1" ,friend.id_user ,user.id_user);
      }else{
        updatePinStatus("user2" ,friend.id_user ,user.id_user);
      }
    }
    try{
      await api.post(
      `/api/pinned`,{},
    {
      params: {
        id: friend.conversation_id,
        pinned: friend.isPinned ? "pinned" : "unpinned",
      },
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    }
);

  }catch(err){
    console.log(err);

    }
    setTimeout(() => setDisabled(false), 2000);
  }

  useEffect(() => {
    const friendId = Number(searchParams.get("friend"));

    if (!friendId) {
      setContactId(-1);
      return;
    }

    const item = friends.find(f => f.id_user === friendId);

    // console.log("||||||||||||" , bot[0]);
    // console.log("||||||||||||==========+>. " , item);
    
    if (!item){
      
      // if (bot.length > 0 && friendId == -2){

      //   // alert(contactId);
      //   SetFriend(bot[0]);
      //   setContactId(-2);
      // }
      // else 
        setContactId(-1);
    }
    else {
      setContactId(item.id_user);
      SetFriend(item);
    }

  }, [searchParams, friends , bot]);

  useEffect(() =>{
    if (!socket)
      return ;
    socket.send(
      JSON.stringify({
      type: "isSeen",
        contactId,
        userId:  user.id_user,
        convId: friends.find(item => item.id_user === contactId)?.conversation_id
          
    }))
  
  },[contactId]);

  useEffect(() => {
    const chatContainer = document.querySelector('.chat-body');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

  }, [messages]);

    async function getMsgFunction(id : number)
    {
        
      try {
        if (contactId == -2){
          const msgsRes = await api.get(
            `/api/GetbotMessages`,
              {
              params: {
                  id: id,
              },
              headers: {
                  Authorization: `Bearer ${user.access_token}`
              }
            }
          );
          setMessages(msgsRes.data);
          console.log("bot messages ===================++>", msgsRes.data);
        }else {        const msgsRes = await api.get(
            `/api/getMsgs`,
            {
            params: {
                id: id,
            },
            headers: {
                Authorization: `Bearer ${user.access_token}`
            }
          }
        );
          setMessages(msgsRes.data);
          console.log("human messages ===================++>", msgsRes.data);

        }
        } catch (err) {
        console.error("Error fetching messages:", err);
        }
    }

    useEffect(()=>{
        if (contactId === -1)
            return ;
      // if (contactId === -2) {
      //   setMessages([]); 
      //   return;
      // }
        const id = friends.find(item => item.id_user === contactId)?.conversation_id;
        if (id)
          getMsgFunction(id);
    },[contactId])

  const handleSend = async () => {
    if (input.trim().length == 0){
      setInput('');
      return;
    }
    const conversation_id = friends.find(item => item.id_user === contactId)?.conversation_id;

    try {
      if (!socket)
        return ;
      if ( contactId == -2)
          return setInput('');
        socket.send(
          JSON.stringify({
          type: "message",
          input,
          contactId,
          conversation_id,
          userId : user.id_user,
    }));

    const object: Message = {
      sender_user_id: user.id_user,
      message: input,
      conv_id: conversation_id,
      created_at: getFormattedDate(),
      isSeen: false
    };
    addMessage(object);

      const updateLastMessageObject = {
      lastMessage: input,
      sender: user.id_user,
      lastMessageTime: new Date().toISOString()
    };

    updateLastMessage(updateLastMessageObject , contactId);

    } catch (err) {
      console.error(err);
    }
    setInput('');
  }

  function handleEnterKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSend();
    }
  }
  function handleShowMore(){
    setshowMore(!showMore);
  }

  function handle_Emojis(setShow: React.Dispatch<React.SetStateAction<boolean>>, show: boolean) {
      setShow(!show)
  }
  function move_emoji_to_input(object: EmojiClickData) {
    setInput(prevValue => prevValue + object.emoji);
  }
  function smallListFriendShow(){
    SetSmallFriendList(!SmallFriendList);
  }

    return (
        <div className="w-full max-h-screen h-full flex flex-col gap-3.5 relative overflow-hidden">
          {showMore && contactId !== -1 && 
          <div ref={menuRef} className="absolute top-17 right-12 z-50 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 p-1 flex flex-col animate-fadeIn">
            <div>
              {friend.blockedByUser1 !== user.id_user && friend.blockedByUser2 !== user.id_user ? (
                <button onClick={()=>handleBlock(friend)} className="w-full text-left px-2 py-2 flex items-center gap-1 hover:bg-gray-800 rounded-lg transition-colors duration-150">
                  <MdBlock />
                <h1>{t('chat.block')}</h1>
              </button>
              ) : (
                <button onClick={()=>handleDeblock(friend)} className="w-full text-left px-2 py-2 flex items-center gap-1 hover:bg-gray-800 rounded-lg transition-colors duration-150">
                  <CgUnblock />
                  <h1>{t('chat.unblock')}</h1>
                </button>
              )}
            </div>
            <div>
        
              <button onClick={()=>{
                handleUnfriend(friend.id_user , friend.conversation_id)
                setshowMore(false) 
              }} className="w-full text-left px-2 py-2 flex gap-1 items-center hover:bg-gray-800 rounded-lg transition-colors duration-150">
                 <FaUserMinus /> 
                <h1>{t('chat.unfriend')}</h1>
              </button>
            </div>
            <div className="">
              {!friend.isPinned && 
                <button onClick={()=> handleClick(friend)} disabled={disabled} className={`px-2 py-2 rounded flex items-center gap-1 w-full hover:bg-gray-800 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}>
                  <FontAwesomeIcon icon={faThumbtack} className="text-white" />
                  <h1 className="text-center">{t('chat.pin')}</h1>
                </button>
              }
              {friend.isPinned && 
                <button onClick={()=>handleClick(friend)} disabled={disabled} className={`px-2 py-2 rounded flex items-center gap-1 w-full hover:bg-gray-800 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}>
                  <FontAwesomeIcon  icon={faThumbtackSlash} className="text-white" />
                  <h1 className="text-center">{t('chat.unpin')}</h1>
                </button>
              }
            </div>
          </div>
          }
          
            <div className="flex-shrink-0 p-5 h-28 bg-black border border-gray-800 rounded-xl shadow-lg">
                {friend && contactId !== -1 && 
                    <div className="w-full h-full flex justify-between">
                        <div className="sm:hidden w-[2rem] flex items-center p-1.5">
                            <GiHamburgerMenu onClick={smallListFriendShow} size={20} className="text-white"/>
                        </div>
                        <div className="w-[80%] h-full flex items-center gap-3.5 p-3 flex-1 ">
                            <img className="min-h-[60%] max-h-[180%] lg:h-[100%] xl:h-[120%] 2xl:h-[180%] rounded-[50%] border-2 border-gray-700" src={getProfileImageUrl(friend?.profile_img)}/>
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl md:text-3xl text-white">{friend?.username}</h1>
                                {
                                    friend?.isTyping ? (
                                      <h1 className="text-gray-400">{t('chat.typing')}</h1>
                                    ):
                                    friend.status ?(
                                        <h1 className="text-gray-400">{t('chat.online')}</h1>
                                    ):(
                                        <h1 className="text-gray-500">{t('chat.lastSeen')}: {formatMessageTime(friend?.lastseen)}</h1>
                                    )
                                }
                            </div>
                        </div>
                        <div className="w-[6%] flex justify-center items-center">
                          <button onClick={handleShowMore} ref={buttonRef}>
                            <RiMore2Fill className="hover:cursor-pointer text-white" size={20}/>
                          </button>
                        </div>
                    </div>
                }
            </div>

            <div className="flex-1 relative rounded-2xl flex flex-col overflow-hidden min-h-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                    {SmallFriendList && 
                        <div onClick={()=> SetSmallFriendList(false)} className="sm:hidden z-30 absolute bg-black w-full h-full">
                            <FriendList />
                        </div>
                    }

                    <div className="chat-body flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar min-h-0">
                        <div className="flex justify-center">
                            {
                               friend &&  contactId != -1 &&
                                <div className="flex w-[90%] sm:w-[80%] lg:w-[25rem] bg-gray-800 mt-2 sm:mt-4 p-3 sm:p-4 rounded-[10px] border border-gray-700">
                                    <p className="text-center text-gray-300 text-sm">
                                        {t('chat.encryptedMessage')}
                                    </p>
                                </div>
                            }
                        </div>
                        {
                         friend &&  contactId != -1 &&
                         <div className="">
                          {
                            messages.map((item, index) => {
                              const currentDate = item.created_at.split(' ')[0];
                              const prevDate = index > 0 ? messages[index - 1].created_at.split(' ')[0] : null;
                              return (
                                <div key={index} className="flex flex-col m-1.5">
                                {currentDate !== prevDate && <MessageDateComponent date={item.created_at} />}
                                <div className={`flex ${item.sender === user.id_user ? 'justify-end' : 'justify-start'} mb-2`}>
                                  <div
                                    className={`p-2 sm:p-3 rounded-lg flex flex-col ${item.sender === user.id_user ? 'bg-gray-800 text-white rounded-br-none border border-gray-700' : 'bg-gray-300 text-black rounded-bl-none'}`}
                                    style={{ maxWidth: '85%', minWidth: '100px' }}
                                    >
                                    <p className="break-words text-xs sm:text-sm lg:text-base">{item.message}</p>
                                    <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs">
                                      <span className="whitespace-nowrap text-gray-400">
                                        {new Date(item.created_at).toTimeString().slice(0, 5)}
                                      </span>
                                      {item.sender === user.id_user && (
                                        <div className="ml-2">
                                          {item.isSeen ? <FaCheckDouble className="text-gray-400"/> : <FaCheck className="text-gray-500"/>}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              );})
                          }
                          </div>
                        }
                    </div>


                    <div className="flex-shrink-0">
                      {
                        friend &&  contactId != -1 && (
                          <>
                            {
                              friend.blockedByUser1 === user.id_user || friend.blockedByUser2 === user.id_user  ? (
                              <div className="flex items-center p-3.5 justify-between bg-black border-t border-gray-800">
                                <div className="flex justify-around w-full h-full items-center px-2">
                                  <p className="text-xs sm:text-sm text-gray-400">
                                    {t('chat.cannotSendDeblock')}
                                  </p>
                                </div>
                              </div>
                            ) :  friend.blockedByUser1 === friend.id_user || friend.blockedByUser2 ===  friend.id_user ? (
                              <div className="flex items-center p-3.5 justify-between bg-black border-t border-gray-800">
                                <div className="flex justify-around w-full h-full items-center px-2">
                                  <p className="text-xs sm:text-sm text-gray-400">
                                    {t('chat.cannotSendBlocked')}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full flex justify-around items-center p-2.5 bg-black border-t border-gray-800">
                                <div className="relative">
                                  <button ref={buttonRef} onClick={() => handle_Emojis(setShow, show)}>
                                    <BsEmojiSmile className="w-8 h-8 lg:w-8 lg:h-8 text-gray-400 hover:text-white transition-colors" />
                                  </button>
                                  {show && (
                                    <div
                                      ref={menuRef}
                                      className="absolute left-0 bottom-12 sm:left-[10%] sm:bottom-16 z-50"
                                    >
                                      <EmojiPicker onEmojiClick={move_emoji_to_input} />
                                    </div>
                                  )}
                                </div>

                                <div className="mx-2 w-[80%] overflow-hidden">
                                  <input
                                    className="w-full h-10 sm:h-10 lg:h-12 bg-gray-800 text-white border border-gray-700 p-2 sm:p-4 rounded-[20px] sm:rounded-[50px] outline-none focus:border-gray-600 text-xs sm:text-sm lg:text-base placeholder-gray-500"
                                    placeholder={t('chat.writeMessagePlaceholder')}
                                    onKeyDown={handleEnterKey}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                  />
                                </div>

                                <div className="mr-2 sm:mr-4 hover:cursor-pointer" onClick={handleGameInvite}>
                                  <button>
                                    <IoGameController className="w-8 h-8 lg:w-8 lg:h-8 text-gray-400 hover:text-white transition-colors" />
                                  </button>
                                </div>

                                <div onClick={handleSend} className="mr-2 sm:mr-4">
                                  <IoSend className="w-8 h-8 lg:w-8 lg:h-8 cursor-pointer text-gray-400 hover:text-white transition-colors" />
                                </div>
                              </div>
                            )}
                          </>
                        )
                      }
                    </div>
            </div>
        </div>
    )
}