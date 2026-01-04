import { FaSearch } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import  {useUserStore}  from '@/store/userStore';
import axios from 'axios';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

import {formatMessageTime} from './tools'
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDeblock } from './FriendCard';
import {getProfileImageUrl} from "@/lib/utils"


function BlockedCard({ item }) {
  const [snowflakes, setSnowflakes] = useState([]);
  const { handleDeblock } = useDeblock();

  useEffect(() => {
    const flakes = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      size: Math.random() * 20 + 10, 
      top: Math.random() * 90,
      left: Math.random() * 90,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="relative flex w-full justify-between p-2 rounded-lg bg-gray-800 overflow-hidden">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          style={{
            position: "absolute",
            top: `${flake.top}%`,
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          ❄️
        </span>
      ))}

      <div className="flex items-center w-[20%]">
        <img className="rounded-full border-2 border-gray-600" src={getProfileImageUrl(item.profile_img)} alt="profile" />
      </div>
      <div className="flex items-center">
        <h1 className="text-white text-2xl">{item.username}</h1>
      </div>
      <div className="flex items-center z-10">
        <button onClick={()=>handleDeblock(item)} className="bg-white text-black text-2xl rounded-xl p-1 hover:bg-gray-200 hover:cursor-pointer transition-colors">unblok</button>
      </div>
    </div>
  );
}




function ChatSettingsCard() {
  const [tab, setTab] = useState<"general" | "blocked">("general");
  const{updateUserSetting , user , friends} = useUserStore();

  function SettingItem({label}) {
    let value = false;

    if (label === "Sound Notifications")
      value = user.sound_notification;
    else if (label === "Typing Indicator")
      value = user.typing_indicator;
    else if (label === "Read Receipts")
      value = user.read_receipts;
    else if (label === "Show Online Status")
      value = user.status_share;


  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
      <span className="font-medium text-lg text-white">{label}</span>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={value}
          onChange={(e) => handleSettingChange(label, e.target.checked)}
        />

        <div className="w-12 h-6 bg-gray-700 rounded-full transition-colors peer-checked:bg-gray-500"></div>

        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6 shadow"></div>
      </label>
    </div>
  );
}



async function handleSettingChange(label, newValue) {

  let settingAttribute = null;

  switch (label) {
    case "Sound Notifications":
      settingAttribute = "sound_notification";
      break;
    case "Typing Indicator":
      settingAttribute = "typing_indicator";
      break;
    case "Read Receipts":
      settingAttribute = "read_receipts";
      break;
    case "Show Online Status":
      settingAttribute = "status_share";
      break;
    default:
      console.warn("Unknown setting:", label);
      return;
  }

  try {
    await axios.post(`https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/changeusersettings`, {
      settingAttribute,
      newValue,
    },
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    }
  );

    updateUserSetting(settingAttribute, newValue);
  } catch (err) {
    console.error("Failed to update setting:", err);
  }
}

