"use client";

import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';
import "../chat/page.css"
import { title } from "process";
import { useUserStore } from '../../../store/userStore';



const LeaderBord = ({users}) =>{
  const user = useUserStore((state) => state.user);
  
  async function  handleAddFriend (object : any){
    

    try {
      await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/sendRequestFriend` , { 
          friend_id: object.id_user
        },{
          headers:{
            Authorization: `Bearer ${user.access_token}`,
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  

  
  return (
    <div className="text-black  w-full h-full  ">

        {
          users.map((item , index)=>(
            <div key={index} className="index w-full mt-0.5 ">
                  <div className="flex">
                    <div className="w-full flex full h-[6rem] bg-gray-100 justify-between">
                      <div className="flex h-full">
                        <div className="flex items-center w-[1rem] ml-1"><p className="text-2xl">{index}</p></div>
                        <div className="flex w-[70px] items-center ml-[0.5rem]"><img className="rounded-[50%]" src={item.profile_img}/></div>
                        <div className="flex w-[70px] items-center ml-[0.5rem]"><p>{item.username}</p></div>
                      </div>
                      <div className="flex w-[40%] h-full ">
                        <div className="w-[40%] flex items-center"><p className="text-2xl">{item.xp}</p></div>
                        {
                          item.friend_status != "friend" && 
                          <div className="flex  w-[77%] items-center "><button onClick={()=>handleAddFriend(item)} className="bg-blue-500 w-full h-[40%] rounded-[10px]">Add friend</button></div>
                        }
                        {
                          item.friend_status == "friend" && 
                          <div className="flex  w-[77%] items-center "><button  className="bg-blue-300 w-full h-[40%] rounded-[10px]">friend</button></div>
                        }
                      </div>
                    </div>
                  </div>
              </div>
          ))
        }
   </div>

);
};



export default function SettingsPage() {
  const [LeaderBord_users, setLeadr] = useState([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user?.username) return;
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/Xprank`,
          {
            params: {
              user: user.username,
            },
          }
        );
        setLeadr(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user?.username]);

  if (!user?.username) return null;

  return (
    <div className="text-white bg-white w-[45%] h-[100%] overflow-scroll">
      <LeaderBord users={LeaderBord_users} />
    </div>
  );
}
