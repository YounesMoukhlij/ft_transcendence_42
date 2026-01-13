import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Users, Medal, Crown, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from '@/contexts/LanguageContext';


interface RankBannerProps {
  rank: "bronze" | "silver" | "gold"
  title: string
  description: string
  count: number
}

export function RankBanner({ rank, title, description, count }: RankBannerProps) {
  const {t} = useTranslation();
  const getRankConfig = (rankType: string) => {
    switch (rankType) {
      case "bronze":
        return {
          class: "rank-bronze",
          icon: Shield,
          bgGradient: "from-amber-900/10 to-orange-900/10",
          borderColor: "border-amber-700/30",
        }
      case "silver":
        return {
          class: "rank-silver",
          icon: Medal,
          bgGradient: "from-slate-600/10 to-slate-700/10",
          borderColor: "border-slate-500/30",
        }
      case "gold":
        return {
          class: "rank-gold",
          icon: Crown,
          bgGradient: "from-yellow-700/10 to-amber-700/10",
          borderColor: "border-yellow-600/30",
        }
      default:
        return {
          class: "rank-bronze",
          icon: Shield,
          bgGradient: "from-amber-900/10 to-orange-900/10",
          borderColor: "border-amber-700/30",
        }
    }
  }

  const config = getRankConfig(rank)
  const IconComponent = config.icon
  const router = useRouter();
  return (
    <Card
    onClick={() => router.push(`/leagues/${rank}`)}
      className={`bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm border ${config.borderColor} overflow-hidden hover:shadow-lg transition-all duration-300`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-card/50">
              <IconComponent className="w-5 h-5" />
            </div>
            {title}
          </CardTitle>
          <Badge className={`${config.class}  secondary text-white font-medium px-3 py-1`}>{rank.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xl font-bold text-card-foreground">{count.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">{count == 1 ? t('profile.player') : t('profile.players')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
