
// import { useState } from "react"
import { PlayerTable } from "@/app/(protected)/leagues/player-table"
import axios from "axios"
import "@/app/(protected)/profile/style.css"

interface LeaguePageProps {
  params: { league: string };
}
export default async function LeagueTable({ params }: LeaguePageProps) {
  const leagueParam = params.league;

  if (!leagueParam) {
    return <div>League param is missing</div>;
  }

  try {
    const url = `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getLeaguesStats/${leagueParam}`;

    // Use fetch for SSR
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch league stats: ${res.status}`);
    }

    const leagueStats = await res.json();

    return (
      <div className="min-h-screen">
        <div className="container">
          <PlayerTable league={leagueParam} data={leagueStats} />
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error fetching league data:", err);
    return (
      <div>
        League not found or failed to load: {leagueParam}
      </div>
    );
  }
}

