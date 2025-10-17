import { WebSocketServer } from 'ws';
import fastify from "fastify";
import routes from './routes/routes.js';
import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';

const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const db = new Database('Database.db');


app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.decorate('authenticate', async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, SECRET);
    request.user = decoded; // attach the decoded user payload
  } catch (err) {
    console.error('JWT error:', err.message);
    return reply.code(401).send({ error: 'Unauthorized' });
  }
});

app.register(routes);
app.decorate('db', db);


try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  if (tables.length === 0) {
    const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    db.exec(init);
    app.log.info('Database initialized');
    console.log("here1");
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


wss.on('connection', (socket) => {

  let username = null;

  socket.once('message', (msg) => {
    username = msg.toString();
    users_socket.set(username, socket);

    const status = waitingMessages.has(username);

    if (status){
      const query =  db.prepare("UPDATE message SET isSeen = ?");
      query.run(1);
    }


    const query = db.prepare('UPDATE users SET status = ? WHERE username = ?');
    query.run(1 , username);

    statusSahre(username , socket , 1);
    

    socket.on('close', () => {
      console.log(`Client ${username} disconnected`);
      users_socket.delete(username);
      db.prepare('UPDATE users SET status = ? WHERE username = ?');
      query.run(0 , username);


      statusSahre(username , socket , 0);


    });
  });
});


app.listen({ port: 4444, host: '0.0.0.0' });

