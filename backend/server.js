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
    const wss = new WebSocketServer({ server: app.server, path: '/ws' });
    const users_socket = new Map();
    app.decorate('users_socket', users_socket);


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
    // --- WebSocket Server Setup ---
    const waitingPool = [];
    const rooms = new Map();
    const gameIntervals = new Map();

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PADDLE_HEIGHT = 100;
    const BALL_RADIUS = 10;

    function updateGameState(room) {
        const state = room.gameState;

        // Move paddles
        state.player1.y += state.player1.dy;
        state.player2.y += state.player2.dy;

        // Keep paddles in bounds
        if (state.player1.y < 0) state.player1.y = 0;
        if (state.player1.y > GAME_HEIGHT - PADDLE_HEIGHT) state.player1.y = GAME_HEIGHT - PADDLE_HEIGHT;
        if (state.player2.y < 0) state.player2.y = 0;
        if (state.player2.y > GAME_HEIGHT - PADDLE_HEIGHT) state.player2.y = GAME_HEIGHT - PADDLE_HEIGHT;

        // Move ball
        state.ball.x += state.ball.dx;
        state.ball.y += state.ball.dy;

        // Wall collision (top/bottom)
        if (state.ball.y - BALL_RADIUS < 0 || state.ball.y + BALL_RADIUS > GAME_HEIGHT) {
            state.ball.dy *= -1;
        }

        // Paddle collision
        // Player 1 (left)
        if (state.ball.dx < 0 &&
            state.ball.x - BALL_RADIUS < 20 &&
            state.ball.x - BALL_RADIUS > 10 &&
            state.ball.y > state.player1.y &&
            state.ball.y < state.player1.y + PADDLE_HEIGHT) {
            state.ball.dx *= -1;
        }

        // Player 2 (right)
        if (state.ball.dx > 0 &&
            state.ball.x + BALL_RADIUS > GAME_WIDTH - 20 &&
            state.ball.x + BALL_RADIUS < GAME_WIDTH - 10 &&
            state.ball.y > state.player2.y &&
            state.ball.y < state.player2.y + PADDLE_HEIGHT) {
            state.ball.dx *= -1;
        }

        // Score
        if (state.ball.x - BALL_RADIUS < 0) {
            state.player2.score++;
            resetBall(state);
        } else if (state.ball.x + BALL_RADIUS > GAME_WIDTH) {
            state.player1.score++;
            resetBall(state);
        }
    }

    function resetBall(state) {
        state.ball.x = GAME_WIDTH / 2;
        state.ball.y = GAME_HEIGHT / 2;
        state.ball.dx = Math.random() > 0.5 ? 5 : -5;
        state.ball.dy = Math.random() > 0.5 ? 5 : -5;
    }

    function startGame(roomCode, room) {
        const intervalId = setInterval(() => {
            updateGameState(room);
            const gameStatePayload = {
                type: 'gameState',
                payload: room.gameState
            };
            room.players.forEach(p => {
                if (p.socket.readyState === p.socket.OPEN) {
                    p.socket.send(JSON.stringify(gameStatePayload));
                }
            });
        }, 1000 / 60); // 60 FPS

        gameIntervals.set(roomCode, intervalId);
    }


    wss.on('connection', (socket) => {
    let id = 0;
    let username = '';

    socket.on('message', (msg) => {
        try {
            const message = JSON.parse(msg);
            switch (message.type) {
                case 'initial':
                    id = message.payload.id;
                    username = message.payload.username;
                    users_socket.set(id.toString(), socket);
                    statusSahre(id, 1);
                    const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
                    query.run(1, id);
                    break;

                case 'findMatch':
                    const player = {
                        id,
                        username: message.payload.username,
                        customization: message.payload.customization,
                        socket: socket,
                    };

                    const opponentIndex = waitingPool.findIndex(p => p.socket !== socket);

                    if (opponentIndex > -1) {
                        const opponent = waitingPool.splice(opponentIndex, 1)[0];
                        const roomCode = Math.random().toString(36).substring(7);

                        const players = [
                            { username: player.username, socket: player.socket, id: player.id },
                            { username: opponent.username, socket: opponent.socket, id: opponent.id },
                        ];
                        
                        socket.roomCode = roomCode;
                        opponent.socket.roomCode = roomCode;

                        const room = {
                            players,
                            gameState: {
                                player1: { id: player.id, username: player.username, y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0, score: 0, customization: player.customization },
                                player2: { id: opponent.id, username: opponent.username, y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0, score: 0, customization: opponent.customization },
                                ball: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: 5, dy: 5 },
                            }
                        };
                        rooms.set(roomCode, room);

                        console.log('Match found, starting game in room:', roomCode);
                        const matchDetails = {
                            roomCode,
                            players: [
                                { username: player.username, customization: player.customization },
                                { username: opponent.username, customization: opponent.customization }
                            ],
                        };

                        players.forEach(p => {
                            p.socket.send(JSON.stringify({ type: 'matchFound', payload: matchDetails }));
                        });

                        startGame(roomCode, room);

                    } else {
                        waitingPool.push(player);
                        socket.send(JSON.stringify({ type: 'searching', payload: 'Waiting for an opponent...' }));
                    }
                    break;
                
                case 'paddleMove':
                    const { direction } = message.payload;
                    const roomCode = socket.roomCode;
                    const room = rooms.get(roomCode);
                    if (room) {
                        const playerToUpdate = room.gameState.player1.id === id ? room.gameState.player1 : room.gameState.player2;
                        if (playerToUpdate) {
                            if (direction === 'up') {
                                playerToUpdate.dy = -8;
                            } else if (direction === 'down') {
                                playerToUpdate.dy = 8;
                            } else if (direction === 'stop') {
                                playerToUpdate.dy = 0;
                            }
                        }
                    }
                    break;

                case 'leaveRoom':
                    const { roomCode: leaveRoomCode } = message.payload;
                    if (rooms.has(leaveRoomCode)) {
                        const room = rooms.get(leaveRoomCode);
                        room.players = room.players.filter(p => p.socket !== socket);
                        
                        const intervalId = gameIntervals.get(leaveRoomCode);
                        if (intervalId) {
                            clearInterval(intervalId);
                            gameIntervals.delete(leaveRoomCode);
                        }
                        rooms.delete(leaveRoomCode);

                        room.players.forEach(p => {
                            p.socket.send(JSON.stringify({ type: 'playerLeft', payload: { username: 'A player' } }));
                        });
                    }
                    break;
            }
        } catch (error) {
            console.error('Failed to parse message or handle client message:', error);
        }
    });

    socket.on('close', () => {
        if (id) {
            statusSahre(id, 0);
            const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
            query.run(0, id);
            users_socket.delete(id.toString());

            const index = waitingPool.findIndex(p => p.socket === socket);
            if (index > -1) {
                waitingPool.splice(index, 1);
            }

            if (socket.roomCode && rooms.has(socket.roomCode)) {
                const room = rooms.get(socket.roomCode);
                const intervalId = gameIntervals.get(socket.roomCode);
                if (intervalId) {
                    clearInterval(intervalId);
                    gameIntervals.delete(socket.roomCode);
                }
                
                if (room) {
                    room.players = room.players.filter(p => p.socket !== socket);
                    room.players.forEach(p => {
                        if (p.socket.readyState === p.socket.OPEN) {
                            p.socket.send(JSON.stringify({ type: 'opponentLeft' }));
                        }
                    });
                }
                rooms.delete(socket.roomCode);
            }
        }
    });
});

  await app.listen({ port: process.env.PORT, host: '0.0.0.0' });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}



startServer();