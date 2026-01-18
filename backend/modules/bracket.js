import { timeStamp } from "console";
import { contract } from "../config/blockchain.js";
import { Block } from "ethers";

export async function getTournamentBracket(request, reply) {

  const tournament_id = request.params.id;
  
  if (!tournament_id) {
    return reply.code(400).send({ error: "tournament id is required" });
  }
  
  try{
    const query = request.server.db.prepare(
      `select game_date as date, 
      (select username from users where id_user=user_win) as winner,
      user_win as winner_id,
      (select username from users where id_user=user_lose) as loser,
      user_lose as loser_id,
      win_score, lose_score from game_history
       where tournament_id =? ORDER BY game_date`
  );
    const tournament = query.all(tournament_id); 
    if (!tournament || tournament.length === 0) {
      return reply.code(404).send({ error: "tournament not found" });
    }

  let Matches = [];
  let firstWinner; 
    tournament.forEach((element, index) => {

      if (index < 2)
      {
        let i = Math.floor(Math.random() * 9999) + 1; 
        let result = i % 2 === 0;
       
        let obj =  {
          host :  result ? element.winner : element.loser,
          guest : !result ? element.winner : element.loser,
          host_score :  result ? element.win_score : element.lose_score,
          guest_score : !result ? element.win_score : element.lose_score,
          host_id : result ? element.winner_id : element.loser_id,
          guest_id : !result ? element.winner_id : element.loser_id,
          date:  element.date,
          winner : element.winner_id,
        }
        if (index == 0)
          firstWinner = element.winner_id;   
       Matches.push(obj);
      }
      else if (index == 2)
      {
        let result = element.winner_id == firstWinner;
        let obj =  {
          host :  result ? element.winner : element.loser,
          guest : !result ? element.winner : element.loser,
          host_score :  result ? element.win_score : element.lose_score,
          guest_score : !result ? element.win_score : element.lose_score,
          host_id : result ? element.winner_id : element.loser_id,
          guest_id : !result ? element.winner_id : element.loser_id,
          date:  element.date,
          winner : element.winner_id,
          winner_name: element.winner
        }
        Matches.push(obj); 
      }
    });

    return reply.code(200).send(Matches);
  } catch (err) {
    
    return reply.code(500).send({ error: "Internal server error" });
  }
}




export async function recordMatchOnBlockChain(request, reply) {
   const {
      user_win,
      user_lose,
      win_score,
      lose_score,

      type = "casual",
      tournament_id = null,

      duration = null,
      longest_rally = null,
      average_rally = null,
      ball_max_speed = null,

      touches_win = null,
      touches_lose = null,
      max_points_streak_win = null,
      max_points_streak_lose = null,
      max_leading_time_win = null,
      max_leading_time_lose = null,

    } = request.body;

    // Basic validation
    if (!user_win || !user_lose || win_score == null || lose_score == null) {
      return reply.code(400).send({ error: "Missing required fields" });
    }

    const createRowQuery = request.server.db.prepare(`
      INSERT INTO game_history (
        user_win,
        user_lose,
        win_score,
        lose_score,
        type,
        tournament_id,
        duration,
        longest_rally,
        average_rally,
        ball_max_speed,
        touches_win,
        touches_lose,
        max_points_streak_win,
        max_points_streak_lose,
        max_leading_time_win,
        max_leading_time_lose
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const params = [
      user_win,
      user_lose,
      win_score,
      lose_score,
      type,
      tournament_id,
      duration,
      longest_rally,
      average_rally,
      ball_max_speed,
      touches_win,
      touches_lose,
      max_points_streak_win,
      max_points_streak_lose,
      max_leading_time_win,
      max_leading_time_lose
    ];

    try {
      const result = createRowQuery.run(...params);

    // blockchain needs game_id so : insert data to DB get the game ID
    // store in blockchain get transaction hash and UPDATE the db 
    if (type == 'tournament')
    {
      const gameHistoryId = result.lastInsertRowid;
      const winnerName = "TBD";
      const loserName = "TBD";
      const tournamentName = "DOESNT MATTER";
      
      
      
      const tx = await contract.recordMatch(
        gameHistoryId,
        user_win,
        user_lose,
        tournament_id,
        winnerName,
        loserName,
        win_score,
        lose_score,
        tournamentName
      );
      
      const receipt = await tx.wait();
      const transaction_hash = receipt.transactionHash;
      
      const updateRowQuery = request.server.db.prepare(` UPDATE game_history set blockchain_hash = ? where game_history_id = ?`);
      
      const finalResult = await updateRowQuery.run(transaction_hash, gameHistoryId);
    }

      return reply.code(201).send({
        success: true,
      });
    } catch (err) {
      console.error("Error in recordMatchonBlockChain:", err);
      reply.code(500).send({ error: "Transaction failed" });
    }
}


export async function getMatchFromBlockChainById(request, response)
{

  try {
    const id = request.params.id;
    if (!id) {
      return response.code(400).send({ error: "Match ID is required" });
    }
    if (isNaN(id)) {
      return response.code(400).send({ error: "Match ID must be a number" });
    }
    const BlockChainmatch = await contract.getMatchById(id);
    const match = {
         matchId: Number(BlockChainmatch.matchId),
        winnerName: BlockChainmatch.winnerName,
        loserName: BlockChainmatch.loserName,
        winnerScore: Number(BlockChainmatch.winnerScore),
        loserScore: Number(BlockChainmatch.loserScore),
        tournamentName: BlockChainmatch.tournamentName,
        winnerId : Number(BlockChainmatch.winnerId),
        loserId : Number(BlockChainmatch.loserId),
        tournamentId : Number(BlockChainmatch.tournamentId),
        timestamp : Number(BlockChainmatch.timestamp),
      }
    return response.code(200).send(match);

  }
  catch(err)
  {
    if (err.code == "CALL_EXCEPTION") {
      return response.code(404).send({ error: err.reason });
    }
    return response.code(500).send({ error: "Fetching data from blockchain failed" });
  }
}


export async function getTournamentMatchesFromBlockChain(request, response)
{

  try {
    const id = request.params.id;

    if (!id) {
      return response.code(400).send({ error: "Tournament ID is required" });
    }
    if (isNaN(id)) {
      return response.code(400).send({ error: "Tournament ID must be a number" });
    }
    
    const BlockChainmatches = await contract.getMatchesByTournament(tournament);
    
    let matches = [];

    console.log("matches: ", BlockChainmatches);
    BlockChainmatches.forEach((element) => {
      const match = {
        matchId: Number(element.matchId),
        winnerName: element.winnerName,
        loserName: element.loserName,
        winnerScore: Number(element.winnerScore),
        loserScore: Number(element.loserScore),
        tournamentName: element.tournamentName,
        winnerId : Number(element.winnerId),
        loserId : Number(element.loserId),
        tournamentId : Number(element.tournamentId),
        timestamp : Number(element.timestamp),
      }
      matches.push(match);
    });

    return response.code(200).send(matches);

  }
  catch(err)
  {
    if (err.code == "CALL_EXCEPTION") {
      return response.code(404).send({ error: err.reason });
    }
    return response.code(500).send({ error: "Fetching data from blockchain failed" });
  }
}