import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Calendar, Link, ExternalLink } from "lucide-react"
import { GameModalDemo } from "./ui/modal"
import { useState, useEffect} from "react"
import { GameDetails } from "@/types/user"
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation"
import api from "@/lib/api";
import { useTranslation } from '@/contexts/LanguageContext';



interface MatchHistoryTableProps {
  username: string
}

export function MatchHistoryTable({username} : MatchHistoryTableProps) {
  const { user: currentUser } = useUserStore();
  const [selectedMatch, setSelectedMatch] = useState<GameDetails | null>(null)
  const [matchHistory, setMatchHistory] = useState<GameDetails[] | null>(null)
  const targetUsername = username;
  const router = useRouter();
  const {t} = useTranslation();



   useEffect(() => {
    const fetchMatchHistory = async () => {
      if (!currentUser?.access_token) {
        console.log("You must be logged in to view profiles");
        return;
      }
      if (!targetUsername) {
        console.log("Username is missing");
        return;
      }

      try {
        const res = await api.get<GameDetails[]>(
          `/api/getMatchHistory/${targetUsername}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        setMatchHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatchHistory();
  }, [targetUsername, currentUser]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('profile.matchHistory')}
            </CardTitle>
            <CardDescription>{t('profile.completeRecord')} </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="match_table">
          <table className="w-full ">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.date')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.opponent')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.result')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.score')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.type')}</th>
              </tr>
            </thead>
            <tbody>
              {
                matchHistory 
              && matchHistory.map((match) => (
                <tr key={match.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer">
              
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 text-sm">{match.game_date.substring(0, match.game_date.length - 3)}</td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 font-medium">{match.opponent}</td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4">
                    <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result === "Win" ? t('profile.win') : t('profile.loss')}</Badge>
                  </td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 font-mono text-sm">{match.score}</td>
                 { match.type == "tournament" ?
                 <>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      <span onClick={() => router.push(`/Tournaments/${match.tournament_id}`)} className="inline cursor-pointer hover:text-primary
                        transition duration-300 ease-in-out"> {t('game.tournament')}
                          < ExternalLink  className="inline w-4 h-4 ml-1 mb-1"/>
                      </span> 
                    </td>
                    <td className="py-3 px-2">
                      <div className="relative group inline-flex">
                       <a href={`https://testnet.snowtrace.io/address/0xfaA0F7950218186597766CE2b6e7c6b43B5F55AE/contract/43113/code`}>
                        <Link className="w-4 h-4 text-muted-foreground group-hover:text-white transition-all duration-300 ease-in-out"/>
                       </a> 
                        <span className="absolute hidden group-hover:block
                          -left-21 -top-5
                          bg-black text-white text-xs px-2 py-1 rounded shadow">
                          {t('profile.in_blockchain')}
                        </span>
                    </div> 
                    <span className="transition-all duration-300 ease-in-out" title="on blockchain"></span>
                    </td>
                 </>
                    :
                    <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 text-sm text-muted-foreground">   
                    {t('profile.duel')}
                    </td>
                    }
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