const blockedUsers = friends.filter(
  item =>
    item.blockedByUser1 === user.id_user ||
    item.blockedByUser2 === user.id_user
);


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl p-6">
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setTab("general")}
            className={`py-3 px-6 rounded-xl text-lg transition-all hover:cursor-pointer font-semibold
              ${tab === "general"
                ? "bg-white text-black shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"}`}>
            General
          </button>
          <button
            onClick={() => setTab("blocked")}
            className={`py-3 px-6 rounded-xl text-lg transition-all hover:cursor-pointer font-semibold
              ${tab === "blocked"
                ? "bg-white text-black shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"}`}
          >
            Blocked
          </button>
        </div>

        <div className="space-y-6 overflow-auto">
          {tab === "general" && (
            <div className="space-y-4">
              <SettingItem label="Show Online Status" />
              <SettingItem label="Read Receipts" />
              <SettingItem label="Sound Notifications" />
              <SettingItem label="Typing Indicator" />
            </div>
          )}
       {tab === "blocked" && (
            blockedUsers.length === 0 ? (
              <div className="p-6 text-gray-400 text-lg text-center">
                No blocked users yet.
              </div>
            ) : (

              blockedUsers.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <BlockedCard 
                    item={item}
                  />
                </div>
              ))
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


function FriendCard({ item }) {
    const router = useRouter();
    const { user } = useUserStore();


    return (
        <div onClick={() => router.push(`/chat?friend=${item.id_user}`)}
            className="flex items-center justify-between w-full p-3 bg-gray-800 hover:bg-gray-700 cursor-pointer transition rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                    <img
                        src={getProfileImageUrl(item.profile_img)}
                        className="h-12 2xl:h-23 2xl:w-23 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full border-3 border-gray-600 shadow-lg"
                    />
                      {
                        // item.status_share && 
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-4 border-gray-800 ${
                              item.status ? "bg-green-500" : "bg-gray-600"}`}
                        />
                      }
                </div>

                <div className="flex flex-col min-w-0">
                    <h1 className="text-base sm:text-lg md:text-xl font-bold truncate 2xl:text-3xl text-white">{item.username}</h1>
                    <p className="text-xs sm:text-sm text-gray-400 truncate max-w-[150px] sm:max-w-[200px]">
                        {item?.lastMessage?.length > 30 ? item?.lastMessage.substr(0, 25) + "..." : item?.lastMessage}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs sm:text-sm 2xl:text-2xl">
              {item.isPinned && 
                <div className="">
                  <FontAwesomeIcon icon={faThumbtack} className="text-white text-xl" />
                </div>
              }
                <p className="text-gray-400">{formatMessageTime(item?.lastMessageTime)}</p>
                {item.lastMessageSender !== user.id_user && <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500 rounded-full"></div>}
            </div>
        </div>
    );
}



export default function FriendList( )
{
  const { setFriends , friends ,user} = useUserStore();
  const [setting , setSetting] = useState<boolean>(false);



  function OpenSetting(){
    setSetting(!setting);
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/GetFriends`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        });

      setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    }, [user?.access_token]);


  useEffect(()=>{
    console.log(friends);
  }, [friends])


    const [searchTerm, setSearchTerm] = useState<string>('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return(
        <div className='rounded-2xl w-full flex flex-col gap-3.5 h-full'>
            <div className="flex flex-col lg:p-4 p-2 gap-2 h-[10%] lg:h-[15%] min-h-28 max-h-32 rounded-2xl bg-gray-900 shadow-2xl">
              <div className="flex justify-between h-[50%]">

                  <div className="flex gap-2.5 h-[50%]">
                        <h1 className='text-3xl text-white font-bold'>inbox</h1>
                        <h1 className='bg-gray-800 text-white rounded-lg px-3 flex justify-center items-center h-8 font-semibold'>{friends.filter(item => item.lastMessageSender !== user.id_user).length} New</h1>
                  </div>

                <div className="flex justify-center items-center h-[100%]">
                    <IoSettingsSharp onClick={OpenSetting} size={20} className={`transition-transform duration-300 hover:cursor-pointer text-white ${setting ? "rotate-90" : "rotate-0 hover:cursor-pointer"}`}/>
                </div>
              </div>
              <div className="flex w-full h-full rounded-xl bg-gray-800/50">
                <button className="button pl-3.5">
                        <FaSearch className="text-gray-400" size={20} />
                  </button>
                  <input
                      className="text-white bg-transparent text-[8px] sm:text-[10px] md:text-[15px] lg:text-[15px] w-4/5 h-full pl-4 outline-none placeholder-gray-500"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleChange}
                  />
              </div>
            </div>
            <div className="overflow-scroll no-scrollbar h-full flex flex-col gap-2 bg-gray-900 rounded-2xl shadow-2xl p-2">
                {
                  setting ? (
                    <div className="w-full h-full">
                      <ChatSettingsCard />
                    </div>
                  ) : friends.length === 0 ? (
                    <div className="flex flex-col h-full justify-center items-center gap-4 text-center">
                      <h1 className="text-xl font-semibold text-gray-300">
                        You don t have any friends yet
                      </h1>
                      <p className="text-gray-400">Start adding friends to get connected!</p>
                      <Link
                        href="/leaderboard"
                        className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition font-bold"
                      >
                        Add Friends
                      </Link>
                    </div>
                  ) : searchTerm.length > 0 ? (
                    [...friends]
                      .filter(friend =>
                        friend.username.toLowerCase().startsWith(searchTerm.toLowerCase())
                      )
                      .sort((a, b) => a.username.localeCompare(b.username))
                      .map((item, index) => <FriendCard key={index} item={item} />)
                  ):(
                   
                    
                     (() => {
                       const processedFriends = friends.map(item => {
                         const isPinned =
                         item.pinnedUser1 === user.id_user ||
                         item.pinnedUser2 === user.id_user;
                         
                         return { ...item, isPinned };
                        });
                        console.log("===============>" , friends);
                        console.log("===============>" , processedFriends);
                        
                        const pinned = processedFriends
                          .filter(item => item.isPinned)
                          .sort((a, b) => {
                            const tA =
                              a.pinnedUser1 === user.id_user
                                ? new Date(a.pinnedDateUser1 || 0).getTime()
                                : new Date(a.pinnedDateUser2 || 0).getTime();                     

                            const tB =
                              b.pinnedUser1 === user.id_user
                                ? new Date(b.pinnedDateUser1 || 0).getTime()
                                : new Date(b.pinnedDateUser2 || 0).getTime();                     

                            return tB - tA;
                          });                     

                        const unpinned = processedFriends
                          .filter(item => !item.isPinned)
                          .sort((a, b) => {
                            const tA = new Date(a.lastMessageTime || 0).getTime();
                            const tB = new Date(b.lastMessageTime || 0).getTime();
                            return tB - tA;
                          });                     
                          return (
                            <>
                            {pinned.map((item, id) => (
                              <FriendCard key={"p" + id} item={item} />
                              ))}                     

                            {unpinned.map((item, id) => (
                              <FriendCard key={"u" + id} item={item} />
                            ))}
                          </>
                        );
                      })()
                  )
                }
            </div>
        </div>
    );
}