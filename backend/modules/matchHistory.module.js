
export async function getMatchHistory(request, reply) {

  const username = request.params.username;
  const page = request.query.page || 0;

  try {
      const pageNumber = parseInt(page) || 0;
      const limit = 8;
        const MatchHistoryQuery = request.server.db.prepare(
        `SELECT *
        FROM (
          SELECT
            game_history_id AS id,
            (SELECT username FROM users WHERE id_user = user_win)  AS winner,
            (SELECT username FROM users WHERE id_user = user_lose) AS loser,
            (SELECT profile_img FROM users WHERE id_user = user_win)  AS winner_img,
            (SELECT profile_img FROM users WHERE id_user = user_lose) AS loser_img,
            win_score, lose_score, game_date, duration, type,
            longest_rally, average_rally, ball_max_speed, blockchain_hash as blockChainHash,
            touches_win, max_points_streak_win, max_leading_time_win,
            touches_lose, max_points_streak_lose, max_leading_time_lose,
            ROW_NUMBER() OVER (ORDER BY game_date DESC) AS paginationId
          FROM game_history
          WHERE (
            user_win  = (SELECT id_user FROM users WHERE username = ?)
            OR
            user_lose = (SELECT id_user FROM users WHERE username = ?)
          )
        ) t
        WHERE paginationId > ?
        ORDER BY paginationId
        LIMIT ?;`
      );

      const MatchHistory = MatchHistoryQuery.all(username, username, pageNumber * limit, limit + 1);


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
    // console.log(MatchHistory);
    return reply.send(MatchHistory);
  } catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}