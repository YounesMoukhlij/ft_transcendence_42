
"use client";
import { useEffect, useState } from "react";
import axios from 'axios';
import "../chat/page.css"
import { title } from "process";
import { globalStore } from '../../components/globalStore';



const LeaderBord = ({users}) =>{
  
  async function  handleAddFriend (username){
    const sender = localStorage.getItem('name');
    try {
      await axios.post('http://localhost:4444/sendRequestFriend' , { sender, friend: username , title:"request friend"});
    } catch (err) {
      console.log(err);
    }
  }
  
  
  const newObject = users.slice(3);
  
  return (
    <div className="text-black  w-full h-full  ">

        <div className="flex w-full h-[50%] justify-center items-end  bg-white gap-[0.5rem] pb-[20px]">

          { users.length >= 2 && <div className=" w-[25%]  h-[70%] lg:h-[80%]  flex flex-col items-center  rounded-[10px]  bg-gray-100 ">
            <img className="w-[60%] rounded-[50%] border-[4px] border-amber-900 mt-[0.4rem]" src={users[1].profile_img}/>
            <h1 className="pt-[0.5rem]">{users[1].username}</h1>
            <h1 className="pt-[0.4rem]">{users[1].xp}</h1>
          </div>}
          {users.length >= 1 &&  <div className=" w-[25%] h-[80%] lg:h-[90%] flex flex-col items-center  rounded-[10px] bg-gray-100 ">
            <img className="w-[60%] rounded-[50%] border-[4px] border-amber-400 mt-[0.4rem]" src={users[0].profile_img}/>
            <h1 className="pt-[0.5rem]">{users[0].username}</h1>
            <h1 className="pt-[0.4rem]">{users[0].xp}</h1>
          </div>}
          {users.length >= 3 &&  <div className=" w-[25%] h-[70%] lg:h-[80%] flex flex-col items-center  rounded-[10px] bg-gray-100 ">
            <img className="w-[60%] rounded-[50%] border-[4px] border-gray-400 mt-[0.4rem]" src={users[2].profile_img}/>
            <h1 className="pt-[0.5rem]">{users[2].username}</h1>
            <h1 className="pt-[0.4rem]">{users[2].xp}</h1>
          </div>}

        </div>
        {
          newObject.map((item , index)=>(
            <div key={index} className="index w-full mt-0.5 ">
                  <div className="flex">
                    <div className="w-full flex full h-[6rem] bg-gray-100 justify-between">
                      <div className="flex h-full">
                        <div className="flex items-center w-[1rem] ml-1"><p className="text-2xl">{index + 4}</p></div>
                        <div className="flex w-[70px] items-center ml-[0.5rem]"><img className="rounded-[50%]" src={item.profile_img}/></div>
                        <div className="flex w-[70px] items-center ml-[0.5rem]"><p>{item.username}</p></div>
                      </div>
                      <div className="flex w-[40%] h-full ">
                        <div className="w-[40%] flex items-center"><p className="text-2xl">{item.xp}</p></div>
                        {
                          item.friend_status != "friend" && 
                          <div className="flex  w-[77%] items-center "><button onClick={()=>handleAddFriend(item.username)} className="bg-blue-500 w-full h-[40%] rounded-[10px]">Add friend</button></div>
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
  const [LeaderBord_users , setLeadr] = useState([]);
  const username = localStorage.getItem('name');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get('http://localhost:4444/Xprank', {
          params:{
            user:username
          }
        })
        console.log(data.data);
        setLeadr(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  

  return (
    <div className="text-white bg-white w-[25%] h-[40%] overflow-scroll">
      <LeaderBord 
        users={LeaderBord_users}
      />
    </div>
  );
}
