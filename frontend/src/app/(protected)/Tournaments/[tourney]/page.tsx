'use client';
import React, { useState, useEffect } from 'react';
import "@/app/(protected)/Tournaments/[tourney]/style.css"
import { useParams } from 'next/navigation';
import { useUserStore } from "@/store/userStore";
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Loading from '@/components/Loading/page';
import Logo from '@/components/Logo'
import Image from 'next/image';


type Match = {
  host: string,
  guest: string,
  host_score: number,
  guest_score: number,
  host_id: number,
  guest_id: number,
  date : string,
  winner : number,
  winner_name: string,
  tournamentName: string
 };

const TeamBox = ({isFinals = false,  isWinner, score, name }: {isFinals?: boolean,  isWinner : boolean, score: number, name: string }) => {
  const router = useRouter();
  return (
    
    <div className={`relative group z-10 transition-transform duration-300 hover:scale-105 ${isFinals ? 'w-64' : 'w-56'}`}>
      {/* Team Rank & Name Container */}
      <div className={`
        bg-white text-slate-900 font-bold px-4 py-3 
        flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]
        border-l-4 ${isWinner ? 'border-primary' : 'border-gray-300'}
      `}>
        <span onClick={() => {router.push(`/profile/${name}`)}} className="text-sm tracking-wide uppercase font-black truncate hover:text-primary cursor-pointer">{name}</span>
       
      </div>
    <div className={`absolute z-50 w-10 ${isFinals ? 'left-54' : 'left-46'} top-0 h-full border-l border-gray-300 flex items-center justify-center`}>
        <span className={`font-black ${isWinner ? 'text-primary' : 'text-black'} text-center`}>{score}</span>
    </div>
      
      {/* Connector Dot */}
      <div className={`
        absolute right-0 top-1/2 w-3 h-3 translate-x-1.5 -translate-y-1/2 rotate-45
        ${isWinner ? 'bg-primary shadow-[0_0_10px_#3b82f6]' : 'bg-slate-600'}
      `} />
    </div>
  );
};

