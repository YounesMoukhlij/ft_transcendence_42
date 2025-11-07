// types/user.ts


export interface User
{
  username: string,
  fullname: string,
  avatar: string,
  xp: number,
  // rank: string,
  // rankType: string,
  // expForLevel: number,
  totalMatches: number,
  wins: number,
  losses: number,
  winRate: number,
  currentStreak: number,
  // totalTournaments: number,
  // tournamentsWon: number,
  // bestStreak: number,
  averageScore: number,
  // level: number,
  // Friends : string,
  bronzePlayers: number,
  silverPlayers : number,
  goldPlayers : number,
  recentMatches : MatchData[]
}
export interface MatchData
{
    id: number,
    winner: string,
    loser: string,
    win_score: number,
    lose_score: number,
    game_date: string,
    duration: number,
    opponent: string,
    score: string,
    result: string
}


export interface GameDetails
{
    id: number,
    host: string,
    guest: string,
    game_date: string,
  
    duration: number,
    longest_rally: number,
    average_rally: number,
    ball_max_speed: number,

    hostScore: number,
    guestScore: number,
    hostTouches: number;
    guestTouches: number;
    hostMaxStreak: number,
    guestMaxStreak: number,
    hostLeadingTime: number,
    guestLeadingTime: number,

    hostImg: string,
    guestImg: string


    opponent: string,
    score: string,
    result: string
  }