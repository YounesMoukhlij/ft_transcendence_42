'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoPersonCircleOutline, IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { GiPingPongBat } from 'react-icons/gi';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import  {useUserStore}  from '../store/userStore';

import '../app/(protected)/chat/page.css'

export default function Navbar()
{
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(false);
  const [notificatiion, setNotification] = useState([]);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef<HTMLSpanElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const {connect  , init } = useUserStore();
  
  const setUsername = useUserStore.setState;
  const socket = useUserStore((state) => state.socket);
  const {addFriend, removeFriend , setFriends} = useUserStore();

  
  
  const user = useUserStore((state) => state.user);



  useEffect(() => {
    setUsername({username: user?.username});
  }, []);



  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  async function DelteFriendRequest(notify_id){
    toast.error('Deleted');
    setNotification(notificatiion => notificatiion.filter(item => item.notify_id !== notify_id));
    await axios.delete(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/DeleteFriendRequest` , {
      params:{
        id: notify_id,
      },
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
  }

  async function AcceptFriendRequest(item : any){

    toast.success('Accepted');

    const object = {
      profile_img: item.sender_profile_img,
      username: item.sender_username,
      fullname:"say hello",
      id_user: item.sender_user,
      status:0,
    }
    const res = await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/AddFriend`,{
      Freind_id: item.sender_user ,
    },{
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    }
  );
  if (res.status === 200)
    addFriend(object);
  
  setNotification(notificatiion => notificatiion.filter(items => items.notify_id !== item.notify_id));
    await axios.delete(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/DeleteFriendRequest` , {
      params:{
        id: item.notify_id,
      },
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
  };


  function showNotification(){
    setNotificationIndex(!notificationIndex);
    SetunseenCount(0);
    // setTimeout(() => {
    //   setNotificationIndex(false);
    // }, 5000);

    try{
      axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/NotificationSeen`,
      {},
      {
        headers:{
          Authorization: `Bearer ${user.access_token}`
        }
      }
    );
    }catch(err){

    }
  }



  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };


  useEffect(() => {

    if (!user)
        return ;
    async function get_notify() {
      try {
        const result = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/GetNotification`,
          {
            headers:{
              Authorization: `Bearer ${user.access_token}`,
            }
          }
        );
        setNotification(result.data.reverse());
        console.log(result.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    }
    get_notify();

  }, [user]);

  useEffect( ()=>{
    connect();
  }, [])

  const [unseenCount , SetunseenCount] = useState(0);

  useEffect(()=>{
    SetunseenCount (notificatiion.filter(n => !n.is_seen).length);
  },[notificatiion])

  useEffect(() => {

    if (!socket) return;
  
    const handleNotify = (event: MessageEvent) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "notify") {
        console.log(data);
        setNotification(prev => [{ 
          sender_user: data.sender_user,
          title: data.title,
          sender_username: data.sender_username,
          sender_profile_img: data.sender_profile_img,
          notify_id: data.notify_id
         },
        ...prev
      ]);
      }
    };
  
    socket.addEventListener("message", handleNotify);
  
    return () => {
      socket.removeEventListener("message", handleNotify);
    };
  }, [socket]);
  


  // Close mobile menu when clicking outside the list
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        hamburgerRef.current &&
        !(hamburgerRef.current as HTMLElement).contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const sidebarItems = [
    { path: '/game', icon: <IoGameControllerOutline className="text-white text-2xl" />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline className="text-white text-2xl" />, alt: 'Chat' },
    { path: '/profile', icon: <IoPersonOutline className="text-white text-2xl" />, alt: 'Profile' },
    { path: '/settings', icon: <IoSettingsOutline className="text-white text-2xl" />, alt: 'Settings' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav className="m-2 md:m-[10px] p-2 md:p-3 z-50 h-[10vh] bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-center gap-1 md:gap-2">
            {/* <GiPingPongBat
              className="text-white w-15 h-15  cursor-pointer animate-spin"
              style={{
                animation: 'spin 6s linear infinite'
              }}
            /> */}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex flex-row items-center justify-center gap-2 md:gap-5">
            <div className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400">
              <IoSearchOutline className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8  cursor-pointer hover:scale-125 transition-all duration-400" />
            </div>
          {notificationIndex && (
    <div className=" testt z-50 absolute flex flex-col top-22 right-30 h-52 w-96 rounded-2xl bg-black text-white border-2 overflow-y-scroll gap-2 p-2 ">
    {notificatiion.length === 0 ? (
      <div className="text-center text-gray-400 py-6 text-lg font-medium">
        No notifications
      </div>
    ) : (
      [...notificatiion]
        .map((item, index) => {
          if (item.title === "game challenge") {
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-700 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 transition"
              >
                <img
                  src={item.sender_profile_img}
                  alt="profile"
                  className="w-12 h-12 rounded-full border border-gray-600"
                />
                <div className="flex flex-col flex-1">
                  <p className="text-lg font-semibold text-white">
                    {item.sender_username}
                  </p>
                  <p className="text-sm text-gray-400">
                    invited you to a{" "}
                    <span className="text-blue-400 font-medium">1 vs 1 game</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => AcceptGameChallenge(item)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => RejectGameChallenge(item.notify_id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          }

          if (item.title === "friend request accepted") {
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-green-700 bg-green-900/20 rounded-xl hover:bg-green-800/30 transition"
              >
                <img
                  src={item.sender_profile_img}
                  alt="profile"
                  className="w-12 h-12 rounded-full border border-green-500"
                />
                <div className="flex flex-col">
                  <p className="text-white text-lg font-medium">
                    {item.sender_username}
                  </p>
                  <p className="text-green-400 text-sm">
                    accepted your friend request 
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="flex flex-col border-t border-gray-700 py-3 px-2 bg-black/40 hover:bg-black/60 rounded-xl transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.sender_profile_img}
                    alt="profile"
                    className="w-12 h-12 rounded-full border border-gray-600"
                  />
                  <p className="text-white text-lg ml-3">
                    {item.sender_username}
                  </p>
                </div>
                <p className="text-gray-400 text-sm">
                  {item.timeAgo || "1d"}
                </p>
              </div>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => AcceptFriendRequest(item)}
                  className="w-[48%] bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg border border-green-400"
                >
                  Confirm
                </button>
                <button
                  onClick={() => DelteFriendRequest(item.notify_id)}
                  className="w-[48%] bg-gray-100 hover:bg-gray-200 text-black py-1.5 rounded-lg border border-white"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
    )}
  </div>
)}

          <div className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400">
              <IoNotificationsOutline onClick={showNotification} className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 transition-all duration-400" />
              <div className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'><p>{unseenCount}</p></div>
            </div>
            <div className="relative  border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400" ref={dropdownRef}>
              <span ref={profileIconRef}>
                <IoPersonCircleOutline
                  className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8  cursor-pointer hover:scale-125 transition-all duration-400"
                  style={{ cursor: 'pointer' }}
                />
              </span>
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden relative" ref={hamburgerRef}>
            <button
              onClick={toggleMobileMenu}
              className="relative  p-3 bg-black cursor-pointer hover:scale-125 transition-all duration-400"
            >
              {mobileMenuOpen ? (
                <IoCloseOutline className="text-white h-8 w-8" />
              ) : (
                <IoMenuOutline className="text-white h-9 w-9" />
              )}
            </button>

            {/* Mobile Menu Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-64 bg-black border-2 border-white rounded-lg p-4 z-50 transition-all duration-300 ease-in-out transform ${
                mobileMenuOpen
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Sidebar Items */}
                <div className="border-b border-gray-600 pb-4">
                  <h3 className="text-white text-sm font-semibold mb-3">Navigation</h3>
                  <div className="flex flex-col gap-3">
                    {sidebarItems.map((item, index) => (
                      <Link href={item.path} key={item.path} onClick={() => setMobileMenuOpen(false)}>
                        <div
                          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ${
                            mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          {item.icon}
                          <span className="text-white">{item.alt}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navbar Right Section Items */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-3">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '500ms'
                      }}
                    >
                      <IoPersonCircleOutline className="text-white text-xl" />
                      <span className="text-white">Profile</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '600ms'
                      }}
                    >
                      <IoSearchOutline className="text-white text-xl" />
                      <span className="text-white">Search</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '700ms'
                      }}
                    >
                      <IoNotificationsOutline   className="text-white text-xl " />
                      <span className="text-white">Notifications</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '800ms'
                      }}
                    >
                      <IoLogOutOutline className="text-white text-xl" />
                      <span className="text-white">Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}