
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
import { MatchStats } from "./matchReport";
import { GameDetails } from "@/types/user"
import { formatDuration } from "../../hooks/useCountUp";
import Image from "next/image";
import {getProfileImageUrl} from '@/lib/utils'
import { useTranslation } from '@/contexts/LanguageContext';



interface GameModalProps {
  game: GameDetails
  onClose: () => void
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

  const {t} = useTranslation(); 

  const hostScore : number = Number(game.hostScore);
  const hostTouches : number = Number(game.hostTouches);
  const hostStreak : number = Number(game.hostMaxStreak);
  const hostLeading: number = Number(game.hostLeadingTime);
  
  
  
  const guestScore : number = Number(game.guestScore);
  const guestTouches : number = Number(game.guestTouches);
  const guestStreak : number = Number(game.guestMaxStreak) || 0;
  const guestLeading: number = Number(game.guestLeadingTime) || 0;

  const hostImg = getProfileImageUrl(game.hostImg);
  const guestImg = getProfileImageUrl(game.guestImg);
  

  
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
              <h2 className="text-2xl font-bold mb-4">{t('profile.gameDetails')}</h2>

            </div>
           <hr />
            

            
           <div className="flex justify-around items-center">
            <div className="w-32 h-32 mt-6">
                <div className=" relative w-28 h-28 border bg-background rounded-sm ">
                  {/* <img src={game.hostImg} alt="pfp" className="rounded-sm" /> */}
                      <Image
                      src={hostImg}
                      alt={game.host}
                      fill
                      className="rounded-sm object-cover"
                      unoptimized
                    />
                </div>
                <p className="ml-10 mt-2">{game.host}</p>
            </div>

            <div>
                <h1 className="font-bold lg:-ml-6 md:-ml-6 sm:-ml-6 text-4xl" >
                    VS
                </h1>
            </div>
            <div className="w-32 h-32 mt-6 flex-col justify-center">
                <div className=" relative w-28 h-28 border bg-background rounded-sm">
                  {/* <img src={game.guestImg} alt="pfp" className="rounded-sm "/> */}
                      <Image
                      src={guestImg}
                      alt={game.guest}
                      fill
                      className="rounded-sm object-cover"
                      unoptimized
                    />
                </div>
                <p className="ml-10 mt-2">{game.guest}</p>
            </div>
           </div>
           <div className="mt-8 ">
             <Table>
                    <TableBody>
                         <TableRow className={hostScore > guestScore ? "left-overtake" : "right-overtake"}>
                             <TableCell  className="text-left ">{hostScore}</TableCell>
                            <TableHead  className="text-center font-semibold">{t('profile.finalScore')}</TableHead>
                            <TableCell  className="text-right">{guestScore}</TableCell>
                        </TableRow>
                          <TableRow className={hostTouches > guestTouches ? "left-overtake" : "right-overtake"}>
                             <TableCell  className="text-left ">{hostTouches}</TableCell>
                            <TableHead  className="text-center font-semibold">{t('profile.touches')}</TableHead>
                            <TableCell  className="text-right">{guestTouches}</TableCell>
                        </TableRow>
                          <TableRow className={hostStreak > guestStreak ? "left-overtake" : "right-overtake"}>
                             <TableCell  className="text-left">{hostStreak}</TableCell>
                            <TableHead  className="text-center font-semibold">{t('profile.maxStreak')}</TableHead>
                            <TableCell  className="text-right">{guestStreak}</TableCell>
                        </TableRow>
                         <TableRow className={hostLeading > guestLeading ? "left-overtake" : "right-overtake"}>
                             <TableCell  className="text-left w-23">{formatDuration(game.hostLeadingTime)}</TableCell>
                            <TableHead  className="text-center font-semibold">{t('profile.maxLeadingTime')}</TableHead>
                            <TableCell  className="text-right max-w-10 ">{formatDuration(game.guestLeadingTime)}</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
           </div>
            {
              <MatchStats duration={formatDuration(game.duration)} totalTouches={game.total_touches || 0} pointsPerSecond={game.points_per_second || 0} maxSpeed={game.ball_max_speed || 0} />

            }
          </div>
        </div>
      }
    </div>
  )
}
