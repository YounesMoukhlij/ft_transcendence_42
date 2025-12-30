import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Trophy, TrendingUp, Users } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useCountUp } from "../hooks/useCountUp"
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react"
import api from "@/lib/api"

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
  conversationId: number,
}

interface StatsOverviewProps {
  userStats: UserStats
}


export function StatsOverview({ userStats }: StatsOverviewProps) {
const { user: currentUser, friends, addFriend, removeFriend, pendingRequests, removePendingRequests,  sentRequests, addSentRequests, removeSentRequests  } = useUserStore();

const _winRate = useCountUp(userStats.winRate, 700) || 0;
const _totalMatches = useCountUp(userStats.totalMatches, 700);
const _wins = useCountUp(userStats.wins, 700);
const _avgPoints = useCountUp(Math.round(userStats.averageScore * 100) / 100, 700);


const [friendshipText, setFriendshipText] = useState("Add Friend");


// 1. isSelfProfile
const isSelfProfile: boolean =
  currentUser?.username === userStats.username;



// 3. friendship Status 

useEffect(() => {
  const friendshipStatus = () => 
{
  // handleClick();
  if (sentRequests?.find(friend => friend.getter_user === userStats.id))
    setFriendshipText("Cancel request");

  else if (friends?.find(friend => friend.id_user === userStats.id))
  {
    setFriendshipText("Unfriend");
  }

  else if (pendingRequests?.find(friend => friend.sender_user === userStats.id))
   setFriendshipText("Accept");
  else
  {
    setFriendshipText("Add friend");
  }
}
friendshipStatus();
}, [pendingRequests, sentRequests, friends]) 

const handleAction = () => 
{
  if (friendshipText === "Cancel request")
  {

    handleCancelFriendRequest();
  }
  else if (friendshipText === "Unfriend")
  {
    handleUnfriend();
  }
  else if (friendshipText === "Add friend")
  {
    handleAddFriend();
    }
  else if (friendshipText === "Accept")
  {
    handleAcceptFriend();
  }
}




const router = useRouter();


const handleAddFriend = async () => {
  try {
      const res = await api.post(
      `/api/sendRequestFriend`,
      { id: userStats.id },
      {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      }
    );
    if (res.status === 200)
    {
      addSentRequests({
        getter_user: userStats.id,
        notify_id: res.data,
      });
    }

  } catch (err) {
    console.log(err);
  }
};


const handleAcceptFriend = async () => {
  try {
    const res = await api.post(
      `/AddFriend`,
    {
      id: userStats.id,
    },{
      headers: {
        Authorization: `Bearer ${currentUser?.access_token}`,
      }
    }
  );
    if (res.status === 200)
    {
      removePendingRequests(userStats.id);
      addFriend({
        id_user: userStats.id,
        username: userStats.username,
        status : "accepted",
      });
    }
  } catch (err) {
    console.log(err);
  }
};




const handleUnfriend = async () => 
{
   try {
      //  Get conversation ID
      // const conversation_id = await api.get(
      //   `/getConversationId`,
      //   { id: userStats.id },
      //     headers: {
      //       Authorization: `Bearer ${currentUser?.access_token}`,
      //     },
      // );

      // const conv_id : number = conversation_id.data.conversation_id;

      //  Unfriend

     const res =  await api.post(
        `/api/unfriend`,
        {
          // user: currentUser.username,
          conv_id : userStats.conversationId,
          // friend: userStats.username,
          friend_id: userStats.id,
        },{
          headers: {
            Authorization: `Bearer ${currentUser.access_token}` 
          }
        }
      );

    if (res.status === 200)
    {
      removeFriend(userStats.id);
    }

    } catch (err) {
      console.log(err);
    }
}
const rejectFriendRequest = async () => {

   try {
      //  Reject friend request
      const notify_id = pendingRequests.filter(object => object.sender_user == userStats.id)[0].notify_id;
     const res =  await api.delete(`/DeleteFriendRequest` , {
      params:{
        id: notify_id,
      },
      headers: {
        Authorization: `Bearer ${currentUser.access_token}`
      }
    });

    if (res.status === 200)
    {
      removePendingRequests(userStats.id);
    }

    } catch (err) {
      console.log(err);
    }
}

const handleCancelFriendRequest = async () => {
  try {
   const notify_id = sentRequests.filter(object => object.getter_user == userStats.id)[0].notify_id;
    const res = await api.delete(
      `/api/cancelFriendRequest`,
     {
      params:{
        id: notify_id,
      },
      headers: {
        Authorization: `Bearer ${currentUser.access_token}`
      }
    });
    if (res.status === 200)
    {
      removeSentRequests(userStats.id);
    }
  } catch (err) {
    console.log(err);
  }
};

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
              onClick={handleAction}
              data-state={friendshipText !== "Unfriend"}
              variant="outline"
              className="w-fullmt-2 mr-2 bg-transparent data-[state=false]:border-destructive data-[state=false]:text-destructive data-[state=false]:hover:bg-destructive border-primary data-[state=false]:hover:text-destructive-foreground text-primary hover:bg-primary hover:text-primary-foreground cosmic-glow rounded-xxl">
              {friendshipText}
            </Button>
            {friendshipText == "Accept" && 
                  <Button 
            variant="destructive" 
            className="mt-2"
            onClick={rejectFriendRequest}
            >
              Reject
            </Button>
          }

            {friendshipText == "Unfriend" &&
             <Button 
             variant="default" 
             className="mt-2"
             onClick={() => router.push(`/chat?friend=${userStats.id}`)} // http://localhost:3000/chat?friend=5
             >
              message
            </Button>
            }
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
