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
import GameManager from './modules/gameManager.js';
import { setupWebSocketServer } from './modules/websocketHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsDir = path.join(__dirname, 'uploads');


const app = fastify({
  logger: true, 
  bodyLimit: 10 * 1024 * 1024,
});


const isProd = process.env.NODE_ENV === 'production';
const corsAllowlist = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    if (!isProd) {
      return cb(null, true);
    }

    // Prod: restrict to explicit allowlist if provided
    if (corsAllowlist.length === 0) {
      return cb(new Error('CORS blocked: no origins configured'), false);
    }

    if (corsAllowlist.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error('CORS blocked'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'WSS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const db = new Database('Database.db');
app.decorate('db', db);
  const users_socket = new Map();
  app.decorate('users_socket', users_socket);

// Initialize Game Manager (used by game/tournament WS handlers)
const gameManager = new GameManager(db, users_socket);
app.decorate('gameManager', gameManager);

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

    // Ensure game_settings exists (safe for existing DBs)
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS game_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL UNIQUE,
          tableBg TEXT,
          ballColor TEXT,
          paddleColor TEXT,
          aiDifficulty TEXT,
          winningScore INTEGER DEFAULT 5,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id_user)
        );
      `);

      // Add winningScore column if it doesn't exist (for existing databases)
      try {
        db.exec(`ALTER TABLE game_settings ADD COLUMN winningScore INTEGER DEFAULT 5`);
      } catch (e) {
        // Column might already exist, ignore error
      }
    } catch (e) {
      app.log.error(e);
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




const port = Number(process.env.PORT || 4444);
await app.listen({ port, host: '0.0.0.0' });


const wss = new WebSocketServer({ server: app.server, path: '/ws' });
setupWebSocketServer(wss, db, users_socket, gameManager);


try {
  gameManager.startPeriodicTasks();
} catch (e) {
  app.log.error(e);
}

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}



startServer();