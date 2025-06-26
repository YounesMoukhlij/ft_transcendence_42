
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
    google_auth TEXT,
    friends TEXT, -- Storing as JSON array
    friends_request TEXT, -- Storing as JSON array
    blocked_users TEXT -- Storing as JSON array
);

CREATE TABLE game_history (
    game_history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_win INTEGER NOT NULL,
    win_score INTEGER NOT NULL,
    lose_score INTEGER NOT NULL,
    user_lose INTEGER NOT NULL,
    FOREIGN KEY (user_win) REFERENCES users(id_user),
    FOREIGN KEY (user_lose) REFERENCES users(id_user)
);


CREATE TABLE achievement (
    achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT,
    req TEXT NOT NULL
);


CREATE TABLE room (
    conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    getter_user INTEGER NOT NULL,
    members TEXT NOT NULL, -- Storing as JSON array
    room_name TEXT,
    iconPad TEXT,
    FOREIGN KEY (getter_user) REFERENCES users(id_user)
);


CREATE TABLE notification (
    notify_id INTEGER PRIMARY KEY AUTOINCREMENT,
    getter_user INTEGER NOT NULL,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    is_game_invite BOOLEAN DEFAULT FALSE,
    deadline DATETIME,
    FOREIGN KEY (getter_user) REFERENCES users(id_user)
);


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


INSERT INTO users (username, fullname, email, password) 
VALUES ('zalksya', 'Zalksya User', 'zalksya@example.com', 'hashed_password_123');


INSERT INTO users (username, fullname, email, password) 
VALUES ('younes', 'Younes User', 'younes@example.com', 'hashed_password_456');