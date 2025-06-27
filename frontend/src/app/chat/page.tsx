
"use client";
import axios from 'axios';
import { useState , useEffect } from 'react';
import Link from 'next/link';
import './page.css'
import { FaSearch } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";




function handle_Emojis(setShow: any , show: boolean ){
  setShow(!show)
}


type FreindsListProps = {
  photo: string,
  title: string,
  message: string,
  status: number,
  setConversation: any
  setroom: any
  setimg: any
};

const fetchData = async (title:string) => {
  try {
    const user = localStorage.getItem('name');
    const res = await axios.post('http://localhost:4444/getConversation', { user, friend: title });
    return (res.data);
  } catch (err) {
    console.error(err);
  }
};


const FreindsList = ({  photo ,title , message , status, setConversation}:FreindsListProps) =>{
  function Get_Conversation (){
    setConversation(messgae);

  }
  return (
    <div onClick={Get_Conversation}  className="flex w-full h-full hover:flex hover:cursor-pointer hover:bg-[#515151] hover:backdrop-blur-[10px] hover:rounded-[20px]">
      <div className="flex-col pl-2 pt-4">
        <div className='flex w-20 h-20 '>
          <img className="w-20 rounded-[50%]" src={photo}/>
        </div>
        <div className={status === 1 ? "test w-5 h-5 bg-[green] rounded-[50%] " : "test w-5 h-5 bg-[red] rounded-[50%] "} ></div>
      </div>

      <div className="flex flex-col justify-center gap-2 pl-[10%]">
        <div className="text-3xl"><h1>{title}</h1></div>
        <div className='last-message'>
          <p>{message.length > 30 ? message.substr(0, 26) + "..." : message}</p>

        </div>
    </div>
    </div>
  );
};



