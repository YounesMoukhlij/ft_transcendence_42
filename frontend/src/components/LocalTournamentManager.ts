import { Player, TournamentMatch } from './GameContext';

/**
 * Local Tournament Manager
 * Handles all tournament bracket logic for local tournaments
 * Completely separate from remote tournament logic
 */
export default class LocalTournamentManager {
  private players: Player[];
  private bracket: TournamentMatch[];
  private matchResults: Map<number, Player> = new Map();

  constructor(players: Player[]) {
    this.players = players;
    this.bracket = this.createBracket(players);
  }

  /**
   * Create tournament bracket for 4 players
   * Local tournaments only support 4 players
   */
  private createBracket(players: Player[]): TournamentMatch[] {
    const bracket: TournamentMatch[] = [];
    const playerCount = players.length;

    if (playerCount !== 4) {
      throw new Error('Local tournaments only support 4 players');
    }

    // Semi-finals (Round 1)
    bracket.push({
      id: 1,
      round: 1,
      player1: players[0],
      player2: players[1],
      status: 'pending',
      winner: null,
    });
    bracket.push({
      id: 2,
      round: 1,
      player1: players[2],
      player2: players[3],
      status: 'pending',
      winner: null,
    });
    // Final (Round 2)
    bracket.push({
      id: 3,
      round: 2,
      player1: null as Player | null,
      player2: null as Player | null,
      status: 'pending',
      winner: null,
    });

    return bracket;
  }

  /**
   * Get the bracket
   */
  getBracket(): TournamentMatch[] {
    return this.bracket;
  }

  /**
   * Set match winner and advance to next round
   */
  setMatchWinner(matchId: number, winner: Player): void {
    const match = this.bracket.find(m => m.id === matchId);
    if (!match) return;

    match.winner = winner;
    match.status = 'finished';
    this.matchResults.set(matchId, winner);

    // Advance winner to next round
    this.advanceWinner(match, winner);
  }

  /**
   * Advance winner to the next round
   */
  private advanceWinner(match: TournamentMatch, winner: Player): void {
    const currentRound = match.round;
    const nextRound = currentRound + 1;

    // Find the next round match for this position
    const nextRoundMatches = this.bracket.filter(m => m.round === nextRound);
    if (nextRoundMatches.length === 0) return;

    // Determine which match in the next round this winner should go to
    const currentRoundMatches = this.bracket.filter(m => m.round === currentRound);
    const matchIndex = currentRoundMatches.findIndex(m => m.id === match.id);

    if (matchIndex === -1) return;

    // For 4 players: 2 semi-finals -> 1 final
    if (this.players.length === 4) {
      // Semi-final winner goes to final
      if (currentRound === 1) {
        const finalMatch = nextRoundMatches[0];
        if (matchIndex === 0) {
          finalMatch.player1 = winner;
        } else {
          finalMatch.player2 = winner;
        }
        // Match is ready when both players are set (status remains 'pending' until started)
      }
    }
  }

  /**
   * Get the next match index that's ready to play
   */
  getNextMatchIndex(currentIndex: number): number {
    // Find the next match that has both players and is ready to play
    // Start searching from currentIndex + 1 to avoid returning the same match
    for (let i = currentIndex + 1; i < this.bracket.length; i++) {
      const match = this.bracket[i];
      if (match.status === 'pending' && match.player1 && match.player2 && !match.winner) {
        return i;
      }
    }
    // If no match found after currentIndex, search from the beginning
    // This handles the case where we need to go back to an earlier match
    for (let i = 0; i <= currentIndex; i++) {
      const match = this.bracket[i];
      if (match.status === 'pending' && match.player1 && match.player2 && !match.winner) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Get the tournament champion
   */
  getChampion(): Player | null {
    const finalMatch = this.bracket.find(m => {
      const maxRound = Math.max(...this.bracket.map(b => b.round));
      return m.round === maxRound;
    });
    return finalMatch?.winner || null;
  }

  /**
   * Check if tournament is complete
   */
  isComplete(): boolean {
    return this.getChampion() !== null;
  }

  /**
   * Get match by index
   */
  getMatch(index: number): TournamentMatch | null {
    if (index < 0 || index >= this.bracket.length) return null;
    return this.bracket[index];
  }
}

