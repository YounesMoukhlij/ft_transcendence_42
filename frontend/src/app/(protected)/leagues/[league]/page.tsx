"use client"
import { use, useState, useEffect } from 'react';


import { PlayerTable } from "@/app/(protected)/leagues/player-table"
import axios from "axios"
import "@/app/(protected)/profile/style.css"
import { useUserStore } from "@/store/userStore";



interface LeaguePageProps {
  params: Promise<{ league : string }>; // dynamic route
}

export default  function LeagueTable({ params }: LeaguePageProps) {
 const { league } = use(params); // destructure to get the string
  const { user: currentUser } = useUserStore();
  const [leagueStats, setLeagueStats] = useState();
  const [error, setError] = useState<string | null>(null);
  const targetleague = league;
  console.log("Hello");
useEffect(() => {
    const fetchMatchHistory = async () => {
      if (!currentUser?.access_token) {
        setError("You must be logged in to view profiles");
        return;
      }
      if (!targetleague) {
        setError("Username is missing");
        return;
      }

      try {
        const res = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getLeaguesStats/${targetleague}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        setLeagueStats(res.data);
      } catch (err) {
        console.error(err);
        setError(`Failed to load profile for ${targetleague}`);
      }
    };

    fetchMatchHistory();
  }, [targetleague, currentUser]);

    return (
      <div className="min-h-screen">
        <div className="container">
          <PlayerTable league={targetleague} data={leagueStats} />
        </div>
      </div>
    );
}