import { FaSearch } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import  {useUserStore}  from '@/store/userStore';
import axios from 'axios';
import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

import {formatMessageTime} from './tools'
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDeblock } from './FriendCard';

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
    <div className="relative flex w-full justify-between p-2 rounded-lg icy-bg overflow-hidden ">
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
        <img className="rounded-full" src={item.profile_img} alt="profile" />
      </div>
      <div className="flex items-center">
        <h1 className="text-black text-2xl" >{item.username}</h1>
      </div>
      <div className="flex items-center z-10">
        <button onClick={()=>handleDeblock(item)} className="bg-black text-2xl  rounded-xl p-1 hover:cursor-pointer">unblok</button>
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
    <div className="flex items-center justify-between bg-neutral-800 p-4 rounded-lg border border-neutral-700">
      <span className="font-medium text-lg">{label}</span>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={value}
          onChange={(e) => handleSettingChange(label, e.target.checked)}
        />

        <div className="w-12 h-6 bg-neutral-700 rounded-full transition-colors peer-checked:bg-green-400"></div>

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
    await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/changeusersettings`, {
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
        className="w-full bg-neutral-900 text-white rounded-xl overflow-hidden shadow-lg p-4">
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setTab("general")}
            className={`py-2 px-4 rounded-lg text-lg transition-all hover:cursor-pointer
              ${tab === "general"
                ? "bg-white text-black font-semibold shadow-md"
                : "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"}`}>
            General
          </button>
          <button
            onClick={() => setTab("blocked")}
            className={`py-2 px-4 rounded-lg text-lg transition-all hover:cursor-pointer
              ${tab === "blocked"
                ? "bg-white text-black font-semibold shadow-md"
                : "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"}`}
          >
            Blocked
          </button>
        </div>

        <div className="space-y-6 overflow-auto">
          {tab === "general" && (
            <div className="space-y-6">
              <SettingItem label="Show Online Status" />
              <SettingItem label="Read Receipts" />
              <SettingItem label="Sound Notifications" />
              <SettingItem label="Typing Indicator" />
            </div>
          )}
       {tab === "blocked" && (
            blockedUsers.length === 0 ? (
              <div className="p-6 text-neutral-400 text-lg text-center ">
                No blocked users yet.
              </div>
            ) : (

              blockedUsers.map((item, index) => (
                <div key={index} className="bg-amber-400 overflow-scroll flex flex-col gap-0.5 ">
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
    const { user , updateUserSetting} = useUserStore();


    return (
        <div onClick={() => router.push(`/chat?friend=${item.id_user}`)}
            className="flex items-center justify-between w-full p-3  bg-white/20 backdrop-blur-md hover:bg-white/20 cursor-pointer transition">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative ">
                    <img
                        src={item.profile_img}
                        className=" h-12 2xl:h-23 2xl:w-23 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full"
                    />
                      {
                        // item.status_share && 
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                              item.status ? "bg-green-500" : "bg-red-500"}`}
                        />
                      }
                    {/* <div
                        className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                            item.status ? "bg-green-500" : "bg-red-500"
                        }`}
                    /> */}
                </div>

                <div className="flex flex-col min-w-0">
                    <h1 className="text-base sm:text-lg md:text-xl font-semibold truncate 2xl:text-3xl">{item.username}</h1>
                    <p className="text-xs sm:text-sm text-gray-300 truncate max-w-[150px] sm:max-w-[200px]">
                        {item?.lastMessage?.length > 30 ? item?.lastMessage.substr(0, 25) + "..." : item?.lastMessage}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs sm:text-sm  2xl:text-2xl">
              {item.isPinned && 
                <div className="">
                  <FontAwesomeIcon icon={faThumbtack} className="text-white text-xl" />
                </div>
              }
                <p>{formatMessageTime(item?.lastMessageTime)}</p>
                {item.lastMessageSender !== user.id_user && <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>}
            </div>
        </div>
    );
}



export default function FriendList( )
{
  const { setFriends , user} = useUserStore();
  const friends = useUserStore(state => state.friends);
  const [setting , setSetting] = useState<boolean>(false);



  function OpenSetting(){
    setSetting(!setting);
  }

  console.log("freind list " , friends);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/GetFriends`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        });

        console.log("here======> " , res.data);
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    }, [user?.access_token]);




    const [searchTerm, setSearchTerm] = useState<string>('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return(
        <div className='rounded-2xl w-full flex flex-col gap-3.5 h-full'>
            <div className="flex flex-col lg:p-4 p-2 gap-2 h-[10%] lg:h-[15%] min-h-28  max-h-32 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/20 cursor-pointer transition">
              <div className="flex justify-between h-[50%]">

                  <div className="flex gap-2.5  h-[50%] ">
                        <h1 className='text-3xl'>inbox</h1>
                        <h1 className='bg-blue-400 rounded-4xl w-24 flex justify-center items-center h-8'>{friends.filter(item => item.lastMessageSender !== user.id_user).length} New</h1>
                  </div>

                <div className="flex justify-center items-center h-[100%]">
                    <IoSettingsSharp onClick={OpenSetting} size={20} className={`transition-transform duration-300 hover:cursor-pointer ${setting ? "rotate-90" : "rotate-0 hover:cursor-pointer"}`}/>
                </div>
              </div>
              <div className="flex w-full h-full rounded-[10px] bg-white ">
                <button className="button pl-3.5">
                        <FaSearch className="text-[rgb(179,173,173)]" size={20} />
                  </button>
                  <input
                      className="text-black text-[8px] sm:text-[10px] md:text-[15px] lg:text-[15px] w-4/5 h-full  pl-4 outline-none "
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleChange}
                  />
              </div>
            </div>
            <div className="overflow-scroll  no-scrollbar h-full  flex flex-col gap-0.5 bg-white/10 border border-white/20 rounded-xl shadow-lg ">
                {
                  setting ? (
                    <div className="w-full h-full">
                      <ChatSettingsCard />
                    </div>
                  ) : friends.length === 0 ? (
                    <div className="flex flex-col h-full justify-center items-center gap-4 text-center">
                      <h1 className="text-xl font-semibold text-gray-700">
                        You don't have any friends yet
                      </h1>
                      <p className="text-gray-500">Start adding friends to get connected!</p>
                      <Link
                        href="/leaderboard"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
