import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Trophy, TrendingUp, Users } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { useCountUp } from "../hooks/useCountUp"
import { useUserStore } from "@/store/userStore";
import axios from "axios"

const API_URL = `http://${process.env.NEXT_PUBLIC_BACKEND_IP}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

interface UserStats {
  id: number,
  username: string
  fullName: string
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
interface Friend {
  id_user: number;
  username: string;
  profile_img: string;
  status: number;
  LastMessage?: string;
  LastMessageTime?: string;
}

interface User {
  id_user: number;
  username: string;
  profile_img: string;
}







export function StatsOverview({ userStats }: StatsOverviewProps) {
const { user: currentUser, friends, addFriend, removeFriend } = useUserStore();

const _winRate = useCountUp(userStats.winRate, 700);
const _totalMatches = useCountUp(userStats.totalMatches, 700);
const _wins = useCountUp(userStats.wins, 700);
const _avgPoints = useCountUp(Math.round(userStats.averageScore * 100) / 100, 700);


// 1. isSelfProfile
const isSelfProfile: boolean =
  currentUser?.username === userStats.username;



// 3. isFriend
const isFriend: boolean = friends?.some(
  (f: Friend) => f.username === userStats.username
);


const handleAddFriend = async () => {
  try {
    await axios.post(
      `${API_URL}/sendRequestFriend`,
      { friend_id: userStats.id },
      {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      }
    );
    console.log("Friend request sent");
  } catch (err) {
    console.log(err);
  }
};

const handleUnfriend = async () =>
{
   try {
      //  Get conversation ID
      const conversation_id = await axios.post(
        `${API_URL}/getConversationId`,
        { friend_id: userStats.id },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        }
      );

      const conv_id : number = conversation_id.data.conversation_id;
      console.log("Conversation ID:", conv_id);

      //  Unfriend
      await axios.post(
        `${API_URL}/unfriend`,
        {
          user: currentUser.username,
          conv_id : conv_id,
          friend: userStats.username,
          friend_id: userStats.id,
        }
      );

      console.log("Unfriend done");

      // //  Update Zustand
      removeFriend(userStats.username);

    } catch (err) {
      console.log(err);
    }
}



console.log(userStats.username, " is friend with ", currentUser?.username , " ", isFriend, "with ID: ", userStats.id);

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
            <h3 className="font-bold text-lg">{userStats.fullName}</h3>


            {
              !isSelfProfile &&
             <>
            <Button
              onClick={!isFriend ? handleAddFriend : handleUnfriend}
              variant="outline"
              className="w-fullmt-2 mr-2 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground cosmic-glow rounded-xxl">
              {isFriend ? "Unfriend" : "Add Friend"}
            </Button>
             <Button variant="destructive" className="mt-2">
              message
            </Button>
            </>
             }
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
