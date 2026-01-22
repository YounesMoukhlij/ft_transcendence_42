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
    duration INTEGER,                     -- in seconds
    total_touches INTEGER,                -- total paddle hits in the match
    points_per_second REAL,               -- game pace (total points / duration)
    ball_max_speed REAL,                  -- m/s

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
    title TEXT NOT NULL,
    notifyBody TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    expired DATETIME,
    is_game_invite BOOLEAN DEFAULT FALSE,
    deadline DATETIME
    -- FOREIGN KEY (getter_user) REFERENCES users(id_user),
    -- FOREIGN KEY (sender_user) REFERENCES users(id_user)
);

-- Migration: Update title column from INTEGER to TEXT if it exists
-- This handles existing databases that may have the wrong column type
ALTER TABLE notification ADD COLUMN title_temp TEXT;
UPDATE notification SET title_temp = CAST(title AS TEXT);
ALTER TABLE notification DROP COLUMN title;
ALTER TABLE notification RENAME COLUMN title_temp TO title;

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
    name TEXT NOT NULL,            -- optional, store hash of results on-chain
    host_user INTEGER DEFAULT -1,
    guest1_user INTEGER DEFAULT -1,
    guest2_user INTEGER DEFAULT -1,
    guest3_user INTEGER DEFAULT -1
);

-- Game settings table
CREATE TABLE game_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    tableBg TEXT NOT NULL,
    ballColor TEXT NOT NULL,
    paddleColor TEXT NOT NULL,
    aiDifficulty TEXT,  -- 'easy', 'medium', 'hard' or NULL
    winningScore INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id_user),
    UNIQUE(userId)  -- One settings record per user
);

CREATE TABLE bot_conv (
    conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastMessage TEXT,
    bot BOOLEAN DEFAULT 1,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user)
);


CREATE TABLE bot_room (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES bot_conv(conversation_id)
);

