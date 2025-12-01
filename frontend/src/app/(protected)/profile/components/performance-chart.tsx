"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { IllustrationGraph } from "./graph"
import { IllustrationChart } from "./chart"
import { TrendingUp} from "lucide-react"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { useUserStore } from "@/store/userStore"
import axios from "axios"
import { useTranslation } from "../../../../contexts/LanguageContext"



interface PerformanceData {
  key: string
  wins: number
  losses: number
}

interface PerformanceChartProps {
  username : string
}


export function PerformanceChart({username }: PerformanceChartProps) {
  const { t } = useTranslation();
  const [illustration, setIllustration] = useState<"graph" | "chart">("graph");


  const { user: currentUser } = useUserStore();
  const [performaceData, setPerformanceData] = useState<PerformanceData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const targetUsername = username;
  useEffect(() => {
    const fetchPlayerProgressData = async () => {
      if (!currentUser?.access_token) {
        setError(t('profile.mustBeLoggedIn'));
        return;
      }
      if (!targetUsername) {
        setError(t('profile.usernameMissing'));
        return;
      }

      try {
        const res = await axios.get<PerformanceData[]>(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getPlayerProgress/${targetUsername}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        console.log("Data is received: ", res.data);
        setPerformanceData(res.data);
      } catch (err) {
        console.error(err);
        setError(t('profile.failedToLoad', { username: targetUsername }));
      }
    };

    fetchPlayerProgressData();
  }, [targetUsername, currentUser, t]);




  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 " />
          {t('profile.performanceTrends')}
        </CardTitle>
           <CardDescription>{t('profile.weeklyWinsLosses')}</CardDescription>
        </div>
        <div>
          <Button data-state={illustration} onClick={()=> setIllustration("graph")}  variant="normal"  className="rounded data-[state=graph]:bg-primary mr-1">
          {t('profile.graph')}
        </Button>
        <Button data-state={illustration} onClick={()=> setIllustration("chart")} variant="normal"  className="data-[state=chart]:bg-primary">
           {t('profile.chart')}
        </Button>
        </div>

          </div>
      </CardHeader>
      {
        illustration == "graph" ? <IllustrationGraph data={performaceData} /> : <IllustrationChart  data={performaceData} />
      }
    </Card>
  )
}
