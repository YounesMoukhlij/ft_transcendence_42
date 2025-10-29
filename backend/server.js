import { WebSocketServer } from 'ws';
import fastify from "fastify";
import routes from './routes/routes.js';
import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024, 
});

const db = new Database('Database.db');
app.decorate('db', db);


async function startServer() {
  try {

    const redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', err => app.log.error('Redis Client Error', err));


    await redisClient.connect();
    app.log.info('Successfully connected to Redis.');

    app.decorate('redis', redisClient);


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
        request.user = decoded;
      } catch (err) {
        console.error('JWT error:', err.message);
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    });


    app.register(routes);

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    if (tables.length === 0) {
      const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
      db.exec(init);
      app.log.info('Database initialized');
    }


    const wss = new WebSocketServer({ server: app.server, path: '/ws' });
    const users_socket = new Map();
    app.decorate('users_socket', users_socket);



  function statusSahre(id  , mode){
    const getFriendsStmt1 = db.prepare(`SELECT user_id  FROM friends WHERE friend_id = ?`);
    const getFriendsStmt2 = db.prepare(`SELECT friend_id  FROM friends WHERE user_id = ?`);

    const friends1 = getFriendsStmt1.all(id).map(row => row.user_id);
    const friends2 = getFriendsStmt2.all(id).map(row => row.friend_id);
    const allFriends = [...friends1, ...friends2];


    for (let i = 0; i < allFriends.length; i++) {
      const socket = users_socket.get(allFriends[i].toString());

      if(socket){

        const data= {
          status: mode,
          friend: id
        }
        socket.send(JSON.stringify({
          type: "status",
          data: data
      }));
    }
  }
}

  wss.on('connection', (socket) => {

  let id = 0;

    socket.once('message', (msg) => {
      id = msg.toString();

      console.log("connect " , id);
      users_socket.set(id, socket);

      console.log("here new user ==============>" , id);
      statusSahre(id , 1);

      const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
      query.run(1 , id);

    // const status = waitingMessages.has(id);

    // if (status){
    //   const query =  db.prepare("UPDATE message SET isSeen = ?");
    //   query.run(1);
    // }


    // const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
    // query.run(1 , id);
    

      socket.on('close', () => {
        statusSahre(id , 0);

        // console.log(`Client ${id} disconnected`);
        // users_socket.delete(id);
        const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
        query.run(0 , id);
        // statusSahre(id , socket , 0);
      });
    });
  });
  
  await app.listen({ port: 4444, host: '0.0.0.0' });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}




startServer();
