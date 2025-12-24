"use client";

import { useEffect, useState } from 'react';



import FriendList from './FriendList';
import Messages from './Messages'
import FriendCard from './FriendCard'

export default function ChatPage() {
  
  const [openSetting , setOpenSetting] = useState<boolean>(false);
  return (
    <div className=' w-full h-full  flex gap-3.5 justify-center '>
      <div className='hidden md:w-[35%] lg:w-[30%]  xl:w-[20%] sm:flex flex-col gap-3.5  '>
        <FriendList/>
      </div>
      <div className='w-[90%] md:w-[65%] lg:w-[70%] xl:w-[60%] '>
        <Messages />
      </div>
      <div className='hidden 2xl:flex md:max-w-[20%] '>
        <FriendCard />
      </div>
    </div>
  )

}


