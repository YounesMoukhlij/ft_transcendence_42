-- Users table
CREATE TABLE users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    fullname TEXT,
    profile_img TEXT,
    xp INTEGER DEFAULT 0,
    access_token TEXT,
    refresh_token TEXT,
    feeden TEXT,
    email TEXT UNIQUE,
    password TEXT,
    langue TEXT,
    status TEXT,
    google_auth TEXT

);

CREATE TABLE friends (
    id_friendship INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user),
    FOREIGN KEY (friend_id) REFERENCES users(id_user),
    UNIQUE(user_id, friend_id)  -- prevent duplicates
);

-- Table to store friend requests (unidirectional)
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
    user_win INTEGER NOT NULL,
    win_score INTEGER NOT NULL,
    lose_score INTEGER NOT NULL,
    user_lose INTEGER NOT NULL,
    FOREIGN KEY (user_win) REFERENCES users(id_user),
    FOREIGN KEY (user_lose) REFERENCES users(id_user)
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
    getter_user INTEGER NOT NULL,
    members TEXT NOT NULL,
    room_name TEXT,
    iconPad TEXT,
    FOREIGN KEY (getter_user) REFERENCES users(id_user)
);

-- Notification


CREATE TABLE notification (
    notify_id INTEGER PRIMARY KEY AUTOINCREMENT,
    getter_user TEXT NOT NULL,
    sender_user TEXT NOT NULL,
    title TEXT NOT NULL,
    notifyBody TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    is_game_invite BOOLEAN DEFAULT FALSE,
    deadline DATETIME
);

-- Message
CREATE TABLE message (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conv_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender INTEGER NOT NULL,
    isSeen BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conv_id) REFERENCES room(conversation_id),
    FOREIGN KEY (sender) REFERENCES users(id_user)
);


-- Insert a room
-- INSERT INTO room (members, room_name, iconPad)
-- VALUES (',abechcha,ziko,', 'Friends Chat', 'default_icon.png');

-- -- Insert a message linked to the existing room (id 1)
-- INSERT INTO message (conv_id, message, sender)
-- VALUES (1, 'Hello, how are you? I am Zakariya.', 'ziko');
