export interface ServerGameState {
  player1: { id: number; username: string; y: number; score: number; customization: any; };
  player2: { id: number; username:string; y: number; score: number; customization: any; };
  ball: { x: number; y: number; dx: number; dy: number; };
}
