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
import dotenv from 'dotenv';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyJwt from '@fastify/jwt';
import GameManager from './modules/gameManager.js';
import { setupWebSocketServer } from './modules/websocketHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsDir = path.join(__dirname, 'uploads');


const app = fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024,
});



const db = new Database('Database.db');
app.decorate('db', db);
const users_socket = new Map();
app.decorate('users_socket', users_socket);

// Initialize Game Manager
const gameManager = new GameManager(db, users_socket);
app.decorate('gameManager', gameManager);

app.register(fastifyJwt, { secret: process.env.SECRET});

async function startServer() {
  try {

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      app.log.info('Uploads directory created at:', uploadsDir);
    }


    console.log('Connecting to Redis...');
    const redisClient = createClient({
      url: process.env.REDIS_URL
    });

    // 2. Add an error listener to catch connection issues
    redisClient.on('error', err => app.log.error('Redis Client Error', err));

    // 3. Connect to the Redis server
    await redisClient.connect();
    app.log.info('Successfully connected to Redis.');

    // 4. Decorate the Fastify instance with the Redis client
    // This makes it available in all routes via `request.server.redis`
    app.decorate('redis', redisClient);


    // --- CORS Registration ---
    app.register(cors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    });


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

    // Start the HTTP server first
    await app.listen({ port: process.env.PORT, host: '0.0.0.0' });

    // --- WebSocket Server Setup (after HTTP server is listening) ---
    const wss = new WebSocketServer({ server: app.server, path: '/ws' });
    setupWebSocketServer(wss, db, users_socket, gameManager);

    // Start periodic game-related tasks (cleanup, matchmaking, sync)
    gameManager.startPeriodicTasks();

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}



startServer();
