
import jwt from 'jsonwebtoken';



export async function getUserStatsbyUsername(request, reply) {


  const authHeader = request.headers['authorization'];

  if (!authHeader)
    reply.code(401).send("missing token");
    
  const token = authHeader.split(' ')[1];
  let decodedObject;

  try{
    decodedObject = jwt.verify(token, process.env.SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }
 
  const username = request.params.username;

  try {
    const query = request.server.db.prepare(
      "SELECT username, fullname, xp, profile_img as avatar FROM users WHERE username = ?"
    );
    const userStats = query.get(username);

    if (!userStats) return reply.code(404).send({ error: "User not found" });


    const matchesQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win=(select id_user from users Where username= ?) OR user_lose=(select id_user from users Where username= ?)"
    );
    const totalMatches = matchesQuery.get(username, username);
    
     const winsQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win = (select id_user from users Where username= ?)"
    );
    const wins = winsQuery.get(username);


    const lossesQuery = request.server.db.prepare(
      "select COUNT(*) as total from game_history WHERE user_lose=(select id_user from users Where username= ?)"
    );
    const losses = lossesQuery.get(username);

    const winRate = Math.floor(Number(wins.total) / Number(totalMatches.total) * 100);


    const currentStreakQuery = request.server.db.prepare(`select COUNT(*) as total from game_history
      where user_win=(select id_user from users where username= ?) AND
      game_history_id > (select max(game_history_id) from game_history 
      where user_lose=(select id_user from users where username= ?))`)

    const currentStreak = currentStreakQuery.get(username, username);


    const winGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=(select id_user from users where username=?)`);
    
    const winGoals = winGoalsQuery.get(username);

    const lossGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=(select id_user from users where username=?)`);

    const lossGoals = lossGoalsQuery.get(username);

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
        `select game_history_id as id, (select username from users where id_user=user_win) as winner, (select username from users where id_user=user_lose) as loser, win_score
, lose_score, game_date, duration from game_history where user_win=(select id_user from users 
          where username=?) OR user_lose=(select id_user from users where username=?) ORDER BY game_history_id DESC limit 4;`
      );

      const recentMatches = recentMatchesQuery.all(username, username);


    recentMatches.forEach(match => {
  match.opponent = match.winner === username ? match.loser : match.winner;
  match.result = match.winner == username ? "Win" : "Lose";
  let userScore = match.winner === username ? match.win_score : match.lose_score;
  let opponentScore = match.winner === username ? match.lose_score : match.win_score;
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


  const authHeader = request.headers['authorization'];

  if (!authHeader)
    reply.code(401).send("missing token");
    
  const token = authHeader.split(' ')[1];
  let decodedObject;

  try{
    decodedObject = jwt.verify(token, process.env.SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }
 
  const username = decodedObject.username;


  try {
    const query = request.server.db.prepare(
      "SELECT username, fullname, xp, profile_img as avatar FROM users WHERE username = ?"
    );
    const userStats = query.get(username);

    if (!userStats) return reply.code(404).send({ error: "User not found" });


    const matchesQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win=(select id_user from users Where username= ?) OR user_lose=(select id_user from users Where username= ?)"
    );
    const totalMatches = matchesQuery.get(username, username);
    
     const winsQuery = request.server.db.prepare(
     "select COUNT(*) as total from game_history WHERE user_win = (select id_user from users Where username= ?)"
    );
    const wins = winsQuery.get(username);


    const lossesQuery = request.server.db.prepare(
      "select COUNT(*) as total from game_history WHERE user_lose=(select id_user from users Where username= ?)"
    );
    const losses = lossesQuery.get(username);

    const winRate = Math.floor(Number(wins.total) / Number(totalMatches.total) * 100);


    const currentStreakQuery = request.server.db.prepare(`select COUNT(*) as total from game_history
      where user_win=(select id_user from users where username= ?) AND
      game_history_id > (select max(game_history_id) from game_history 
      where user_lose=(select id_user from users where username= ?))`)

    const currentStreak = currentStreakQuery.get(username, username);


    const winGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=(select id_user from users where username=?)`);
    
    const winGoals = winGoalsQuery.get(username);

    const lossGoalsQuery = request.server.db.prepare(
      `select sum(lose_score) as total from game_history where user_lose=(select id_user from users where username=?)`);

    const lossGoals = lossGoalsQuery.get(username);

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
        `select game_history_id as id, (select username from users where id_user=user_win) as winner, (select username from users where id_user=user_lose) as loser, win_score
, lose_score, game_date, duration from game_history where user_win=(select id_user from users 
          where username=?) OR user_lose=(select id_user from users where username=?) ORDER BY game_history_id DESC limit 4;`
      );

      const recentMatches = recentMatchesQuery.all(username, username);


    recentMatches.forEach(match => {
  match.opponent = match.winner === username ? match.loser : match.winner;
  match.result = match.winner == username ? "Win" : "Lose";
  let userScore = match.winner === username ? match.win_score : match.lose_score;
  let opponentScore = match.winner === username ? match.lose_score : match.win_score;
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