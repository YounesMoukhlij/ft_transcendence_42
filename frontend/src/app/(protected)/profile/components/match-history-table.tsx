import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Calendar, Download } from "lucide-react"
import { GameModalDemo } from "./ui/modal"
import { formatDuration } from "../hooks/useCountUp"
import { useState, useEffect} from "react"
import { GameDetails } from "@/types/user"
import { useUserStore } from "@/store/userStore";
import axios from "axios"
import { useTranslation } from "../../../../contexts/LanguageContext"

interface MatchHistoryTableProps {
  username: string
}

export function MatchHistoryTable({username} : MatchHistoryTableProps) {
  const { t } = useTranslation();
  const { user: currentUser } = useUserStore();
  const [selectedMatch, setSelectedMatch] = useState<GameDetails | null>(null)
  const [matchHistory, setMatchHistory] = useState<GameDetails[] | null>(null)
  const [error, setError] = useState<string | null>(null);
  const targetUsername = username;


  console.log(currentUser.username, "ordered match history of ", targetUsername);

   useEffect(() => {
    const fetchMatchHistory = async () => {
      if (!currentUser?.access_token) {
        setError(t('profile.mustBeLoggedIn'));
        return;
      }
      if (!targetUsername) {
        setError(t('profile.usernameMissing'));
        return;
      }

      try {
        const res = await axios.get<GameDetails[]>(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getMatchHistory/${targetUsername}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        setMatchHistory(res.data);
      } catch (err) {
        console.error(err);
        setError(t('profile.failedToLoad', { username: targetUsername }));
      }
    };

    fetchMatchHistory();
  }, [targetUsername, currentUser, t]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('profile.matchHistory')}
            </CardTitle>
            <CardDescription>{t('profile.completeRecord')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.date')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.opponent')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.result')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.score')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.duration')}</th>
              </tr>
            </thead>
            <tbody>
              {
                matchHistory
              && matchHistory.map((match) => (
                <tr key={match.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedMatch(match)}>

                  <td className="py-3 px-4 text-sm">{match.game_date.substring(0, match.game_date.length - 3)}</td>
                  <td className="py-3 px-4 font-medium">{match.opponent}</td>
                  <td className="py-3 px-4">
                    <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{match.score}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{formatDuration(match.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
                  {
                   selectedMatch  && <GameModalDemo game={selectedMatch} onClose={() => setSelectedMatch(null)} />
                  }
        </div>
      </CardContent>
    </Card>
  )
}
