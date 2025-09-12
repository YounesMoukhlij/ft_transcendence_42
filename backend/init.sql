-- Users table
-- Users table
CREATE TABLE users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    fullname TEXT,
    bio TEXT,
    profile_img TEXT,
    xp INTEGER DEFAULT 0,
    access_token TEXT,
    feeden TEXT,
    email TEXT UNIQUE,
    password TEXT,
    langue TEXT DEFAULT En,
    status TEXT,
    auth_method INTEGER DEFAULT 0, -- 0: local, 1: google, 2: Intra42 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    members TEXT NOT NULL,
    room_name TEXT,
    iconPad TEXT
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
    sender TEXT NOT NULL,
    isSeen BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conv_id) REFERENCES room(conversation_id)
);

-- Insert users
-- INSERT INTO users (username, fullname, profile_img, email, password, xp) 
-- VALUES 
-- ('ziko', 'ziko User', 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png', 'ziko@example.com', 'hashed_password_123', 233),
-- ('younes', 'Younes User', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCMDKvDLrPdTJtG5O4y3W61Wdqg20GwOOpUA&s', 'younes@example.com', 'hashed_password_456', 53),
-- ('abechcha', 'abechcha User', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCMDKvDLrPdTJtG5O4y3W61Wdqg20GwOOpUA&s', 'abechcha@example.com', 'hashed_password_456', 432),
-- ('test1', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test1@example.com', 'hashed_password_456', 68),
-- ('test2', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test2@example.com', 'hashed_password_456', 66),
-- ('test3', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test3@example.com', 'hashed_password_456', 46),
-- ('test4', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test4@example.com', 'hashed_password_456', 0),
-- ('test5', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test5@example.com', 'hashed_password_456', 0),
-- ('test6', 'test User', 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg', 'test6@example.com', 'hashed_password_456', 0),
-- ('test7', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test7@example.com', 'hashed_password_456', 0),
-- ('test8', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test8@example.com', 'hashed_password_456', 0),
-- ('test9', 'test User', 'https://cdn.intra.42.fr/users/806ad2f231069b86aff6a24a34070d1b/zalaksya.jpg', 'test9@example.com', 'hashed_password_456', 13),
-- ('test12', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'test12@example.com', 'hashed_password_456', 0),
-- ('tesdt12', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg', 'tesdt12@example.com', 'hashed_password_456', 4564);

-- Insert a room
-- INSERT INTO room (members, room_name, iconPad)
-- VALUES (',abechcha,ziko,', 'Friends Chat', 'default_icon.png');

-- -- Insert a message linked to the existing room (id 1)
-- INSERT INTO message (conv_id, message, sender)
-- VALUES (1, 'Hello, how are you? I am Zakariya.', 'ziko');