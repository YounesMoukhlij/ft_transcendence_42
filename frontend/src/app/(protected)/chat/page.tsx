"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './page.css'
import { FaSearch } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import  {useUserStore}  from '../../../store/userStore';
import getFormattedDate from './tools'
import { stat } from 'fs';
import { GiCheckMark } from "react-icons/gi";
import { HiXMark } from "react-icons/hi2";


interface Friend {
  id_user: string,
  username: string;
  profile_img: string;
  LastMessage: string;
  LastMessageTime: string;
  status: boolean;
}

interface Message {
  sender: string;
  conv_id: string;
  message: string;
  created_at: string;
  isSeen: boolean;
}

function handle_Emojis(setShow: React.Dispatch<React.SetStateAction<boolean>>, show: boolean) {
  setShow(!show)
}


async function fetchData(friend_id: string , title: string, setDboubleBlock: (num: number) => void,  Setuser_block: (user: string) => void ): Promise<Message[] | undefined> {
  const { user , updateLastMessage} = useUserStore.getState();

  localStorage.setItem('room_select', title);
  localStorage.setItem('friend_id' , friend_id);
  try {
    const convRes = await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getConversationId`,{
      friend_id: friend_id
    },
    {
        headers: {
          Authorization: `Bearer ${user.access_token}`
        }
    }
  );

    localStorage.setItem('conversationId', convRes.data.conversation_id);
    setDboubleBlock(convRes.data.is_double_block);
    Setuser_block(convRes.data.block_user);

    const msgsRes = await axios.post(
      `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getMsgs`,
      { id: convRes.data.conversation_id }
    );

    updateLastMessage(msgsRes.data[msgsRes.data.length - 1]?.message);
    return msgsRes.data;
  } catch (err) {
    console.error('Error fetching conversation or messages:', err);
  }
}

type FreindsListProps = {
  id_user: string,
  friend_id: string,
  photo: string;
  title: string;
  message: string;
  status: boolean;
  setConversation: (messages: Message[]) => void;
  setRoom: (room: string) => void;
  setimg: (img: string) => void;
  SetSelectContact: (selected: boolean) => void;
};

const FreindsList = ({friend_id ,  photo, title, message = "test", status, setConversation, setRoom, setimg, SetSelectContact  }: FreindsListProps) => {
  const { setDboubleBlock, double_block, Setuser_block, user_block , } = useUserStore();


  
  const Get_Conversation = async () => {
    setRoom(title);
    setimg(photo);
    SetSelectContact(true);
    const conversation = await fetchData(friend_id , title, setDboubleBlock, Setuser_block);
    if (conversation) {
      setConversation(conversation);
    }
  };
  

  return (
    <div onClick={Get_Conversation} className="flex w-full h-full hover:flex hover:cursor-pointer hover:bg-[#515151] hover:backdrop-blur-[10px] hover:rounded-[20px]">
      <div className="flex-col pl-2 pt-4">
        <div className='flex w-12 h-12 sm:w-15 sm:h-15 md:w-16 md:h-16 lg:w-15 lg:h-15 2xl:w-20 2xl:h-20'>
          <img className="w-12 h-12 sm:w-15 sm:h-15 md:w-16 md:h-16 lg:w-15 lg:h-15 2xl:h-20 2xl:w-20 rounded-[50%]" src={photo} />
        </div>
        <div className={status ? "test w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-[green] rounded-[50%] " : "test w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-[red] rounded-[50%] "}></div>
      </div>
      <div className="flex flex-col justify-center gap-2 pl-[5%] sm:pl-[10%]">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
          <h1>{title}</h1>
        </div>
        <div className='last-message'>
          <p className="text-xs sm:text-sm md:text-base">
            {message?.length > 30 ? message.substr(0, 20) + "..." : message}
          </p>
        </div>
      </div>
    </div>
  );
};

interface Test1Props {
  friends: Friend[];
  setMessages: (messages: Message[]) => void;
  setRoom: (room: string) => void;
  setImg: (img: string) => void;
  SetSelectContact: (selected: boolean) => void;

}

function Test1({ friends, setMessages, setRoom, setImg, SetSelectContact }: Test1Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="italic text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] p-[5px]">Chats</h1>
      </div>
      <div className="flex justify-around self-center w-[90%] rounded-[2rem] border-2 border-solid">
        <input
          className="text-[16px] sm:text-[20px] md:text-[22px] lg:text-[25px] w-4/5 h-[3rem] sm:h-[3.5rem] md:h-[4rem] lg:h-[4.5rem] pl-4 outline-none"
          placeholder="Search for a friend"
          value={searchTerm}
          onChange={handleChange}
        />
        <button className="button">
          <FaSearch className="text-[rgb(179,173,173)]" size={20} />
        </button>
      </div>
    <div className="body-of-chat flex flex-col overflow-scroll bg-black rounded-[40px] scrollbar-hide h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[48vh]">
    {searchTerm.length > 0
      ? (
        [...friends].filter(friend => friend.username.toLowerCase().startsWith(searchTerm.toLowerCase()))
        .sort((a, b) => a.username.localeCompare(b.username))
        .map((friend, index) => (
          <div key={index}>
            <FreindsList
              friend_id={friend.id_user}
              photo={friend.profile_img}
              title={friend.username}
              message={friend.LastMessage}
              status={friend.status}
              setConversation={setMessages}
              setRoom={setRoom}
              setimg={setImg}
              SetSelectContact={SetSelectContact}
            />
          </div>
        ))
      ): ([...friends].sort((a, b) => new Date(b.LastMessageTime || 0) - new Date(a.LastMessageTime|| 0)) .map((friend, index) => (
          <div key={index}>
            <FreindsList
              friend_id={friend.id_user}
              photo={friend.profile_img}
              title={friend.username}
              message={friend.LastMessage}
              status={friend.status}
              setConversation={setMessages}
              setRoom={setRoom}
              setimg={setImg}
              SetSelectContact={SetSelectContact}
            />
          </div>
        )))
      }
      </div>
    </div>
  );
}

interface MessageDateComponentProps {
  date: string;
}

function MessageDateComponent({ date }: MessageDateComponentProps) {
  const currentDate = date?.split(' ')[0];
  return (
    <div className="flex items-center justify-center my-2">
      <div className="flex-grow border-t border-gray-300" />
      <span className="mx-3 text-xs text-gray-500">{currentDate}</span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
}

interface EmojiClickData {
  emoji: string;
}

export default function ChatPage() {
  const { friends, addFriend, removeFriend, setFriends, updateFriendStatus, updateLastMessage } = useUserStore();
  const { messages, setMessages, addMessage, room, setRoom, profile_img, setImg } = useUserStore();
  const { setDboubleBlock, double_block, Setuser_block, user_block } = useUserStore();
  const { connect, socket } = useUserStore();
  const [show, setShow] = useState<boolean>(false);
  const [input, setEmoji] = useState<string>('');
  const [dropmenu, setdropmenu] = useState<boolean>(false);
  const [confirm_invite, setConfirm] = useState<boolean>(false);
  const [display_chats, set_chats] = useState<boolean>(false);
  const [Display_game_invite, Set_Display_game_invite] = useState<boolean>(false);
  const [SelectContact, SetSelectContact] = useState<boolean>(false);


  const [Inviter_username, setInviter_usernmae] = useState<string>('');
  const [Inviter_img , SetInvater_img] =  useState<string>(''); 
  const user = useUserStore((state) => state.user);


  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      
      const { type, data } = JSON.parse(event.data);
      if (type === "message") {
        addMessage(data);
        updateLastMessage(data.message, data.user);
      }
      else if (type === "block") {
        setDboubleBlock(data.is_double_block);
        Setuser_block(data.block_user);
      } else if (type === "unfriend") {
        removeFriend(data.username);
        SetSelectContact(false);
      } else if (type === "status") {
        updateFriendStatus(data.status, data.friend);
        console.log(data);
      }
      else if (type === "game_invite") {
        Set_Display_game_invite(true);
        setInviter_usernmae(data.username);
        SetInvater_img(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}` +  data.img);
        setTimeout(() => {
          Set_Display_game_invite(false);
        }, 5000);
          
      }
      else if (type === "test") {
        addFriend(data);
      }
      else if (type === "start_game") {
        <Link href="/game" key="/game"></Link>
      }
    };
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/GetFriends`, {
          params: { username: user.username }
        });


        setFriends(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    }, [user?.username]);

  function handleEnterKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSend();
    }
  }
  
  async function handleBlock(
    friend: string, 
    setDboubleBlock: (num: number) => void, 
    double_block: number, 
    Setuser_block: (user: string) => void, 
    user_block: string
  ) {
    
    const id = window.localStorage.getItem('conversationId');
    const friend_id = localStorage.getItem("friend_id");
    if (double_block == 2 || (double_block == 1 && user_block === user.username))
      return;
    await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/block`, {
      user: user.username,
      conv_id: id,
      friend: friend, 
      friend_id: friend_id
    });
    Setuser_block(user.username || '');
    if (double_block < 2)
      setDboubleBlock(double_block + 1);
  }

  async function Deblock(
    friend: string, 
    setDboubleBlock: (num: number) => void, 
    double_block: number, 
    Setuser_block: (user: string) => void, 
    user_block: string
  ) {

    const friend_id = localStorage.getItem("friend_id");
    const id = localStorage.getItem('conversationId');
    await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/Deblock`, {
      user: user.username,
      conv_id: id,
      friend: friend,
      friend_id: friend_id 

    });
    
    
    if (double_block > 0) {
      if (double_block === 2) {
        setDboubleBlock(1);
        Setuser_block(friend);
      }
      else if (double_block === 1) {
        setDboubleBlock(0);
        Setuser_block('');
      }
    }
  }

  async function handleUnfriend(friend: string, removeFriend: (username: string) => void) {
    const id = window.localStorage.getItem('conversationId');
    SetSelectContact(false);
    const friend_id = localStorage.getItem("friend_id");
    await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/unfriend`, {
      user: user.username,
      conv_id: id,
      friend: friend,
      friend_id: friend_id
    });
    removeFriend(friend);
  }

  const handleSend = async () => {
    if (input.trim().length == 0){
      setEmoji('');
      return;
    }
    const friend = localStorage.getItem('room_select');
    const friend_id = localStorage.getItem('friend_id');
    const id = localStorage.getItem('conversationId');
    try {
      const data = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/IsOnline`, {
        params: {
          username: friend
        }
      })

      const res = await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/sendMsg`, {
          user:user.username,
          input, id, friend , friend_id
        },{
          headers: {
            Authorization: `Bearer ${user.access_token}`
        }
    }
      );
      const object: Message = {
        sender: user.id_user || '',
        message: input,
        conv_id: id || '',
        created_at: getFormattedDate(),
        isSeen: data.data
      };
      addMessage(object);
      updateLastMessage(input, friend || '');

    } catch (err) {
      console.error(err);
    }
    setEmoji('');
  }

  function handle_chats_display() {
    set_chats(!display_chats);
  }

  function handle_dropmenu() {
    setdropmenu(!dropmenu);
    
    setTimeout(() => {
      setdropmenu(false);
    }, 5000);
  }

  function handle_confirm_invite() {
    setConfirm(true);
    
    setTimeout(() => {
      setConfirm(false);
    }, 5000);
  }

  function move_emoji_to_input(object: EmojiClickData) {
    setShow(false);
    setEmoji(prevValue => prevValue + object.emoji);
  }

  useEffect(() => {
    const chatContainer = document.querySelector('.chat-body');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);



  function Cancel(){
    Set_Display_game_invite(false);
  }

  function send_game_invite(friend : string){
    try{
        setConfirm(false);
        const res = axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/sendGameChallenge` , {
            Friend_id: friend,
          },{
          headers: {
            Authorization: `Bearer ${user.access_token}`
          },
        });
      }catch(err){

      }
  }

  return (
    <>
    <div className="flex justify-center items-center h-[89vh] text-white px-2 sm:px-4 lg:px-0">
      <div className="flex w-[100vh] h-[90vh] sm:h-[95vh] lg:w-4/5 lg:h-4/5 gap-[2%] sm:gap-[3%] lg:gap-[5%] ">
        <div className="w-full  sm:w-2/5 lg:w-1/3 xl:w-1/4 h-full hidden lg:flex flex-col border bg-black p-2 rounded-[35px] border-solid">
          <Test1
            friends={friends}
            setMessages={setMessages}
            setRoom={setRoom}
            setImg={setImg}
            SetSelectContact={SetSelectContact}
          />
        </div>
        <div className="flex self-start lg:hidden fixed top-4 left-4 z-50">
          <button onClick={handle_chats_display} className="p-2 mt-10 bg-amber-700  rounded-lg">
            <FaArrowRight />
          </button>
        </div>
        
        {display_chats && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={handle_chats_display}></div>
            <div className="absolute left-0 top-0 w-4/5 sm:w-3/5 h-full flex flex-col border bg-[black] p-2 rounded-r-[35px] border-solid">
              <Test1
                friends={friends}
                setMessages={setMessages}
                setRoom={setRoom}
                setImg={setImg}
                SetSelectContact={SetSelectContact}
              />
            </div>
          </div>
        )}
        
        
        <div className=" relative flex w-full lg:w-2/3 xl:w-3/4 flex-col border rounded-[35px] border-solid bg-black overflow-hidden ">
          {Display_game_invite && (
            <div className="z-50 absolute flex flex-col w-full bg-gray-600 border-2 rounded-3xl overflow-hidden shadow-lg p-3 sm:p-4 items-center justify-between">


              <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                <img
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mr-3"
                  src={Inviter_img}
                  alt="Inviter"
                />
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white text-center sm:text-left">
                  {Inviter_username} invited you for a 1 vs 1 game
                </p>
              </div>
          
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-end w-full sm:w-auto">
                <Link href="/game" key="/game">
                  <button className="bg-green-500 hover:bg-green-600 transition border-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center">
                    <GiCheckMark size={24} className="sm:size-28 md:size-30 text-white" />
                  </button>
                </Link>
                <button
                  onClick={Cancel}
                  className="bg-red-500 hover:bg-red-600 transition border-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center">
                  <HiXMark size={24} className="sm:size-28 md:size-30 text-white" />
                </button>
              </div>
            </div>
          )}

          {SelectContact && (
            <div className="flex items-center h-[8%] sm:h-[9%] rounded-t-[35px] ml-0.5 bg-[#3a3638] justify-between px-2 sm:px-4">
              <div className="flex h-3/5 self-center">
                <img 
                  className="rounded-[50%] w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" 
                  src={profile_img || undefined} 
                  alt='image'
                />
                <p className="self-center text-[0.8rem] sm:text-[1rem] md:text-[1.2rem] lg:text-[1.5rem] pl-[1rem]">
                  {room}
                </p>
              </div>
              
              <div className="relative">
                <button className="flex p-2" onClick={handle_dropmenu}>
                  <SlOptions className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                </button>
                {dropmenu && (
                  <div className="absolute right-0 top-12 z-50">
                    <div className="flex flex-col w-24 sm:w-28 lg:w-32">
                      <div className="w-full h-10 border border-solid bg-black hover:bg-amber-400 text-xs sm:text-sm">
                      {
                      (double_block === 1 && user_block === user.username) || double_block === 2 ? (
                          <button
                            className="w-full h-full" onClick={() => Deblock(room, setDboubleBlock, double_block, Setuser_block, user_block) }>
                            Deblock
                          </button>
                        ) : (
                          <button
                            className="w-full h-full"
                            onClick={() => handleBlock(room, setDboubleBlock, double_block, Setuser_block, user_block)}>Block
                          </button>
                       )
                      }
                      </div>
                      <div className="w-full border h-10 border-solid text-center bg-black hover:bg-amber-400 text-xs sm:text-sm">
                        <button  className='w-full h-full' onClick={() => handleUnfriend(room, removeFriend)}>
                          Unfriend
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={`chat-body flex w-full flex-col overflow-scroll bg-[black] rounded-b-[40px] ${SelectContact ? 'h-[83%] sm:h-[85%]' : 'h-full'} px-2 sm:px-4 ${confirm_invite ? "blur-[15px]" : ""}`}>
            {!SelectContact && (
              <div className='flex flex-col items-center justify-center w-full h-full text-center'>
                <h3 className="text-sm sm:text-base lg:text-lg mb-4">
                  Please select an item to see your conversations.
                </h3>
                <img className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64" src="/animation.gif" alt="animation" />
              </div>
            )}
            {messages?.length > 0 && SelectContact && (
              <div className="flex w-[90%] sm:w-[80%] lg:w-[25rem] bg-[rgb(168,147,104)] self-center mt-4 sm:mt-8 p-3 sm:p-4 rounded-[10px]">
                <p className="text-xs sm:text-sm">
                  The messages are end to end encrypted. Only people in this chat can read this conversation, so enjoy with your friend.
                </p>
              </div>
            )}
            {SelectContact && messages.map((item, index) => {
              if (item.conv_id == localStorage.getItem('conversationId')) {
                const currentDate = item.created_at.split(' ')[0];
                const prevDate = index > 0 ? messages[index - 1].created_at.split(' ')[0] : null;
                return (
                  <div key={index} className="flex flex-col  ">
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
                              {item.isSeen ? <FaCheckDouble /> : <FaCheck />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          {SelectContact && (
            <>
              {double_block === 2 ? (
                <div className="flex items-center h-[9%] sm:h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-2 sm:pl-4 rounded-b-[35px]">
                  <div className="flex justify-around w-full h-full items-center px-2">
                    <p className="text-xs sm:text-sm">You can't send to this contact. Please deblock first.</p>
                    <button 
                      onClick={() => Deblock(room, setDboubleBlock, double_block, Setuser_block, user_block)} 
                      className="h-[1.5rem] w-[5rem] sm:h-[2rem] sm:w-[7rem] bg-white text-black rounded-[8px] text-xs sm:text-sm"
                    >
                      Deblock
                    </button>
                  </div>
                </div>
              ) : double_block === 1 && user_block === user.username ? (
                <div className="flex items-center h-[9%] sm:h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-2 sm:pl-4 rounded-b-[35px]">
                  <div className="flex justify-around w-full h-full items-center px-2">
                    <p className="text-xs sm:text-sm">You can't send to this contact. Please deblock first.</p>
                    <button 
                      onClick={() => Deblock(room, setDboubleBlock, double_block, Setuser_block, user_block)} 
                      className="h-[1.5rem] w-[5rem] sm:h-[2rem] sm:w-[7rem] bg-white text-black rounded-[8px] text-xs sm:text-sm"
                    >
                      Deblock
                    </button>
                  </div>
                </div>
              ) : double_block === 1 && user.username !== user_block ? (
                <div className="flex items-center h-[9%] sm:h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-2 sm:pl-4 rounded-b-[35px]">
                  <div className="flex justify-around w-full h-full items-center">
                    <p className="text-xs sm:text-sm">Sorry You can't send message to this contact</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center h-[9%] sm:h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-2 sm:pl-4 rounded-b-[35px]">
                  
                  <div className="relative">
                    <button onClick={() => handle_Emojis(setShow, show)}>
                      <BsEmojiSmile className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                    </button>
                    {show && (
                      <div className="absolute left-0 bottom-12 sm:left-[10%] sm:bottom-16 z-50">
                        <EmojiPicker onEmojiClick={move_emoji_to_input} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 mx-2 sm:mx-4">
                    <input
                      className="w-full h-8 sm:h-10 lg:h-12 bg-black p-2 sm:p-4 rounded-[20px] sm:rounded-[50px] outline-none text-xs sm:text-sm lg:text-base"
                      placeholder="Message"
                      onKeyDown={handleEnterKey}
                      value={input}
                      onChange={(e) => setEmoji(e.target.value)}
                    />
                  </div>
                  <div className="mr-2 sm:mr-4">
                    <button onClick={handle_confirm_invite}>
                      <IoGameController className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                    </button>
                  </div>
                  <div className="mr-2 sm:mr-4">
                    <IoSend onClick={handleSend} className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 cursor-pointer" />
                  </div>
                  {confirm_invite && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 px-4">
                      <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(false)}></div>
                      <div className="relative flex flex-col justify-between w-full max-w-sm sm:max-w-md lg:max-w-lg h-32 sm:h-36 bg-gray-500 text-center border p-3 sm:p-4 rounded-2xl border-solid">
                        <p className="text-xs sm:text-sm lg:text-base">
                          You are about to request a game session with {room}
                        </p>
                        <div className="flex items-end justify-between h-1/2 px-2">
                          <div className="text-center w-[45%] h-[70%] border bg-[rgb(201,49,38)] flex justify-center rounded-2xl border-solid items-center">
                            <button onClick={() => setConfirm(false)} className="w-full h-full text-xs sm:text-sm">
                              Cancel
                            </button>
                          </div>
                          <div className="text-center border h-[70%] w-[45%] bg-[rgb(14,154,54)] flex justify-center  rounded-2xl border-solid items-center">
                              <button onClick={() => send_game_invite(localStorage.getItem('friend_id')) } className="text-xs sm:text-sm w-full h-full">Confirm</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );

}