const MatchConnector = ({ 
  gameLabel, 
  date, 
  time,
  isFinals
}: { 
  gameLabel: "Semifinal" | "Final", 
  date: string, 
  time: string,
  isFinals : boolean
}) => {
  return (
    <div className="flex flex-col justify-center items-center mx-4 h-full relative ">
      {/* The Bracket Lines */}
      {/* Top half vertical line */}
      <div className={`absolute ${isFinals ? 'top-[7%]' : 'top-[14%]'} bottom-1/2 right-0 left-0 border-r-2 border-primary rounded-tr-sm`} />
      {/* Bottom half vertical line */}
      <div className={`absolute top-1/2 ${isFinals ? 'h-[43%]' : 'h-[36%]'} h-[36%] bottom-0 right-0 left-0 border-r-2 border-primary rounded-br-sm`} />
      
      {/* Horizontal connector to next round */}
      <div className="absolute top-1/2  right-[-5rem] w-20 h-0.5 bg-primary" />

      {/* Match Info Label Floating in the middle */}
      <div className="z-20 text-center space-y-0.5 ml-10 bg-slate-900/90 p-2 rounded border border-primary backdrop-blur-sm shadow-xl">
        <div className="text-[10px] font-bold text-primary tracking-wider uppercase">{gameLabel}</div>
        <div className="text-[9px] text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1">
          <span>{date}</span>
          <span className="w-0.5 h-4 bg-primary inline-block mx-0.5"></span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default function TournamentBracket() {
  const [tournamentData, setTournamentData] = useState<Match[] | null>(null);;
  const { user: currentUser } = useUserStore();
  const params = useParams();
  const tournament_id = params.tourney;
  const router = useRouter();

  useEffect(() => {
    if (!currentUser?.access_token) return;
    if (!tournament_id) return;

    let active = true;

    const fetchTournamentBracket = async () => {
      try {
        const res = await api.get<Match[]>(
          `/api/getTournamentBracket/${tournament_id}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        if (!active) return;
        setTournamentData(res.data);
        console.log("TOurnament data: ", res.data);
      } catch (err) {
        console.error("Error loading tournament:", err);
        if ((err).response?.status === 404) {
          router.replace('/not-found');
          return;
        }
    };
  };
    fetchTournamentBracket();
    return () => {
      active = false;
    };
  }, [tournament_id, currentUser]);

  if (!tournamentData) return <Loading />;

  return (
    <div className="h-[84vh] mt-4 flex bg-slate-950 text-white font-sans  flex-col md:flex-row lg:flex-row ">
      
      <div className="relative md:min-w-[27%] lg:min-w-[27%] bg-slate-900 flex flex-col items-center justify-center p-8 border-r border-white/5 overflow-hidden">

    

   
        <div className="relative z-10 flex flex-col items-center  text-center space-y-6">

          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-sky-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center shadow-2xl">
              
              
         <Logo  />
      
            
            </div>
          </div> 
     <div className="space-y-1">
            <h3 className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{} </h3>
            <h1 className="text-5xl md:text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 uppercase tracking-tighter transition-all ease-in-out duration-300 ">
              {tournamentData[0].tournamentName.length > 8 ? tournamentData[0].tournamentName.substring(0, 8)+ " ..." : tournamentData[0].tournamentName}<br/>Tournament
            </h1>
          </div>
        </div>
      </div> 

      {/* --- Right Panel: Bracket --- */}
      <div className="relative flex items-center  bg-slate-950 p-4 md:p-12 bracket ">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="flex gap-16 md:gap-24 items-center">
          
          {/* Round 1: Semifinals */}
          <div className="flex flex-col gap-24 py-10">
            { tournamentData && tournamentData?.slice(0,2).map((match, index) => (
               <div key={index} className="relative flex items-center">
                <div className="flex flex-col gap-12">
                   {/* Team 1 */}
                   <div className="relative">
                      <TeamBox name={match.host} score={match.host_score} isWinner={match.winner == match.host_id} />
                   </div>

                   {/* Team 2 */}
                   <div className="relative">
                      <TeamBox  name={match.guest} score={match.guest_score} isWinner={match.winner == match.guest_id}  />
                   </div>
                </div>

                {/* The Connector & Match Info - Positioned absolutely relative to the flex container of two teams */}
                <div className="absolute left-full top-0 bottom-0 w-16 -ml-8 pointer-events-none">
                  <MatchConnector
                    gameLabel="Semifinal"                   
                    date={match.date.substring(0, 10)}
                    time={match.date.substring(10)}
                    isFinals={false}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Round 2: Finals */}
          <div className="flex flex-col justify-center gap-24 relative mt-2 ">
             {/* Incoming Lines from Semis are handled by the 'MatchConnector' component above visually */}
             
             {tournamentData && tournamentData?.slice(2,3).map((match, index) => (
                <div key={index} className="relative flex items-center">
                  <div className="flex flex-col gap-48"> 
                    {/* The gap here needs to be larger to align with the center of the previous matches */}
                    
                    {/* Finalist 1 */}
                    <div className="relative">
                       <TeamBox name={match.host} score={match.host_score} isWinner={match.winner == match.host_id} />
                    </div>

                    {/* Finalist 2 */}
                    <div className="relative">
                       <TeamBox name={match.guest} score={match.guest_score} isWinner={match.winner == match.guest_id} />
                    </div>
                  </div>

                  {/* Finals Connector */}
                  <div className="absolute left-full top-0 bottom-0 w-16 -ml-8 pointer-events-none">
                     <MatchConnector
                    gameLabel="Final"                   
                    date={match.date}
                    time={match.date}
                    isFinals={false}
                  />
                  </div>
                </div>
             ))}
          </div>

          {/* Winner Column */}
          <div className="flex flex-col justify-center items-start pt-2 ">
            <div className="relative animate-in fade-in slide-in-from-left duration-1000 ">
              
              
              <div className="bg-sky-100 p-1 mt-[17%] rounded-sm shadow-[0_0_25px_#3b82f6] transition-transform duration-300 hover:scale-102 ">
                 <div className="bg-slate-900 border border-primary p-4 w-64 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    
                   {
                     tournamentData && tournamentData[2] ?
                     <>
                     <span  onClick={() => {router.push(`/profile/${tournamentData[2].winner_name}`)}} className="block text-xl font-black text-white uppercase hover:text-primary cursor-pointer">{tournamentData[2].winner_name || "TBD"}</span>
                     </>
                     : 
                    <span  className="block text-xl font-black text-white uppercase hover:text-primary cursor-pointer">TBD</span>
                     
                   }
                 </div>
              </div>

              {/* Champion Label Text below */}
              <div className="mt-4 text-center">
                 <h2 className="text-2xl font-black text-primary tracking-widest uppercase" style={{ textShadow: '0 0 20px rgba(34,197,94,0.5)' }}>
                    Champion
                 </h2>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}