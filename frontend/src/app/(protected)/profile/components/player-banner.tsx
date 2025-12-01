
import { useTranslation } from "../../../../contexts/LanguageContext"

interface PlayerBannerProps {
  userStats: {
    username : string
    fullName: string
    avatar: string
    rankType: "bronze" | "silver" | "gold"
    winRate: number
    level: number
    currentStreak: number
  }
}


export function PlayerBanner({ userStats }: PlayerBannerProps) {
  const { t } = useTranslation();
  const getRankClass = (rankType: string) => {
    switch (rankType) {
      case "bronze":
        return "bronze-theme"
        case "silver":
          return "silver-theme"
          case "gold":
            return "gold-theme"
            default:
              return "bronze-theme"
            }
          }


          return (
           <div
  className={ getRankClass(userStats.rankType) + " w-full mx-auto artistic-background shadow-2xl p-8 flex items-center justify-between space-x-8"}
>
        <div className="flex-grow flex items-center justify-start space-x-4 z-20">


            <div className="w-20  md:w-20 sm:w-15 xs:h-10 h-20 md:w-15 sm:h-15 xs:h-10  bg-gray-800 rounded-full flex items-center justify-center text-3xl text-gray-500 shadow-lg border border-yellow-700/50">
                <img src={userStats.avatar} alt={userStats.username} className="rounded-full" />
            </div>


            <div>
                <h2 className="text-3xl font-extrabold text-white">
                   {userStats.fullName?.toUpperCase()}
                </h2>
                <h1 className="font-extrabold text-lg gold-highlight uppercase tracking-widest font-sans">
                    {userStats.rankType.toUpperCase()} LEAGUE
                </h1>
            </div>

        </div>


        <div className="flex-shrink-0 flex items-center space-x-8 text-right z-20 hidden sm:flex ">

            <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold gold-highlight">
                    {userStats.winRate}%
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                    {t('profile.victoryRate')}
                </span>
            </div>

            <div className="flex flex-col items-center ">
                <span className="text-4xl font-extrabold gold-highlight">
                    {userStats.currentStreak}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider mt-1 ">
                    {t('profile.currentStreak')}
                </span>
            </div>

        </div>
    </div>
  )
}
