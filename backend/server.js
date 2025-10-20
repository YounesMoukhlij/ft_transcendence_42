import { WebSocketServer } from 'ws';
import fastify from "fastify";
import routes from './routes/routes.js';
import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis'; // Import the Redis client

const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Fastify
const app = fastify({
  logger: true, // It's good practice to enable logging
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

// Initialize SQLite Database
const db = new Database('Database.db');
app.decorate('db', db);

// --- Main Server Function ---
async function startServer() {
  try {
    // --- Redis Client Setup ---
    // 1. Create the Redis client
    const redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
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

    // --- Authentication Decorator ---
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

    // --- Route Registration ---
    app.register(routes);

    // --- Database Initialization ---
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    if (tables.length === 0) {
      const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
      db.exec(init);
      app.log.info('Database initialized');
    }

    // --- WebSocket Server Setup ---
    const wss = new WebSocketServer({ server: app.server, path: '/ws' });
    const users_socket = new Map();
    app.decorate('users_socket', users_socket);

    wss.on('connection', (socket) => {
      let username = null;
      socket.once('message', (msg) => {
        username = msg.toString();
        users_socket.set(username, socket);
        
        socket.on('message', async (msg) => {
          const data = JSON.parse(msg);
          const { user, message, conv_id } = data;
          const res = await test_function(conv_id, user);
          if (res) {
            for (const targetUser of res) {
              const targetSocket = users_socket.get(targetUser);
              if (targetSocket) {
                targetSocket.send(JSON.stringify({
                  type: "message",
                  data: message
                }));
              }
            }
          }
        });

        socket.on('close', () => {
          if (username) {
            users_socket.delete(username);
          }
        });
      });
    });

    // --- Start Listening ---
    await app.listen({ port: 4444, host: '0.0.0.0' });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Helper function for WebSocket logic (as in your original file)
async function test_function(conversationId, sender) {
  const query = db.prepare("SELECT members FROM room WHERE conversation_id = ?");
  const result = query.get(conversationId);
  if (!result) return null;
  const usernames = result.members.replace(/^,|,$/g, '').split(',').filter(Boolean);
  return usernames.filter(name => name !== sender);
}

// Run the server
startServer();
