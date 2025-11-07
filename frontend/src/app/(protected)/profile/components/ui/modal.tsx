
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'; // Example: Importing the coffee icon
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "./table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { MatchStats } from "./matchReport";
import { useCountUp } from "../../hooks/useCountUp";
import { GameDetails } from "@/types/user"
import { formatDuration } from "../../hooks/useCountUp";



// interface PlayerStats {
//   name: string
//   points: number
//   touches: number
//   streak: number
//   leadTime: string
//   pfp : string
// }

// interface GameDetails {
//   id: string | number
//   date: string
//   duration: string
//   score: string
//   longestRally: number
//   avgRally: number
//   result: string
//   opponent: string
//   maxSpeed : number
//   players: PlayerStats[]
// }
interface GameModalProps {
  game: GameDetails
  onClose: () => void
}


const getleadingSeconds = (time : string) =>
{ 
  let seconds :  number = 0;
  if (time.indexOf("m") == -1 && time.indexOf("s") != -1)
  {
    seconds += Number(time.substring(0, time.indexOf("s")));

  }
  else if (time.indexOf("m") == 1)
  {
   seconds += Number(time.substring(0, time.indexOf("m"))) * 60;
   seconds += Number(time.substring(time.indexOf("m") + 1, time.indexOf("s")));
  }
  return seconds;
}


export function GameModalDemo({game, onClose} : GameModalProps) 
{
  const [open, setOpen] = useState(false);
   useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 70); // 0.5 seconds

    return () => clearTimeout(timer); // cleanup if component unmounts
  }, []);

  const hostScore : number = game.hostScore;
  const hostTouches : number = game.hostTouches;
  const hostStreak : number = game.hostMaxStreak;
  const hostLeading: number = game.hostLeadingTime;
  
  
  
  const guestScore : number = game.guestScore;
  const guestTouches : number = game.guestTouches;
  const guestStreak : number = game.guestMaxStreak;
  const guestLeading: number = game.guestLeadingTime;
  

  
  return (
    <div>
      {
        <div className="my-modal-wrapper fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div data-show={open} className="my-modal bg-background flex-col rounded-2xl shadow-lg max-w-2xl w-full p-6 relative  transform transition-all duration-300 opacity-0 scale-95  data-[show=true]:opacity-100 data-[show=true]:scale-100">
            {/* Close button */}
            <div className="h-12"> 
                <button
                    onClick={() => {onClose(); setOpen(false)}}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
                    >
                        <FontAwesomeIcon  icon={faXmark} />
                </button>
              <h2 className="text-2xl font-bold mb-4">Game Details</h2>

            </div>
           <hr />
            

            
           <div className="flex justify-around items-center">
            <div className="w-32 h-32 mt-6">
                <div className="w-28 h-28 border bg-background rounded-sm ">
                  <img src={game.hostImg} alt="pfp" className="rounded-sm" />
                </div>
                <p className="ml-10 mt-2">{game.host}</p>
            </div>

            <div>
                <h1 className="font-bold lg:-ml-6 md:-ml-6 sm:-ml-6 text-4xl" >
                    VS
                </h1>
            </div>
            <div className="w-32 h-32 mt-6 flex-col justify-center">
                <div className="w-28 h-28 border bg-background rounded-sm">
                  <img src={game.guestImg} alt="pfp" className="rounded-sm "/>
                </div>
                <p className="ml-10 mt-2">{game.guest}</p>
            </div>
           </div>
           <div className="mt-8 ">
             <Table>
                    <TableBody>
                         <TableRow className={hostScore > guestScore ? "left-overtake" : "right-overtake"}>
                             <TableCell colSpan={4} className="text-left">{hostScore}</TableCell>
                            <TableHead colSpan={4} className="text-center">Final Score</TableHead>
                            <TableCell colSpan={4} className="text-right">{guestScore}</TableCell>
                        </TableRow>
                          <TableRow className={hostTouches > guestTouches ? "left-overtake" : "right-overtake"}>
                             <TableCell colSpan={4} className="text-left">{hostTouches}</TableCell>
                            <TableHead colSpan={4} className="text-center">Touches</TableHead>
                            <TableCell colSpan={4} className="text-right">{guestTouches}</TableCell>
                        </TableRow>
                          <TableRow className={hostStreak > guestStreak ? "left-overtake" : "right-overtake"}>
                             <TableCell colSpan={4} className="text-left">{hostStreak}</TableCell>
                            <TableHead colSpan={4} className="text-center">Max Streak</TableHead>
                            <TableCell colSpan={4} className="text-right">{guestStreak}</TableCell>
                        </TableRow>
                         <TableRow className={hostLeading > guestLeading ? "left-overtake" : "right-overtake"}>
                             <TableCell colSpan={4} className="text-left">{formatDuration(game.hostLeadingTime)}</TableCell>
                            <TableHead colSpan={4} className="text-center">Max Leading Time</TableHead>
                            <TableCell colSpan={4} className="text-right">{formatDuration(game.guestLeadingTime)}</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
           </div>

            {/* <Card className="">
                <CardTitle className="ml-2">
                    Match general stats
                </CardTitle>
               
                <CardContent>
                <p><span className="text-muted-foreground text-sm">Duration:</span> {game.duration}</p>
                <p><span className="text-muted-foreground text-sm">Longest Rally:</span> {game.longestRally}</p>
                <p><span className="text-muted-foreground text-sm">Average Rally:</span> {game.avgRally}</p>
                <p><span className="text-muted-foreground text-sm">Ball max Speed:</span> {game.maxSpeed} Km/h</p>

                </CardContent>
            </Card> */}
            {
              <MatchStats duration={formatDuration(game.duration)} longestRally={game.longest_rally} avgRally={game.average_rally} maxSpeed={game.ball_max_speed} />

            }



            
          </div>
        </div>
      }
    </div>
  )
}
