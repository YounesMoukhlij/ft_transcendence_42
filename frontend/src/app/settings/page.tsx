
"use client";
import { useEffect, useState } from "react";
import axios from 'axios';
import "../chat/page.css"


const LeaderBord = () =>{
  return (
    <div className="text-black  w-full h-[100%] bg-white ">

        <div className=" flex w-full h-[50%] justify-center items-end  bg-white gap-[0.5rem] pb-[20px]">

          <div className=" w-[25%] h-[70%]  flex flex-col items-center  rounded-[10px]  bg-gray-100">
            <img className="w-[60%] rounded-[50%] border-[4px] border-amber-900 mt-[0.4rem]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/>
            <h1 className="pt-[0.5rem]">zalaksya</h1>
            <h1 className="pt-[0.4rem]">524</h1>
          </div>
          <div className=" w-[25%] h-[80%]  flex flex-col items-center  rounded-[10px] bg-gray-100">
            <img className="w-[60%] rounded-[50%] border-[4px] border-amber-400 mt-[0.4rem]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/>
            <h1 className="pt-[0.5rem]">zalaksya</h1>
            <h1 className="pt-[0.4rem]">524</h1>
          </div>
          <div className=" w-[25%] h-[70%]  flex flex-col items-center  rounded-[10px] bg-gray-100">
            <img className="w-[60%] rounded-[50%] border-[4px] border-gray-400 mt-[0.4rem]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/>
            <h1 className="pt-[0.5rem]">zalaksya</h1>
            <h1 className="pt-[0.4rem]">524</h1>
          </div>

        </div>

        <div className="w-full h-[50%] ">
            <div className="flex">
              <div className="w-full flex full h-[6rem] bg-gray-100 justify-between">
                <div className="flex h-full">
                  <div className="flex items-center w-[1rem] ml-1"><p className="text-2xl">3</p></div>
                  <div className="flex w-[70px] items-center ml-[0.5rem]"><img className="rounded-[50%]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/></div>
                  <div className="flex w-[70px] items-center ml-[0.5rem]"><p>Avatar</p></div>
                </div>
                <div className="flex w-[30%] h-full">
                  <div className="w-[22%] flex items-center"><p className="text-2xl">256</p></div>
                  <div className="flex  w-[77%] items-center ml-[0.5rem] mr-[0.5rem]"><button className="bg-blue-500 w-full h-[40%] rounded-[10px]">Add friend</button></div>
                </div>
              </div>
            </div>
        </div>
   </div>

  );
};







export default function SettingsPage() {
  const [LeaderBord_users , setLeadr] = useState([]);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:4444/');
        setLeadr(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="text-white w-[25%] h-[40%]">
      <LeaderBord />
    </div>
  );
}
