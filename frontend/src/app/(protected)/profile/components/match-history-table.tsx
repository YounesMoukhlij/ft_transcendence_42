import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Calendar, Link, ExternalLink } from "lucide-react"
import { GameModalDemo } from "./ui/modal"
import { useState, useEffect} from "react"
import { GameDetails } from "@/types/user"
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation"
import api from "@/lib/api";


interface MatchHistoryTableProps {
  username: string
}

export function MatchHistoryTable({username} : MatchHistoryTableProps) {
  const { user: currentUser } = useUserStore();
  const [selectedMatch, setSelectedMatch] = useState<GameDetails | null>(null)
  const [matchHistory, setMatchHistory] = useState<GameDetails[] | null>(null)
  const targetUsername = username;
  const router = useRouter();


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
              Match History
            </CardTitle>
            <CardDescription>Complete record of all your matches</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="match_table">
          <table className="w-full ">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Opponent</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Result</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
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
                    <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result}</Badge>
                  </td>
                  <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 font-mono text-sm">{match.score}</td>
                 { match.type == "tournament" ?
                 <>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      <span onClick={() => router.push(`/Tournaments/${match.tournament_id}`)} className="inline cursor-pointer hover:text-primary
                        transition duration-300 ease-in-out"> {match.type[0].toUpperCase() + match.type.slice(1)}
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
                          in blockchain
                        </span>
                    </div> 
                    <span className="transition-all duration-300 ease-in-out" title="on blockchain"></span>
                    </td>
                 </>
                    :
                    <td onClick={() => setSelectedMatch(match)} className="py-3 px-4 text-sm text-muted-foreground">   
                    {match?.type[0]?.toUpperCase() + match.type.slice(1)}
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
