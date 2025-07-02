
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
    friends TEXT,
    friends_request TEXT,
    blocked_users TEXT
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
    members TEXT NOT NULL,
    room_name TEXT,
    iconPad TEXT
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
    sender TEXT NOT NULL,
    isSeen BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conv_id) REFERENCES room(conversation_id)
);



INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('ziko', 'ziko User', 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png','ziko@example.com', 'hashed_password_123');


INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('younes', 'Younes User', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCMDKvDLrPdTJtG5O4y3W61Wdqg20GwOOpUA&s' ,'younes@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('aaaaaaaaa', 'aaaaaaaa User', 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740' ,'aaaaaaaaaaaaaaaaaaaaaaaa@example.com', 'hashed_password_456');




INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('abechcha', 'abechcha User', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCMDKvDLrPdTJtG5O4y3W61Wdqg20GwOOpUA&s' ,'abechcha@example.com', 'hashed_password_456');

INSERT INTO room (members, room_name, iconPad)
VALUES (',abechcha,ziko,', 'Friends Chat', 'default_icon.png');


INSERT INTO message (conv_id, message, sender)
VALUES (1, 'Hello, how are you iam zakariya ?', 'ziko');


INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test1', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'teset@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test2', 'test  User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'teedst@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test3', 'test  User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'tedst@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test4', 'test  User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'tesast@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test5', 'test  User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'teacst@example.com', 'hashed_password_456');


INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test6', 'test  User', 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg' ,'tesact@example.com', 'hashed_password_456');


INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test7', 'test  User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'tes zxt@example.com', 'hashed_password_456');


INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test8', 'test  User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'teszxt@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test9', 'test User', 'https://cdn.intra.42.fr/users/806ad2f231069b86aff6a24a34070d1b/zalaksya.jpg' ,'tasest@example.com', 'hashed_password_456');

INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('test12', 'test User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'test@eqexample.com', 'hashed_password_456');


INSERT INTO users (username, fullname, profile_img ,email, password) 
VALUES ('tesdt12', 'tedst User', 'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg' ,'tesdt@eqexample.com', 'hashed_password_456');