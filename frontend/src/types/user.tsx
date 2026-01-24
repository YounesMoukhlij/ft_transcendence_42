export interface User
{
  id : number,
  username: string,
  fullname: string,
  avatar: string,
  xp: number,
  conversationId: number,
  totalMatches: number,
  wins: number,
  losses: number,
  winRate: number,
  currentStreak: number,
  totalTournaments: number,
  tournamentsWon: number,
  averageScore: number,
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
    type: string,
    tournament_id: number,
    total_touches: number,
    points_per_second: number,
    ball_max_speed: number,
    blockChainHash: string,

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