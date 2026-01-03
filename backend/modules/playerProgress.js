import jwt from 'jsonwebtoken';

export async function getPlayerProgress(request, reply) {
  
  const username = request.params.username;

  try {
        const PlayerProgressQuery = request.server.db.prepare(
                `WITH last7 AS (
                    SELECT DATE('now', 'localtime') AS d
                    UNION ALL SELECT DATE('now', '-1 day', 'localtime')
                    UNION ALL SELECT DATE('now', '-2 day', 'localtime')
                    UNION ALL SELECT DATE('now', '-3 day', 'localtime')
                    UNION ALL SELECT DATE('now', '-4 day', 'localtime')
                    UNION ALL SELECT DATE('now', '-5 day', 'localtime')
                    UNION ALL SELECT DATE('now', '-6 day', 'localtime')
                    ),

                    stats AS (
                        SELECT 
                            DATE(game_date) AS gday,
                            SUM(CASE WHEN user_win =(select id_user from users where username=?) THEN 1 ELSE 0 END) AS wins,
                            SUM(CASE WHEN user_lose =(select id_user from users where username=?) THEN 1 ELSE 0 END) AS losses
                        FROM game_history
                        WHERE game_date >= DATETIME('now', '-7 days')
                        GROUP BY gday
                    )

                    SELECT
                        last7.d AS date,
                        COALESCE(stats.wins, 0) AS wins,
                        COALESCE(stats.losses, 0) AS losses
                    FROM last7
                    LEFT JOIN stats ON last7.d = stats.gday
                    ORDER BY last7.d;`
    );
        const PlayerProgress = PlayerProgressQuery.all(username, username);

        const result = PlayerProgress.map(row => ({
        key: new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' }).substring(0,3),
        wins: row.wins,
        losses: row.losses
        }));

   
    return reply.send(result);
  } catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}