-- Users table


CREATE TABLE users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    fullname TEXT,
    bio TEXT,
    profile_img TEXT,
    xp INTEGER DEFAULT 0,
    refresh_token text,
    access_token TEXT,
    refsh_token TEXT,
    feeden TEXT,
    email TEXT UNIQUE,
    password TEXT,
    languages TEXT DEFAULT 'en',
    status BOOLEAN DEFAULT FALSE,
    auth_method INTEGER DEFAULT 0, -- 0: local, 1: google, 2: Intra42 
    sound_notification INTEGER DEFAULT 1,
    typing_indicator INTEGER DEFAULT 1,
    status_share INTEGER DEFAULT 1,
    read_receipts INTEGER DEFAULT 1,
    twoFA_enabled BOOLEAN DEFAULT FALSE,
    twoFA_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastseen DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
    id_friendship INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    FOREIGN KEY (friend_id) REFERENCES users(id_user),
    UNIQUE(user_id, friend_id)  -- prevent duplicates
);

CREATE TABLE friend_requests (
    id_request INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- e.g., pending, accepted, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id_user),
    FOREIGN KEY (receiver_id) REFERENCES users(id_user),
    UNIQUE(sender_id, receiver_id)  -- prevent duplicate requests
);


-- Game history
CREATE TABLE game_history (
    game_history_id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Match info
    user_win INTEGER NOT NULL,
    user_lose INTEGER NOT NULL,
    win_score INTEGER NOT NULL,
    lose_score INTEGER NOT NULL,

    -- Match type
    type TEXT DEFAULT 'casual',          -- 'casual' or 'tournament'
    tournament_id INTEGER DEFAULT -1,
    
    -- General data
    game_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER,                     -- in seconds or minutes
    longest_rally INTEGER,                -- max touches before a goal
    average_rally REAL,                   -- average touches before a goal
    ball_max_speed REAL,                  -- km/h or m/s

    -- Player data
    touches_win INTEGER,
    touches_lose INTEGER,
    max_points_streak_win INTEGER,
    max_points_streak_lose INTEGER,
    max_leading_time_win INTEGER,         -- in seconds
    max_leading_time_lose INTEGER,        -- in seconds

    blockchain_hash TEXT,                 -- optional, store on-chain reference

    FOREIGN KEY (user_win) REFERENCES users(id_user),
    FOREIGN KEY (user_lose) REFERENCES users(id_user),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id_tournament)
);


-- Achievement
CREATE TABLE achievement (
    achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT,
    req TEXT NOT NULL
);

-- Room
CREATE TABLE room (
    conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    members TEXT NOT NULL,
    blockedByUser1 INTEGER DEFAULT -1,
    blockedByUser2 INTEGER DEFAULT -1,
    pinnedUser1 INTEGER DEFAULT -1,
    pinnedUser2 INTEGER DEFAULT -1,
    pinnedDateUser1 TEXT,
    pinnedDateUser2 TEXT,
    lastMessage text,
    lastMessageTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastMessageSender INTEGER DEFAULT -1

);

-- Notification
CREATE TABLE notification (
    notify_id INTEGER PRIMARY KEY AUTOINCREMENT,
    getter_user INTEGER NOT NULL,
    sender_user INTEGER NOT NULL,
    title INTEGER NOT NULL,
    notifyBody TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    expired DATETIME,
    is_game_invite BOOLEAN DEFAULT FALSE,
    deadline DATETIME
    -- FOREIGN KEY (getter_user) REFERENCES users(id_user),
    -- FOREIGN KEY (sender_user) REFERENCES users(id_user)
);

-- Message
CREATE TABLE message (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conv_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    isSeen BOOLEAN DEFAULT FALSE,
    sender INTEGER NOT NULL,
    FOREIGN KEY ( sender ) REFERENCES users(id_user),
    FOREIGN KEY (conv_id) REFERENCES room(conversation_id)
);

