
import jwt from 'jsonwebtoken';



export async function getUserStatsbyId(request, reply) {

  const id = request.params.id;
  try {
    const query = request.server.db.prepare(
      "SELECT id_user as id, username, fullname, xp, profile_img as avatar FROM users WHERE id_user = ?"
    );
    const userStats = query.get(id);
    if (!userStats) return reply.code(404).send({ error: "User not found" });


    const matchesQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win=? OR user_lose=?"
    );
    const totalMatches = matchesQuery.get(id, id);
    
     const winsQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win = ?"
    );
    const wins = winsQuery.get(id);


    const lossesQuery = request.server.db.prepare(
      "select COUNT(*) as total from game_history WHERE user_lose=?"
    );
    const losses = lossesQuery.get(id);

    const winRate = Math.floor(Number(wins.total) / Number(totalMatches.total) * 100);


    const currentStreakQuery = request.server.db.prepare(`select COUNT(*) as total from game_history
      where user_win=? AND
      game_history_id > (select max(game_history_id) from game_history 
      where user_lose=?)`)

    const currentStreak = currentStreakQuery.get(id, id);


    const winGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=?`);
    
    const winGoals = winGoalsQuery.get(id);

    const lossGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=?`);

    const lossGoals = lossGoalsQuery.get(id);

  //-------------------------------------------------------
    const bronzePlayersQuery = request.server.db.prepare(
      `select Count(*) as total from users where xp < 21000`
    );
    const bronzePlayersCount = bronzePlayersQuery.get();

    //-------------------------------------------------------
      const silverPlayersQuery = request.server.db.prepare(
      `select Count(*) as total from users where xp > 21000 AND xp < 42000`
    );
    const silverPlayersCount = silverPlayersQuery.get();
    //-------------------------------------------------------
      const goldPlayersQuery = request.server.db.prepare(
      `select Count(*) as total from users where xp > 42000`
    );
    const goldPlayersCount = goldPlayersQuery.get();
    //-------------------------------------------------------
      const recentMatchesQuery = request.server.db.prepare(
        `select game_history_id as id, user_win as winner_id, (select username from users where id_user=user_win) as winner, (select username from users where id_user=user_lose) as loser, win_score
, lose_score, game_date, duration from game_history where user_win=? OR user_lose=? ORDER BY game_date DESC limit 4;`
      );

      const recentMatches = recentMatchesQuery.all(id, id);

    recentMatches.forEach(match => {
  match.opponent = match.winner_id === id ? match.loser : match.winner;
  match.result = match.winner_id == id ? "Win" : "Lose";
  let userScore = match.winner_id === id ? match.win_score : match.lose_score;
  let opponentScore = match.winner_id === id ? match.lose_score : match.win_score;
  match.score = `${userScore} - ${opponentScore}`;
  });

    userStats.totalMatches = totalMatches.total;
    userStats.wins = wins.total;
    userStats.losses = losses.total;
    userStats.winRate = winRate;
    userStats.currentStreak = currentStreak.total;
    userStats.averageScore = (Number(winGoals.total) + Number(lossGoals.total)) / Number(totalMatches.total);
    userStats.bronzePlayers = Number(bronzePlayersCount.total);
    userStats.silverPlayers = Number(silverPlayersCount.total);
    userStats.goldPlayers = Number(goldPlayersCount.total);
    userStats.recentMatches = recentMatches;
    return reply.send(userStats);
  } catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}


export async function getUserStats(request, reply) {



  const id = request.user.id_user
  

  try {
    const query = request.server.db.prepare(
      "SELECT id_user as id, username, fullname, xp, profile_img as avatar FROM users WHERE id_user = ?"
    );
    const userStats = query.get(id);

    if (!userStats) return reply.code(404).send({ error: "User not found" });


    const matchesQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win=? OR user_lose=?"
    );
    const totalMatches = matchesQuery.get(id, id);
    
     const winsQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win = ?"
    );
    const wins = winsQuery.get(id);


    const lossesQuery = request.server.db.prepare(
      "select COUNT(*) as total from game_history WHERE user_lose = ?"
    );
    const losses = lossesQuery.get(id);

    const winRate = Math.floor(Number(wins.total) / Number(totalMatches.total) * 100);


    const currentStreakQuery = request.server.db.prepare(`select COUNT(*) as total from game_history
      where user_win=? AND
      game_history_id > (select max(game_history_id) from game_history 
      where user_lose=?)`)

    const currentStreak = currentStreakQuery.get(id, id);


    const winGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=?`);
    
    const winGoals = winGoalsQuery.get(id);

    const lossGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=?`);

    const lossGoals = lossGoalsQuery.get(id);

  //-------------------------------------------------------
    const bronzePlayersQuery = request.server.db.prepare(
      `select Count(*) as total from users where xp < 21000`
    );
    const bronzePlayersCount = bronzePlayersQuery.get();

    //-------------------------------------------------------
      const silverPlayersQuery = request.server.db.prepare(
      `select Count(*) as total from users where xp > 21000 AND xp < 42000`
    );
    const silverPlayersCount = silverPlayersQuery.get();
    //-------------------------------------------------------
      const goldPlayersQuery = request.server.db.prepare(
      `select Count(*) as total from users where xp > 42000`
    );
    const goldPlayersCount = goldPlayersQuery.get();
    //-------------------------------------------------------
      const recentMatchesQuery = request.server.db.prepare(
        `select game_history_id as id, user_win as winner_id, (select username from users where id_user=user_win) as winner, (select username from users where id_user=user_lose) as loser, win_score
, lose_score, game_date, duration from game_history where user_win=? OR user_lose=? ORDER BY game_date DESC limit 4;;`
      );

      const recentMatches = recentMatchesQuery.all(id, id);

    recentMatches.forEach(match => {
  match.opponent = match.winner_id === id ? match.loser : match.winner;
  match.result = match.winner_id == id ? "Win" : "Lose";
  let userScore = match.winner_id === id ? match.win_score : match.lose_score;
  let opponentScore = match.winner_id === id ? match.lose_score : match.win_score;
  match.score = `${userScore} - ${opponentScore}`;
  });

    userStats.totalMatches = totalMatches.total;
    userStats.wins = wins.total;
    userStats.losses = losses.total;
    userStats.winRate = winRate;
    userStats.currentStreak = currentStreak.total;
    userStats.averageScore = (Number(winGoals.total) + Number(lossGoals.total)) / Number(totalMatches.total);
    userStats.bronzePlayers = Number(bronzePlayersCount.total);
    userStats.silverPlayers = Number(silverPlayersCount.total);
    userStats.goldPlayers = Number(goldPlayersCount.total);
    userStats.recentMatches = recentMatches;
    return reply.send(userStats);
  } catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}