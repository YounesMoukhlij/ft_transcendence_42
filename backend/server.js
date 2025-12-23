import dotenv from 'dotenv';
dotenv.config();
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
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyJwt from '@fastify/jwt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsDir = path.join(__dirname, 'uploads');


const app = fastify({
  logger: true, 
  bodyLimit: 10 * 1024 * 1024,
});


  app.register(cors, {
    origin: [
    'http://localhost:3000', 
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // zmoumni for frontend middleware
    allowedHeaders: ["Content-Type", "Authorization"], // zmoumni for frontend middleware
    // origin: "http://0.0.0.0:3000", // zmoumni for frontend middleware

  });

const db = new Database('Database.db');
app.decorate('db', db);
    const wss = new WebSocketServer({ server: app.server, path: '/ws' });
    const users_socket = new Map();
    app.decorate('users_socket', users_socket);

app.register(fastifyJwt, { secret: process.env.SECRET});

async function startServer() {
  try {

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      app.log.info('Uploads directory created at:', uploadsDir);
    }

    // console.log('Connecting to Redis...');
    // const redisClient = createClient({
    //   url: process.env.REDIS_URL
    // });

    // 2. Add an error listener to catch connection issues
    // redisClient.on('error', err => app.log.error('Redis Client Error', err));

    // 3. Connect to the Redis server
    // await redisClient.connect();
    // app.log.info('Successfully connected to Redis.');

    // 4. Decorate the Fastify instance with the Redis client
    // This makes it available in all routes via `request.server.redis`
    // app.decorate('redis', redisClient);





        // --- NEW --- Register fastify-static to serve files from /uploads
    // This makes http://localhost:4444/uploads/your-image.png accessible
    app.register(fastifyStatic, {
      root: uploadsDir,
      prefix: '/uploads/', // The URL prefix to access the files
    });

    // --- END NEW ---

    // --- NEW --- Register fastify-multipart to handle file uploads
    app.register(multipart, {
        attachFieldsToBody: false, // We will handle parts manually
    });

    app.decorate('authenticate', async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return reply.code(401).send({ error: 'Missing or invalid token' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        request.user = decoded;
      } catch (err) {
        console.error('JWT error:', err.message);
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    });

    app.register(routes);

    // --- Database Initialization ---
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    if (tables.length === 0) {
      const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
      db.exec(init);
      app.log.info('Database initialized');
    }

  function statusSahre(id  , mode){
    const allowQuery = db.prepare('SELECT status_share FROM users WHERE id_user = ?');
    const result = allowQuery.get(id);  
    // if (!result.status_share)
    //   mode = 0;
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





wss.on("connection", (socket, req) => {
  
  const params = new URLSearchParams(req.url.replace("/ws?", ""));
  const token = params.get("token");
  
  if (!token) {
    console.log("No token provided. Closing connection.");
    socket.close();
    return;
  }
  
  let user;
  try {
    user = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    socket.close();
    return;
  }


  const userId = String(user.id_user);
  socket.userId = userId;
  users_socket.set(userId, socket); 

  const allowQuery = db.prepare('SELECT status_share FROM users WHERE id_user = ?');
  const result = allowQuery.get(userId);  
  if (result.status_share) {
    statusSahre(userId, 1);
    db.prepare('UPDATE users SET status = ? WHERE id_user = ?').run(1, userId);
  } else {
    statusSahre(userId, 0);
    db.prepare('UPDATE users SET status = ? WHERE id_user = ?').run(0, userId);
  }

  socket.on("message", (raw) => {
    const str = raw.toString().trim();
    let data;

    try {
      data = JSON.parse(str);
    } catch {
      console.log("Received raw message:", str);
      return;
    }

    if (data.type === "istyping") {
      const socketFriend = users_socket.get(String(data.friend));
      if (socketFriend){
        socketFriend.send(JSON.stringify({
          type: "isTyping",
          data: { friendId: socket.userId }
        }));
      }
      return;
    }

    if (data.type === "isSeen") {
      const socketFriend = users_socket.get(String(data.contactId));

      const q = db.prepare('SELECT read_receipts FROM users WHERE id_user = ?');
      const result = q.get(socket.userId);

      if (result.read_receipts){
        db.prepare(`UPDATE message SET isSeen = 1 WHERE conv_id = ? AND sender = ? AND isSeen = 0`)
        .run(data.convId, data.contactId);
  
        if (socketFriend){
          socketFriend.send(JSON.stringify({
            type: "seen",
            data: { seen: true, conv_id: data.convId}
          }));
        }
      }

      return;
    }

    if (data.type === "message") {
      const socketFriend = users_socket.get(String(data.contactId));

      db.prepare("INSERT INTO message (conv_id, message, sender, isSeen) VALUES (?, ?, ?, ?)")
        .run(data.conversation_id, data.input, socket.userId, 0);

      db.prepare(`UPDATE room SET lastMessage = ?, lastMessageTime = CURRENT_TIMESTAMP, lastMessageSender = ? WHERE conversation_id = ?`)
        .run(data.input, socket.userId, data.conversation_id);

      if (socketFriend){
        socketFriend.send(JSON.stringify({
          type: "message",
          data: {
            message: data.input,
            conv_id: data.conversation_id,
            sender_user_id: socket.userId
          }
        }));
      }
      return;
    }
  });


  socket.on("close", () => {
    console.log("Client disconnected:", userId);
    users_socket.delete(userId);
    statusSahre(userId, 0);
    db.prepare('UPDATE users SET status = ? WHERE id_user = ?').run(0, userId);
  });

});




await app.listen({ port: process.env.PORT, host: '0.0.0.0' });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}



startServer();