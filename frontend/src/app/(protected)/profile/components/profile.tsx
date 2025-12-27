"use client"

import { useState} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { Target, TrendingUp, Calendar, Award, BarChart3, Activity, Clock, Trophy } from "lucide-react"
import { PerformanceChart } from "./performance-chart"
import { MatchHistoryTable } from "./match-history-table"
import { StatsOverview } from "./stats-overview"
import { PlayerBanner } from "./player-banner"
import { RankBanner } from "./rank-banner"
import { useCountUp, formatDuration } from "../hooks/useCountUp"
import { User } from "@/types/user"
import {getProfileImageUrl} from '@/lib/utils'
import { useUserStore } from "@/store/userStore"



interface ProfileProps {
  user: User
}




export  function Profile({user} : ProfileProps)  {

const [overviewV, setOverviewV] = useState(true);
// const [matchHistoryV, setMatchHistoryV] = useState(false);
const [AnalyticsV, setAnalyticsV] = useState(false);
const [activeTab, setActiveTab] = useState("overview");
const {friends} = useUserStore();



const getRank = (): "gold" | "silver" | "bronze" => {
  if (user.xp > 42000) return "gold";
  else if (user.xp > 21000) return "silver";
  return "bronze";
};

  const userStats = {
  id : user.id,
  username : user.username,
  fullName: user.fullname,
  avatar: getProfileImageUrl(user.avatar),
  rankType: getRank(),
  experience: user.xp,
  conversationId: friends?.filter(item => item.id_user == user.id)[0]?.conversation_id || -1,
  expForLevel: 1000,

  totalMatches: user.totalMatches,
  wins: user.wins,
  losses: user.losses,
  winRate: user.winRate || 0,
  currentStreak: user.currentStreak,
  totalTournaments: 4,
  tournamentsWon: 2,
  bestStreak: 12,
  averageScore: user.averageScore || 0,
  level: Math.floor(user.xp / 1000),
  bronzePlayers: user.bronzePlayers,
  silverPlayers : user.silverPlayers,
  goldPlayers : user.goldPlayers,
}

const recentMatches = user.recentMatches;
  
const _levelProgress = useCountUp(userStats.experience % userStats.expForLevel / 10, 700); 


  return (
    <div className="">
      <div className="container mx-auto ">
        <div className="mb-8">
          <PlayerBanner userStats={userStats} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
            <RankBanner rank="bronze" title="Bronze League" description="Entry Level Players" count={userStats.bronzePlayers} />
          </div>
          <div className="transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
            <RankBanner rank="silver" title="Silver League" description="Intermediate Players" count={userStats.silverPlayers} />
          </div>
          <div className="transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
            <RankBanner rank="gold" title="Gold League" description="Elite Players" count={userStats.goldPlayers} />
          </div> 
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-border/50 ">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
              onClick={() => {setOverviewV(true); setAnalyticsV(false);}}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
              onClick={() => {setOverviewV(false);  setAnalyticsV(false); }}
            >
              <Calendar className="w-4 h-4" />
              Match History
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
              onClick={() => {setOverviewV(false);  setAnalyticsV(true);}}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent data-showo={overviewV} value="overview" className="space-y-6 transition-all duration-300 opacity-0 scale-95  data-[showo=true]:opacity-100 data-[showo=true]:scale-100">
            <StatsOverview userStats={userStats} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 cosmic-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Experience level</CardTitle>
                  <Target className="h-2 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">Level {userStats.level}</div>
                  <Progress value={_levelProgress} className="mt-2 " />
                    <p className="text-xs text-muted-foreground pt-2">{userStats.experience} / {userStats.level * userStats.expForLevel + userStats.expForLevel}</p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50 cosmic-glow-accent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Tournaments</CardTitle>
                  <Trophy className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{userStats.totalTournaments}</div>
                  <p className="text-xs text-muted-foreground">{userStats.tournamentsWon}W / {userStats.totalTournaments}</p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Battles</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{userStats.totalMatches}</div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.wins}W / {userStats.losses}L
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-card-foreground">Avg Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{userStats?.averageScore?.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">points per battle</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Matches
                </CardTitle>
                <CardDescription className="text-muted-foreground">Your latest game results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={match.result === "Win" ? "default" : "destructive"}
                          className={match.result === "Win" ? "bg-accent text-accent-foreground" : ""}
                        >
                          {match.result === "Win" ? "Victory" : "Defeat"}
                        </Badge>
                        <div>
                          <p className="font-medium text-card-foreground">vs {match.opponent}</p>
                          <p className="text-sm text-muted-foreground">{match.game_date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-card-foreground">{match.score}</p>
                        <p className="text-xs text-muted-foreground">{formatDuration(match.duration)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground cosmic-glow"
                  onClick={() => setActiveTab("matches")}
                >
                  View All Battles
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent data-show={activeTab == "matches" ? true : false} value="matches" className="space-y-6 transition-all duration-800 data-[show=false]:opacity-0 data-[show=true]:opacity-100">
            <MatchHistoryTable username={user.username}/>
          </TabsContent>

          <TabsContent data-show={AnalyticsV} value="performance" className="space-y-6 transition-all duration-300 opacity-0 scale-95  data-[show=true]:opacity-100 data-[show=true]:scale-100">
            <PerformanceChart username={userStats.username}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
