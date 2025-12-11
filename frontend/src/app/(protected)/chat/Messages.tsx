import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios'
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

function MessageDateComponent({ date }: { date: string }) {
  const currentDate = date?.split(' ')[0];
  return (
    <div className="flex items-center justify-center my-2">
      <div className="flex-grow border-t border-gray-300" />
      <span className="mx-3 text-xs text-gray-500">{currentDate}</span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
}



export default function Messages(){
  const searchParams = useSearchParams();
  const messages =useUserStore((state) => state.messages);

  const {socket ,contactId ,setContactId, updatePinStatus, friends ,addMessage  , user ,  setMessages ,  updateLastMessage } = useUserStore();
  const [friend , SetFriend] = useState(null);
  const [show, setShow] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [SmallFriendList, SetSmallFriendList] = useState<boolean>(false);
  const [showMore , setshowMore] = useState<boolean>(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { handleUnfriend, handleBlock } = useFriendActions();
  const { handleDeblock } = useDeblock();
  
  useEffect(()=>{
    if (input.length > 0 && user.typing_indicator){
      socket.send(
        JSON.stringify({
        type: "istyping",
        friend: contactId,
    })
  );
    }
  },[input , socket]);



   useEffect(() => {
    const handleClickOutside = (event : any) => {
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
     const res = await axios.post(
      `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/pinned`,{},
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

    }catch(err){}
    setTimeout(() => setDisabled(false), 2000);
  }


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
  
  },[contactId , socket]);

  useEffect(() => {
    const chatContainer = document.querySelector('.chat-body');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    console.log(messages);
  }, [messages]);

    async function getMsgFunction(id : number)
    {
        try {
        const msgsRes = await axios.get(
            `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getMsgs`,
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

        } catch (err) {
        console.error("Error fetching messages:", err);
        }
    }

    useEffect(()=>{
        if (contactId === -1)
            return ;
        const id = friends.find(item => item.id_user === contactId)?.conversation_id;
        if (id)
          getMsgFunction(id);
    },[contactId])


  const handleSend = async () => {
    if (input.trim().length == 0){
      setInput('');
      return;
    }
    const conversation_id = friends.find(item => item.id_user === contactId).conversation_id;

    try {
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
    console.log(object);
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
        <div className="w-full h-full rounded-2xl flex flex-col gap-3.5 relative">
          {showMore && contactId !== -1 && 
          <div ref={menuRef} className="absolute top-17 right-12 z-50  bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700  p-1 flex flex-col  animate-fadeIn">
            <div>
              {friend.blockedByUser1 !== user.id_user && friend.blockedByUser2 !== user.id_user ? (
                <button onClick={()=>handleBlock(friend)} className="w-full text-left px-2 py-2 flex items-center gap-1 hover:bg-gray-800 rounded-lg transition-colors duration-150">
                  <MdBlock />
                <h1>block</h1>
              </button>
              ) : (
                <button onClick={()=>handleDeblock(friend)} className="w-full text-left px-2 py-2 flex items-center gap-1 hover:bg-gray-800 rounded-lg transition-colors duration-150">
                  <CgUnblock />
                  <h1>unblock</h1>
                </button>
              )}
            </div>
            <div>
        
              <button onClick={()=>{
                handleUnfriend(friend.id_user , friend.conversation_id)
                setshowMore(false) 
              }} className="w-full text-left px-2 py-2 flex gap-1 items-center hover:bg-gray-800 rounded-lg transition-colors duration-150">
                 <FaUserMinus /> 
                <h1>unfriend</h1>
              </button>
            </div>
            <div className="">
              {!friend.isPinned && 
                <button onClick={()=> handleClick(friend)} disabled={disabled} className={`px-2 py-2 rounded flex items-center gap-1 w-full hover:hover:bg-gray-800 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}>
                  <FontAwesomeIcon icon={faThumbtack} className="text-white" />
                  <h1 className="text-center ">pin</h1>
                </button>
              }
              {friend.isPinned && 
                <button onClick={()=>handleClick(friend)} disabled={disabled} className={`px-2 py-2 rounded flex items-center gap-1 w-full hover:hover:bg-gray-800 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}>
                  <FontAwesomeIcon  icon={faThumbtackSlash} className="text-white " />
                  <h1 className="text-center ">unpin</h1>
                </button>
              }
            </div>
          </div>
          }

            <div className="p-5   max-h-32  min-h-28 overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-lg">
                {contactId > -1 && 
                    <div className="w-full h-full flex justify-between ">
                        <div className="sm:hidden  w-[2rem] flex items-center p-1.5">
                            <GiHamburgerMenu onClick={smallListFriendShow} size={20}/>
                        </div>
                        <div className="w-[80%] flex items-center gap-3.5 p-3 flex-1 ">
                            <img className="min-w-[4rem] w-[25%] lg:w-[10%] xl:w-[10%] 2xl:w-[7%] rounded-[50%] " src={friend?.profile_img}/>
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl md:text-3xl ">{friend?.username}</h1>
                                {
                                    friend?.isTyping ? (
                                      <h1 className="text-green-400">Typing...</h1>
                                    ):
                                    friend.status ?(
                                        <h1 className="text-green-400">Online</h1>
                                    ):(
                                        <h1 className="text-white">Last seen at: {formatMessageTime(friend?.lastseen)}</h1>
                                    )
                                }
                            </div>
                        </div>
                        <div  className="w-[6%] flex justify-center items-center ">
                          <button onClick={handleShowMore} ref={buttonRef}>
                            <RiMore2Fill  className="hover:cursor-pointer"  size={20}/>
                          </button>
                        </div>
                    </div>
                }
                </div>
                <div className="relative h-full rounded-2xl  flex flex-col overflow-hidden inset-shadow-sm inset-shadow-white justify-between"
                  style={{ backgroundImage: "url('https://cdn2.f-cdn.com/contestentries/2046262/58571795/61f00c583e000_thumb900.jpg')" }}>
                    {SmallFriendList && 
                        <div onClick={()=> SetSmallFriendList(false)} className="sm:hidden z-30  absolute bg-black w-full h-full">
                            <FriendList />
                        </div>
                    }

                    <div className="chat-body h-[90%] flex flex-col overflow-scroll no-scrollbar ">
                        <div className="flex justify-center">
                            {
                                contactId > -1 &&
                                <div className="flex w-[90%] sm:w-[80%] lg:w-[25rem] bg-[rgb(168,147,104)]  mt-2 sm:mt-4 p-3 sm:p-4 rounded-[10px] ">
                                    <p className="text-center">
                                        The messages are end to end encrypted. Only people in this chat can read this conversation, so enjoy with your friend.
                                    </p>
                                </div>
                            }
                        </div>
                        {
                          contactId > -1 &&
                          <div className="" >
                          {
                            messages.filter(item => item.conv_id == friends.find(item => item.id_user === contactId).conversation_id).map((item, index) => {
                              const currentDate = item.created_at.split(' ')[0];
                              const prevDate = index > 0 ? messages[index - 1].created_at.split(' ')[0] : null;
                              return (
                                <div key={index} className="flex flex-col  m-1.5">
                                {currentDate !== prevDate && <MessageDateComponent date={item.created_at} />}
                                <div className={`flex ${item.sender === user.id_user ? 'justify-end' : 'justify-start'} mb-2`}>
                                  <div
                                    className={`p-2 sm:p-3 rounded-lg flex flex-col  ${item.sender === user.id_user ? 'bg-[#2E372E] text-white rounded-br-none' : 'bg-[#B0C4DE] text-black rounded-bl-none'}`}
                                    style={{ maxWidth: '85%', minWidth: '100px' }}
                                    >
                                    <p className="break-words text-xs sm:text-sm lg:text-base">{item.message}</p>
                                    <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs">
                                      <span className="whitespace-nowrap">
                                        {new Date(item.created_at).toTimeString().slice(0, 5)}
                                      </span>
                                      {item.sender === user.id_user && (
                                        <div className="ml-2">
                                          {item.isSeen ? <FaCheckDouble color="blue"/> : <FaCheck />}
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
                    <div>
                      {
                        contactId > -1 && (
                          <>
                            {
                              friend.blockedByUser1 === user.id_user || friend.blockedByUser2 === user.id_user  ? (
                              <div className="flex items-center p-3.5 justify-between bg-[#1B1B1B]   ">
                                <div className="flex justify-around w-full h-full items-center px-2">
                                  <p className="text-xs sm:text-sm">
                                    You can't send to this contact. Please deblock first.
                                  </p>
                                </div>
                              </div>
                            ) :  friend.blockedByUser1 === friend.id_user || friend.blockedByUser2 ===  friend.id_user ? (
                              <div className="flex items-center p-3.5 justify-between bg-[#1B1B1B]">
                                <div className="flex justify-around w-full h-full items-center px-2 ">
                                  <p className="text-xs sm:text-sm">
                                    Sorry, you can't send message to this contact
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full flex justify-around items-center p-2.5">
                                <div className="relative">
                                  <button ref={buttonRef} onClick={() => handle_Emojis(setShow, show)}>
                                    <BsEmojiSmile className="w-8 h-8 lg:w-8 lg:h-8" />
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
                                    className="w-full h-10 sm:h-10 lg:h-12 bg-white p-2 sm:p-4 rounded-[20px] sm:rounded-[50px] outline-none text-xs sm:text-sm lg:text-base text-black"
                                    placeholder="Write a Message"
                                    onKeyDown={handleEnterKey}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                  />
                                </div>

                                <div className="mr-2 sm:mr-4">
                                  <button>
                                    <IoGameController className="w-8 h-8 lg:w-8 lg:h-8" />
                                  </button>
                                </div>

                                <div onClick={handleSend} className="mr-2 sm:mr-4">
                                  <IoSend className="w-8 h-8 lg:w-8 lg:h-8 cursor-pointer" />
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