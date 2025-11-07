const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';
import jwt from 'jsonwebtoken';

export async function getLeagueStats(request, reply) {
  const authHeader = request.headers['authorization'];
    
  if (!authHeader)
    reply.code(401).send("missing token");
        
  const token = authHeader.split(' ')[1];
  let decodedObject;
    
  try{
    decodedObject = jwt.verify(token, SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }
  const league = request.params.league;
  console.log("-----------------------------------------\n");

  let minExp = 0;
  let maxExp = 0;
  if (league === "bronze")
  {
    minExp = -1;
    maxExp = 21000;
  }
  else if (league === "silver")
  {
    minExp = 21000;
    maxExp = 42000;
  }
  else if (league === "gold")
  {
    minExp = 42000;
    maxExp = 1000000;
  }
  try {
    const query = request.server.db.prepare(
        `SELECT DISTINCT u.username as name,
        u.xp as experience,
        COUNT(g.game_history_id) AS gamesPlayed,
        SUM(CASE WHEN g.user_win = u.id_user THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN g.user_lose = u.id_user THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN g.user_win = u.id_user THEN g.win_score ELSE g.lose_score END) AS pointsScored,
        SUM(CASE WHEN g.user_win = u.id_user THEN g.lose_score ELSE g.win_score END) AS pointsConceded
        FROM users u
        LEFT JOIN game_history g
        ON g.user_win = u.id_user OR g.user_lose = u.id_user
        where u.xp >= ? AND u.xp < ?
        GROUP BY u.id_user;
        `
    );
    const leagueStats = query.all(minExp, maxExp); // use .get() for single row

    if (!leagueStats) return reply.code(404).send({ error: "league not found" });

    let i = 0;
    leagueStats.forEach(player => {
      player.id = i++;
      player.difference = player.pointsScored - player.pointsConceded;
      if (player.gamesPlayed == 0)
      {
        player.pointsConceded = 0;
        player.pointsScored = 0;
      }
    });


    console.log(leagueStats);
   
    return reply.send(leagueStats);
  } catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}