export default function chatPage() {

  const [array, setFriend] = useState([]);
  const [messages, setMessages] = useState([]);
  const [show , setShow] = useState(false);
  const [input , setEmoji] = useState('');
  const [dropmenu , setdropmenu] = useState(false);
  const [confirm_invite , setConfirm] = useState(false)

    function handleEnterKey(event){
    if (event.key === 'Enter') {
      handleSend();
    }
  }

  function handleSend(){
    if (input.length == 0)
      return ;
    setMessages(prev => [...prev, {id: "1", sender: "abechchssa", ms: input}]);
    setEmoji('');
  }
  function handle_confirm_button(){
    setConfirm(false);
  }
  function handle_cancel_invite(){
    setConfirm(false);
  }

  function handle_dropmenu(){
    setdropmenu(!dropmenu);
  }

  function handle_confirm_invite(){
    setConfirm(true);
  }


  type objectOfEmoji = {
    emoji: string;
  };

  function move_emoji_to_input(object: objectOfEmoji){
    setShow(false);
    setEmoji(prevValue => prevValue + object.emoji);
  }

  return (
    <div className="border-2 border-white text-white flex justify-center items-center h-[100%] w-[100%]">
      <div className=" flex w-5/5 h-5/5 md:w-4/5 md:h-4/5 gap-[5%] ">
           <div className="w-1.5/5 h-full hidden md:flex flex-col border bg-[black] p-2 rounded-[35px] border-solid ">

            <div className="flex flex-col ">
              <div><h1 className='italic text-[70px] p-[5px]'>Chats</h1></div>
              <div className="flex justify-around self-center w-[90%] rounded-[2rem] border-2 border-solid">
                  <input className="text-[25px] w-4/5 h-[4.5rem] pl-4 outline-none" placeholder='Search for a friend' />
                  <button className='button'><FaSearch  className="text-[rgb(179,173,173)]" size={24}/></button>
              </div>
            </div>

              <div className="body-of-chat flex flex-col  overflow-scroll bg-black rounded-[40px] scrollbar-hide">

                  {array.map((friend , index) => (
                  <div key={index} >
                      <FreindsList
                      photo={friend.profile_img}
                      title={friend.username}
                      message={friend.fullname}
                      status={friend.status}
                      setConversation={setMessages}
                      setroom={setRoom}
                      setimg={setImg}
                      />
                  </div>
                  ))}
              </div>
          </div>




            <div className="flex items-center h-[9%] rounded-[40px] ml-0.5 bg-blue-950 justify-between">
              <div className="flex h-3/5 sm:h-3/5 self-center sm:pl-[2%] ml-1.5"><img className="rounded-[50%]" src='https://www.w3schools.com/howto/img_avatar2.png'/></div>
              <div className=" mr-[2rem] w-21 h-10">
                <button className="flex pr-[4%]" onClick={handle_dropmenu}><SlOptions className="sm:w-10 sm:h-10  w-5 h-5"/></button>
                { dropmenu &&
                  <div className="fixed flex flex-col w-28 self-">
                    <div className="w-[70%] h-[50%] sm:w-full sm:h-full border p-[0.7rem]  border-solid sm:text-center bg-black hover:bg-amber-400"><button className="">Block</button></div>
                    <div className="w-[70%] h-[50%] sm:w-full sm:h-full border p-[0.7rem]  border-solid sm:text-center bg-black hover:bg-amber-400"><button className="">Unfriend</button></div>
                  </div>
                }
              </div>
            </div>


             <div className={`chat-body flex flex-col overflow-scroll bg-[black] rounded-[40px] h-[85%] px-4 ${confirm_invite ? "blur-[15px]" : ""}`}>
                { messages.length > 0 && <div className="flex w-[80%] sm:w-[25rem] bg-[rgb(168,147,104)] self-center mt-8 p-4 rounded-[10px]"><p>The messages are end to end encrypted only people in this chat can read this conversation so enjoy with you friend</p></div>}
              {
                messages.map((item , index)=>(
                  <div key={index}
                  className="flex flex-col flex-wrap pt-8"><p className={item.sender == 'abechcha' ? "flex self-start bg-[#B0C4DE] text-[black] w-fit max-w-[600px] pl-2 p-2.5 rounded-[10px] break-all text-wrap" : "flex self-end bg-[#2E372E] w-fit max-w-[600px] pl-2 p-2.5 rounded-[10px] break-all" }>{item.ms}</p></div>
                ))
              }
              </div>
            {messages.length > 0 &&
            <div className="flex items-center h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-4 rounded-[40px]">
                <div className="pl-4">
                    <button  onClick={()=> handle_Emojis(setShow , show)}><BsEmojiSmile className="sm:w-10 sm:h-10  w-5 h-5"/></button>
                    {show && <div className="absolute left-[34%] top-[60%]"><EmojiPicker onEmojiClick={move_emoji_to_input}/></div>}
                  </div>
                  <div className=" w-[90%] h-10 sm:h-16 px-4 py-0">
                    <input className="w-full h-full bg-[black] p-4 rounded-[50px] outline-none" placeholder='Message ' onKeyDown={handleEnterKey} value={input} onChange={(e) => setEmoji(e.target.value)}/>
                  </div>
                  <div className="pr-4"><button onClick={handle_confirm_invite}><IoGameController className="sm:w-10 sm:h-10  w-5 h-5"/></button></div>
                  <div className="flex px-6 py-0"><IoSend onClick={handleSend} className="sm:w-10 sm:h-10  w-5 h-5"/></div>
                  {confirm_invite &&
                    <div className="flex flex-col justify-between absolute w-[22rem] h-36 bg-[gray] text-center border p-2 rounded-2xl border-solid left-[calc(50%)] top-[calc(50%)]">
                      <p>You are about to request a game sesstion with zalaksya</p>
                      <div className="flex items-end justify-between h-3/6 px-2 py-0">
                        <div className="text-center w-[48%] h-[70%] border bg-[rgb(201,49,38)] p-2 rounded-2xl border-solid"><button onClick={handle_cancel_invite} > Cancel</button></div>

                          <div className="text-center border h-[70%] w-[48%] bg-[rgb(14,154,54)] p-2 rounded-2xl border-solid">
                          <Link href="/game" key="/game"><button>Confirm</button></Link>
                          </div>
                      </div>
                    </div>
                  }
            </div>
            }
          </div>
      </div>
    </div>
  );
}
