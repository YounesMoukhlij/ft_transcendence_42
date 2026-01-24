import { z } from "zod";



export const ParseIdSchema = z.object({
  id: z.coerce.number().positive(),
});


export const sendMsgSchema = z.object({
    input : z.string().min(1),
    id : z.coerce.number().positive(),
    friend_id : z.coerce.number().positive()
});


export const BlockSchema = z.object({
    conv_id : z.coerce.number().positive(),
    friend_id : z.coerce.number().positive()
});


export const PinnedSchema = z.object({
    id : z.coerce.number().positive(),
    pinned : z.string(),
});


export const usersettings = z.object({
    settingAttribute : z.string(),
    newValue: z.boolean(),
});


export const saveTournamentMatchValidation = z.object({

    winner: z.coerce.number().positive(),
    loser: z.coerce.number().positive(),
    win_score: z.coerce.number().positive(),
    lose_score: z.coerce.number().nonnegative(),
    tournament_id: z.coerce.number().positive(),
    duration: z.coerce.number().positive().max(7200), // max 2 hours
    total_touches: z.coerce.number().nonnegative().max(10000),
    points_per_second: z.coerce.number().nonnegative().max(5),
    ball_max_speed: z.coerce.number().nonnegative().max(1000),
    touches_win: z.coerce.number().nonnegative().max(5000),
    touches_lose: z.coerce.number().nonnegative().max(5000),
    max_points_streak_win: z.coerce.number().nonnegative().max(1000),
    max_points_streak_lose: z.coerce.number().nonnegative().max(1000),
    max_leading_time_win: z.coerce.number().nonnegative().max(7200),
    max_leading_time_lose: z.coerce.number().nonnegative().max(7200),
});
