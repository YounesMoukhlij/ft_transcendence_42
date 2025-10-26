import fastify from "fastify";

export async function getMatchHistory(request, reply) {
  const username = request.params.username; // get from query ?username=ayoub
  console.log("Get Match History:", username);

  try {
        const MatchHistoryQuery = request.server.db.prepare(
        `select game_history_id as id, (select username from users where id_user=user_win) as winner, 
        (select username from users where id_user=user_lose) as loser,
        (select profile_img from users where id_user=user_win) as winner_img,
        (select profile_img from users where id_user=user_lose) as loser_img,
        win_score, lose_score, game_date, duration, 
        longest_rally, average_rally, ball_max_speed,
        touches_win, max_points_streak_win, max_leading_time_win,
        touches_lose, max_points_streak_lose, max_leading_time_lose
        from game_history where user_win=(select id_user from users where username=?) 
        OR user_lose=(select id_user from users where username=?)
        ORDER BY game_history_id DESC;`
      );

      const MatchHistory = MatchHistoryQuery.all(username, username);


MatchHistory.forEach(match => {
    const isWinner = match.winner === username;

    match.guest = isWinner ? match.loser : match.winner;
    match.opponent = isWinner ? match.loser : match.winner;
    match.host = isWinner ? match.winner : match.loser;
    match.result = isWinner ? "Win" : "Loss";

    const userScore = isWinner ? match.win_score : match.lose_score;
    const opponentScore = isWinner ? match.lose_score : match.win_score;

    match.guestScore = opponentScore;
    match.hostScore = userScore;
    match.score = `${userScore} - ${opponentScore}`;

    match.hostImg = isWinner ? match.winner_img : match.loser_img;
    match.guestImg = isWinner ? match.loser_img : match.winner_img;

    match.hostTouches = isWinner ? match.touches_win : match.touches_lose;
    match.guestTouches = isWinner ? match.touches_lose : match.touches_win;

    match.hostMaxStreak = isWinner ? match.max_points_streak_win : match.max_points_streak_lose;
    match.guestMaxStreak = isWinner ? match.max_points_streak_lose : match.max_points_streak_win;

    match.hostLeadingTime = isWinner ? match.max_leading_time_win : match.max_leading_time_lose;
    match.guestLeadingTime = isWinner ? match.max_leading_time_lose : match.max_leading_time_win;
});
   
    return reply.send(MatchHistory);
  } catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}