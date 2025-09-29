import { WebSocketServer } from 'ws';
import fastify from "fastify";
import routes from './routes/routes.js';
import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const db = new Database('Database.db');


app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});


app.register(routes);
app.decorate('db', db);


try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  if (tables.length === 0) {
    const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    db.exec(init);
    app.log.info('Database initialized');
  }
} catch (err) {
  console.log('Database initialization error:', err);
  process.exit(1);
}



const wss = new WebSocketServer({ server: app.server, path: '/ws' });
const users_socket = new Map();
const waitingMessages = new Set();


app.decorate('users_socket', users_socket);
app.decorate('waitingMessages', waitingMessages);



async function test_function( conversationId , sender) {
  const query = db.prepare("SELECT members FROM room WHERE conversation_id = ?");
  const result = query.get(conversationId);

  if (!result) return null;


  const usernames = result.members
  .replace(/^,|,$/g, '')
  .split(',')
  .filter(Boolean);



const new_res = usernames.filter(name => name !== sender);
return(new_res);
}


function getmyFreind(username){

    const getUserIdStmt = db.prepare(`SELECT id_user FROM users WHERE username = ?`);
    const user = getUserIdStmt.get(username);

    if (!user) {
      return [];
    }

    const userId = user.id_user;


    const getFriendsStmt1 = db.prepare(`SELECT user_id  FROM friends WHERE friend_id = ?`);
    const getFriendsStmt2 = db.prepare(`SELECT friend_id  FROM friends WHERE user_id = ?`);

    const friends1 = getFriendsStmt1.all(userId).map(row => row.user_id);
    const friends2 = getFriendsStmt2.all(userId).map(row => row.friend_id);

    const allFriendIds = [...new Set([...friends1, ...friends2])];

    if (allFriendIds.length === 0) {
      return [];
    }

    const placeholders = allFriendIds.map(() => '?').join(', ');
    const getFriendDetailsStmt = db.prepare(`
      SELECT id_user, username, email, fullname ,profile_img,xp , email,access_token , status
      FROM users
      WHERE id_user IN (${placeholders})
      `);

    const friendDetails = getFriendDetailsStmt.all(...allFriendIds);

    return friendDetails;

}



function statusSahre(username , socket , mode){

  const FreindList = getmyFreind(username);
  for (let i = 0; i < FreindList.length; i++) {
    const socket = users_socket.get(FreindList[i].username);
    if(socket){
        const data= {
          status: mode,
          friend: username
        }
        socket.send(JSON.stringify({
        type: "status",
        data: data
      }));
    }
  }
}

function handleGameInvitation(message, senderSocket) {
  const { payload } = message;
  const { playerName, friendId, friendName } = payload;

  console.log(`Game invitation from ${playerName} to ${friendName}`);

  // Get friend's username from ID
  const getFriendStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
  const friendResult = getFriendStmt.get(friendId);

  if (!friendResult) {
    console.log('Friend not found');
    return;
  }

  const friendUsername = friendResult.username;

  // Create notification in database
  try {
    const insertNotificationStmt = db.prepare(`
      INSERT INTO notification (getter_user, sender_user, title, notifyBody, is_game_invite)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertNotificationStmt.run(
      friendUsername,
      playerName,
      'Game Invitation',
      `${playerName} invited you to play Ping Pong!`,
      true
    );

    // Send real-time notification if friend is online
    const friendSocket = users_socket.get(friendUsername);
    if (friendSocket) {
      // Get sender's profile image
      const getSenderProfileStmt = db.prepare('SELECT profile_img FROM users WHERE username = ?');
      const senderProfile = getSenderProfileStmt.get(playerName);

      // Get the notification ID
      const getNotificationIdStmt = db.prepare(`
        SELECT notify_id FROM notification
        WHERE getter_user = ? AND sender_user = ? AND is_game_invite = 1
        ORDER BY notify_id DESC LIMIT 1
      `);
      const notificationResult = getNotificationIdStmt.get(friendUsername, playerName);

      const notificationData = {
        getter_user: friendUsername,
        sender_user: playerName,
        title: 'Game Invitation',
        notifyBody: `${playerName} invited you to play Ping Pong!`,
        sender_profile_img: senderProfile?.profile_img || '',
        notify_id: notificationResult?.notify_id,
        is_game_invite: true
      };

      friendSocket.send(JSON.stringify({
        type: "notify",
        data: notificationData
      }));
    }

    console.log(`Game invitation sent from ${playerName} to ${friendName}`);

  } catch (error) {
    console.error('Error sending game invitation:', error);
  }
}

function handleGameMessage(message, socket, username) {
  const { action, payload } = message;

  switch (action) {
    case 'inviteFriend':
      handleGameInvitation(message, socket);
      break;

    default:
      console.log(`Unhandled game action: ${action}`);
  }
}


wss.on('connection', (socket) => {

  let username = null;

  socket.once('message', (msg) => {
    const message = msg.toString();

    // Try to parse as JSON first (for game messages)
    try {
      const jsonMessage = JSON.parse(message);
      if (jsonMessage.type === 'game' && jsonMessage.action === 'inviteFriend') {
        // Handle game invitation
        handleGameInvitation(jsonMessage, socket);
        return;
      }
    } catch (e) {
      // Not JSON, treat as username
    }

    username = message;
    users_socket.set(username, socket);

    const status = waitingMessages.has(username);

    if (status){
      const query =  db.prepare("UPDATE message SET isSeen = ?");
      query.run(1);
    }


    const query = db.prepare('UPDATE users SET status = ? WHERE username = ?');
    query.run(1 , username);

    statusSahre(username , socket , 1);


    socket.on('message', (msg) => {
      try {
        const jsonMessage = JSON.parse(msg.toString());
        if (jsonMessage.type === 'game') {
          handleGameMessage(jsonMessage, socket, username);
        }
      } catch (e) {
        console.log('Non-JSON message received:', msg.toString());
      }
    });

    socket.on('close', () => {
      console.log(`Client ${username} disconnected`);
      users_socket.delete(username);
      const updateQuery = db.prepare('UPDATE users SET status = ? WHERE username = ?');
      updateQuery.run(0 , username);

      statusSahre(username , socket , 0);
    });
  });
});




app.listen({ port: 4444, host: '0.0.0.0' });