CREATE TABLE tournaments (
    id_tournament INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL            -- optional, store hash of results on-chain
);


-- INSERT INTO game_history (
--     user_win, user_lose, win_score, lose_score,
--     type, tournament_id, tournament_round,
--     game_date, duration, longest_rally, average_rally, ball_max_speed,
--     touches_win, touches_lose, max_points_streak_win, max_points_streak_lose,
--     max_leading_time_win, max_leading_time_lose, blockchain_hash
-- )
-- VALUES
-- (3, 1, 11, 7, 'casual', NULL, NULL,
--  DATETIME('now', '-1 day', '-2 hours'), 420, 18, 7.4, 65,
--  90, 74, 4, 3, 210, 125, NULL),
-- (1, 3, 11, 8, 'casual', NULL, NULL,
--  DATETIME('now', '-1 day', '-1 hour'), 395, 15, 6.3, 62,
--  84, 79, 3, 2, 180, 150, NULL),

-- (3, 2, 11, 4, 'casual', NULL, NULL,
--  DATETIME('now', '-2 days', '-3 hours'), 380, 20, 8.0, 70,
--  102, 61, 5, 1, 260, 80, NULL),
-- (2, 3, 12, 10, 'casual', NULL, NULL,
--  DATETIME('now', '-2 days', '-1 hour'), 510, 22, 8.5, 72,
--  110, 108, 4, 4, 240, 230, NULL),


-- (3, 4, 11, 9, 'casual', NULL, NULL,
--  DATETIME('now', '-3 days', '-4 hours'), 450, 19, 7.1, 68,
--  97, 89, 3, 2, 200, 170, NULL),


-- (4, 3, 11, 6, 'casual', NULL, NULL,
--  DATETIME('now', '-4 days', '-2 hours'), 370, 16, 6.5, 63,
--  80, 72, 4, 3, 190, 160, NULL),
-- (3, 1, 11, 5, 'casual', NULL, NULL,
--  DATETIME('now', '-4 days', '-1 hour'), 390, 21, 8.1, 74,
--  120, 55, 6, 1, 280, 60, NULL),

-- (3, 2, 11, 10, 'casual', NULL, NULL,
--  DATETIME('now', '-5 days', '-3 hours'), 520, 23, 9.2, 78,
--  130, 127, 5, 4, 300, 290, NULL),

-- (3, 4, 15, 12, 'tournament', 1, 'Quarter-Final',
--  DATETIME('now', '-6 days', '-1 hour'), 600, 25, 10.1, 82,
--  150, 140, 6, 5, 350, 330, '0xABC123'),
-- (4, 3, 13, 11, 'tournament', 1, 'Semi-Final',
--  DATETIME('now', '-6 days', '-30 minutes'), 580, 22, 9.3, 80,
--  142, 135, 5, 4, 330, 300, '0xDEF456'),

-- (3, 1, 11, 3, 'casual', NULL, NULL,
--  DATETIME('now', '-7 days', '-4 hours'), 360, 14, 6.0, 60,
--  78, 44, 5, 1, 250, 40, NULL),

-- (2, 3, 11, 9, 'casual', NULL, NULL,
--  DATETIME('now', '-8 days', '-3 hours'), 430, 18, 7.7, 67,
--  95, 90, 3, 3, 210, 200, NULL),
-- (3, 2, 12, 10, 'casual', NULL, NULL,
--  DATETIME('now', '-8 days', '-1 hour'), 510, 21, 8.9, 75,
--  121, 118, 4, 4, 260, 250, NULL),


-- (4, 3, 11, 7, 'casual', NULL, NULL,
--  DATETIME('now', '-9 days', '-2 hours'), 400, 17, 7.0, 64,
--  87, 75, 4, 2, 210, 150, NULL),

-- (3, 1, 11, 6, 'casual', NULL, NULL,
--  DATETIME('now', '-10 days', '-3 hours'), 390, 20, 7.6, 73,
--  112, 64, 5, 1, 270, 90, NULL);


