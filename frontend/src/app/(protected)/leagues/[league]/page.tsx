"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/api";
import { PlayerTable } from "@/app/(protected)/leagues/player-table";
import { useUserStore } from "@/store/userStore";
import "@/app/(protected)/profile/style.css";
import { redirect, useRouter } from "next/navigation";
import Loading from "@/components/Loading/page";

interface LeaguePageProps {
  params: Promise<{ league: string }>;
}

export default function LeagueTable({ params }: LeaguePageProps) {
  const { league } = use(params);
  const { user: currentUser } = useUserStore();
  const router = useRouter();
  const [leagueStats, setLeagueStats] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser?.access_token) return;
    if (!league) return;

    let active = true;
    setLoading(true);

    const fetchLeagueStats = async () => {
      try {
        const res = await api.get(`/getLeaguesStats/${league}`, {
          headers: { Authorization: `Bearer ${currentUser.access_token}` },
        });
        if (!active) return;
        setLeagueStats(res.data);
      } catch (err) {
        console.error("Error loading league:", err);
        if ((err).response?.status === 404) {
          redirect("/not-found");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueStats();
    return () => {
      active = false;
    };
  }, [league, currentUser, router]);

  if (!currentUser || loading) return <Loading />;
  if (!leagueStats) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <PlayerTable league={league} data={leagueStats} />
      </div>
    </div>
  );
}