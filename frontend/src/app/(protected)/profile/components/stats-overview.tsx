import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Trophy, TrendingUp, Users } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { useCountUp } from "../hooks/useCountUp"

interface UserStats {
  name: string
  avatar: string
  winRate: number
  totalMatches: number
  wins: number
  losses: number
  currentStreak: number
  bestStreak: number
  averageScore: number
  Friends : string[]
}

interface StatsOverviewProps {
  userStats: UserStats
}

export function StatsOverview({ userStats }: StatsOverviewProps) {
const [isFriend, setIsFriend] = useState<boolean>(false);
const _winRate = useCountUp(userStats.winRate, 700);
const _totalMatches = useCountUp(userStats.totalMatches, 700);
const _wins = useCountUp(userStats.wins, 700);
const _avgPoints = useCountUp(Math.round(userStats.averageScore * 100) / 100, 700);




  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Player Profile Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-bold text-lg">{userStats.name}</h3>
            <Button variant="outline"
                  className="w-fullmt-2 mr-2 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground cosmic-glow rounded-xxl">
              {isFriend ? "Unfriend" : "Add Friend"}
            </Button>
             <Button variant="destructive" className="mt-2">
              message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Summary
          </CardTitle>
          <CardDescription>Your overall statistics and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{_winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <div className="text-2xl font-bold text-accent">{_wins}</div>
              <div className="text-sm text-muted-foreground">Total Wins</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{_totalMatches}</div>
              <div className="text-sm text-muted-foreground">Matches Played</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{_avgPoints}</div>
              <div className="text-sm text-muted-foreground">Avg Points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
