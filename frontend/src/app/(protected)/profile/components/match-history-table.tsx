import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Calendar, Link, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react"
import { GameModalDemo } from "./ui/modal"
import { useState, useEffect} from "react"
import { GameDetails } from "@/types/user"
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation"
import api from "@/lib/api";
import { useTranslation } from '@/contexts/LanguageContext';
import { NoMatchHistory } from "./noMatchHistory"



interface MatchHistoryTableProps {
  username: string
}

export function MatchHistoryTable({username} : MatchHistoryTableProps) {
  const { user: currentUser } = useUserStore();
  const [selectedMatch, setSelectedMatch] = useState<GameDetails | null>(null)
  const [matchHistory, setMatchHistory] = useState<GameDetails[] | null>(null)
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const targetUsername = username;
  const router = useRouter();
  const {t} = useTranslation();
  const [noData, setNoData] = useState<boolean>(false);
  

   useEffect(() => {
    const limit : number = 5;
    const fetchMatchHistory = async () => {
      if (!currentUser?.access_token) {
        return;
      }
      if (!targetUsername) {
        return;
      }

      try {
        const res = await api.get<GameDetails[]>(
          `/api/getMatchHistory/${targetUsername}?page=${page}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        if (res.data.length === 0)
        {
          setNoData(true);
        }
        else if (res.data.length > limit)
        {
          setHasMore(true)
          setMatchHistory(res.data.slice(0,limit));
        }
        else 
        {
          setHasMore(false);   
          setMatchHistory(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMatchHistory();
  }, [targetUsername, currentUser, page]);

  return (
    <Card className="bg-card/50 border-gray-800" >
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
      <CardContent className="h-70">
        <div className="match_table">
          <table className="w-full">
            <thead>
              <tr className="border-b  border-gray-700/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.date')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.opponent')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.result')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.score')}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('profile.type')}</th>
              </tr>
            </thead>
            <tbody>
              {
               noData ? <NoMatchHistory />
               : matchHistory 
              && matchHistory.map((match) => (
                <tr key={match.id} className="border-b border-gray-700/50 hover:bg-muted/50 cursor-pointer">
              
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 text-sm">{match.game_date.substring(0, match.game_date.length - 3)}</td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 font-medium">{match.opponent}</td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4">
                    <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result === "Win" ? t('profile.win') : t('profile.loss')}</Badge>
                  </td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 font-mono text-sm">{match.score}</td>
                 { match.type == "tournament" ?
                 <>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      <span onClick={() => {router.push(`/Tournaments/${match.tournament_id}`)}} className="inline cursor-pointer hover:text-primary
                        transition duration-300 ease-in-out"> {t('game.tournament')}
                          < ExternalLink  className="inline w-4 h-4 ml-1 mb-1"/>
                      </span> 
                    </td>
                    <td className="py-3 px-2">
                      <div className="relative group inline-flex">
                       <a target="_blank" href={`https://testnet.snowtrace.io/tx/${match.blockChainHash}?chainid=43113`}>
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
                    <>
                    <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 text-sm text-muted-foreground">   
                    {t('profile.duel')}
                    </td>
                    </>
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
      <CardFooter className="flex justify-center">
         <div className="flex mt-25 items-center gap-4 sm:mt-5">
          <button
            className={`flex  gap-2 px-4 py-2 rounded-lg border border-gray-700/50 bg-black transition duration-300 ease-in-out ${
              page <= 0
                ? 'opacity-50 text-gray-600'
                : 'hover:bg-gray-900 text-white'
            }`}
            disabled={page <= 0}
            onClick={()=> {setPage(page - 1)}}
          >
            <ChevronLeft size={20} />
          </button>

          <span className="flex justify-center text-gray-400 font-mono w-10">
            {page + 1}
          </span>

          <button
              className={`flex  gap-2 px-4 py-2 rounded-lg border border-gray-700/50 bg-black transition duration-300 ease-in-out  ${
              !hasMore
                ? 'opacity-50 text-gray-600'
                : 'hover:bg-gray-900 text-white'
            }`}
            disabled={!hasMore}
            onClick={()=> {setPage(page + 1)}}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}
