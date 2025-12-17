export interface ServerGameState {
  player1: { id: number; username: string; y: number; score: number; customization: any; };
  player2: { id: number; username:string; y: number; score: number; customization: any; };
  ball: { x: number; y: number; dx: number; dy: number; };
  roomCode?: string;
  matchId?: number;
}

export interface Player {
  id?: string | number;
  name: string;
  avatar?: string;
  color?: string;
}
