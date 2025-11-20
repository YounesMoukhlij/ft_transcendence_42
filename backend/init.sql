-- Users table

CREATE TABLE users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    fullname TEXT,
    bio TEXT,
    profile_img TEXT,
    xp INTEGER DEFAULT 0,
    access_token TEXT,
    refresh_token TEXT,
    feeden TEXT,
    email TEXT UNIQUE,
    password TEXT,
    languages TEXT DEFAULT 'en',
    status BOOLEAN DEFAULT FALSE,
    auth_method INTEGER DEFAULT 0, -- 0: local, 1: google, 2: Intra42
    twoFA_enabled BOOLEAN DEFAULT FALSE,
    twoFA_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    tournament_id INTEGER,                -- FK if it's a tournament match
    tournament_round TEXT,                -- optional, e.g., 'Quarter-Final'

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
    room_name TEXT,
    block_user TEXT,
    is_double_block INTEGER DEFAULT 0,
    iconPad TEXT
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
    -- sender TEXT NOT NULL,
    isSeen BOOLEAN DEFAULT FALSE,
    sender INTEGER NOT NULL,
    FOREIGN KEY ( sender ) REFERENCES users(id_user),
    FOREIGN KEY (conv_id) REFERENCES room(conversation_id)
);

CREATE TABLE tournaments (
    id_tournament INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    status TEXT DEFAULT 'upcoming',  -- upcoming, ongoing, finished
    description TEXT,
    blockchain_hash TEXT             -- optional, store hash of results on-chain
);
