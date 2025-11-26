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
  let casualWaitingPool = [];
  let tournamentWaitingPool = [];
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
    const rooms = new Map();
    const gameIntervals = new Map();
    const tournaments = new Map();

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PADDLE_HEIGHT = 100;
    const BALL_RADIUS = 10;
    const WINNING_SCORE = 10;

    function saveGameResult(gameState) {
        const { player1, player2 } = gameState;
        let winner, loser;

        if (player1.score >= WINNING_SCORE) {
            winner = player1;
            loser = player2;
        } else {
            winner = player2;
            loser = player1;
        }

        try {
            const stmt = db.prepare(
                'INSERT INTO game_history (user_win, user_lose, win_score, lose_score, type) VALUES (?, ?, ?, ?, ?)'
            );
            stmt.run(winner.id, loser.id, winner.score, loser.score, 'casual');
            app.log.info(`Game result saved: ${winner.username} vs ${loser.username}`);
        } catch (error) {
            app.log.error('Error saving game result:', error);
        }
    }

    function updateGameState(room, roomCode) {
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

        // Check for winner
        if (state.player1.score >= WINNING_SCORE || state.player2.score >= WINNING_SCORE) {
            saveGameResult(state);
            const intervalId = gameIntervals.get(roomCode);
            if (intervalId) {
                clearInterval(intervalId);
                gameIntervals.delete(roomCode);
            }
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
            updateGameState(room, roomCode);
            const gameStatePayload = {
                type: 'gameState',
                payload: room.gameState
            };
            room.players.forEach(p => {
                if (p.socket.readyState === p.socket.OPEN) {
                    p.socket.send(JSON.stringify(gameStatePayload));
                }
            });
        }, 1000 / 60); // game b 60 FPS, change it for another fps, 60 ahsn haja 

        gameIntervals.set(roomCode, intervalId);
    }


    wss.on('connection', (socket) => {
    let id = 0;
    let username = '';

    socket.on('message', (msg) => {
        try {
            const message = JSON.parse(msg);
            const roomCode = socket.roomCode;
            const room = rooms.get(roomCode);

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

                    const opponentIndex = casualWaitingPool.findIndex(p => p.socket !== socket);

                    if (opponentIndex > -1) {
                        const opponent = casualWaitingPool.splice(opponentIndex, 1)[0];
                        const newRoomCode = Math.random().toString(36).substring(7);

                        const players = [
                            { username: player.username, socket: player.socket, id: player.id },
                            { username: opponent.username, socket: opponent.socket, id: opponent.id },
                        ];

                        socket.roomCode = newRoomCode;
                        opponent.socket.roomCode = newRoomCode;

                        const newRoom = {
                            players,
                            rematchRequestedBy: null,
                            gameState: {
                                player1: { id: player.id, username: player.username, y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0, score: 0, customization: player.customization },
                                player2: { id: opponent.id, username: opponent.username, y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0, score: 0, customization: opponent.customization },
                                ball: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: 5, dy: 5 },
                            }
                        };
                        rooms.set(newRoomCode, newRoom);

                        console.log('----> Match found, starting game in room:', newRoomCode);
                        const matchDetails = {
                            roomCode: newRoomCode,
                            players: [
                                { username: player.username, customization: player.customization },
                                { username: opponent.username, customization: opponent.customization }
                            ],
                        };

                        players.forEach(p => {
                            p.socket.send(JSON.stringify({ type: 'matchFound', payload: matchDetails }));
                        });

                        startGame(newRoomCode, newRoom);

                    } else {
                        casualWaitingPool.push(player);
                        socket.send(JSON.stringify({ type: 'searching', payload: 'Waiting for an opponent...' }));
                    }
                    break;

                case 'paddleMove':
                    if (room) {
                        const playerToUpdate = room.gameState.player1.id === id ? room.gameState.player1 : room.gameState.player2;
                        if (playerToUpdate) {
                            const { direction } = message.payload;
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

                case 'rematch:request':
                    if (room) {
                        const opponent = room.players.find(p => p.id !== id);
                        if (room.rematchRequestedBy === opponent.id) {
                            // Opponent already requested, start rematch
                            room.gameState.player1.score = 0;
                            room.gameState.player2.score = 0;
                            resetBall(room.gameState);
                            room.rematchRequestedBy = null;
                            room.players.forEach(p => p.socket.send(JSON.stringify({ type: 'rematch:start', payload: room.gameState })));
                            startGame(roomCode, room);
                        } else {
                            room.rematchRequestedBy = id;
                            opponent.socket.send(JSON.stringify({ type: 'rematch:offer' }));
                        }
                    }
                    break;

                case 'rematch:accept':
                    if (room && room.rematchRequestedBy) {
                        room.gameState.player1.score = 0;
                        room.gameState.player2.score = 0;
                        resetBall(room.gameState);
                        room.rematchRequestedBy = null;
                        room.players.forEach(p => p.socket.send(JSON.stringify({ type: 'rematch:start', payload: room.gameState })));
                        startGame(roomCode, room);
                    }
                    break;

                case 'rematch:decline':
                    if (room) {
                        const opponent = room.players.find(p => p.id !== id);
                        if (opponent && opponent.socket.readyState === opponent.socket.OPEN) {
                            opponent.socket.send(JSON.stringify({ type: 'rematch:declined' }));
                        }
                        room.rematchRequestedBy = null;
                    }
                    break;

                case 'leaveRoom':
                    if (rooms.has(roomCode)) {
                        const roomToLeave = rooms.get(roomCode);
                        roomToLeave.players = roomToLeave.players.filter(p => p.socket !== socket);

                        const intervalId = gameIntervals.get(roomCode);
                        if (intervalId) {
                            clearInterval(intervalId);
                            gameIntervals.delete(roomCode);
                        }
                        rooms.delete(roomCode);

                        roomToLeave.players.forEach(p => {
                            p.socket.send(JSON.stringify({ type: 'playerLeft', payload: { username: 'A player' } }));
                        });
                    }
                    break;
                case 'game':
                    switch (message.action) {
                        case 'createTournament':
                            const { type, playerCount, playerName, avatar, color, isPrivate } = message.payload;
                            const newTournamentId = Math.random().toString(36).substring(2, 9);
                            const newHostPlayer = { id, username: playerName, avatar, color };
                            const newTournament = {
                                id: newTournamentId,
                                name: `${playerName}'s Tournament`,
                                host: newHostPlayer,
                                maxPlayers: playerCount,
                                currentPlayers: 1,
                                status: 'waiting',
                                isPrivate,
                                registeredPlayers: [newHostPlayer],
                                type,
                            };
                            tournaments.set(newTournamentId, newTournament);
                            socket.send(JSON.stringify({
                                type: 'tournamentCreated',
                                data: {
                                    tournament: newTournament,
                                    tournamentId: newTournamentId,
                                }
                            }));
                            break;
                        case 'inviteToTournament':
                            const { friendId } = message.payload;
                            const friendSocket = users_socket.get(friendId.toString());

                            const inviteTournamentId = Math.random().toString(36).substring(2, 9);
                            const hostUser = db.prepare("SELECT profile_img as avatar FROM users WHERE id_user = ?").get(id);
                            const inviteHostPlayer = { id, username, socket, avatar: hostUser.avatar };
                            const inviteTournament = {
                                id: inviteTournamentId,
                                name: `${username}'s Tournament`,
                                host: inviteHostPlayer,
                                maxPlayers: 4,
                                currentPlayers: 1,
                                status: 'waiting',
                                isPrivate: true,
                                registeredPlayers: [inviteHostPlayer],
                                type: 'remote',
                            };
                            tournaments.set(inviteTournamentId, inviteTournament);

                            if (friendSocket) {
                                friendSocket.send(JSON.stringify({
                                    type: 'tournamentInvite',
                                    data: {
                                        from: {
                                            id,
                                            username,
                                        },
                                        tournamentId: inviteTournamentId,
                                    }
                                }));
                            }
                            break;

                        case 'acceptTournamentInvite':
                            const { tournamentId: acceptedTournamentId } = message.payload;
                            const acceptedTournament = tournaments.get(acceptedTournamentId);
                            if (acceptedTournament && acceptedTournament.currentPlayers < acceptedTournament.maxPlayers) {
                                const joiningUser = db.prepare("SELECT profile_img as avatar FROM users WHERE id_user = ?").get(id);
                                const player = { id, username, socket, avatar: joiningUser.avatar };
                                acceptedTournament.registeredPlayers.push(player);
                                acceptedTournament.currentPlayers++;
                                if (acceptedTournament.currentPlayers === acceptedTournament.maxPlayers) {
                                    acceptedTournament.status = 'playing';
                                }
                                acceptedTournament.registeredPlayers.forEach(p => {
                                    p.socket.send(JSON.stringify({
                                        type: 'tournamentUpdated',
                                        data: acceptedTournament,
                                    }));
                                });
                            }
                            break;
                        case 'findRandomOpponent':
                            // Add user to the waiting pool
                            const player = {
                                id,
                                username: message.payload.playerName,
                                avatar: message.payload.avatar,
                                color: message.payload.color,
                                socket: socket,
                            };
                            tournamentWaitingPool.push(player);

                            // Check if there's a match
                            if (tournamentWaitingPool.length >= 4) {
                                const players = tournamentWaitingPool.splice(0, 4);
                                const randomTournamentId = Math.random().toString(36).substring(2, 9);
                                const randomTournament = {
                                    id: randomTournamentId,
                                    name: `Tournament`,
                                    host: players[0],
                                    maxPlayers: 4,
                                    currentPlayers: 4,
                                    status: 'playing',
                                    isPrivate: false,
                                    registeredPlayers: players,
                                    type: 'remote',
                                };
                                tournaments.set(randomTournamentId, randomTournament);

                                players.forEach(p => {
                                    p.socket.send(JSON.stringify({
                                        type: 'tournamentCreated',
                                        data: {
                                            tournament: randomTournament,
                                            tournamentId: randomTournamentId,
                                        }
                                    }));
                                });
                            }
                            break;
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

            // Remove from casual waiting pool
            const casualIndex = casualWaitingPool.findIndex(p => p.socket === socket);
            if (casualIndex > -1) {
                casualWaitingPool.splice(casualIndex, 1);
            }

            // Remove from tournament waiting pool
            const tournamentIndex = tournamentWaitingPool.findIndex(p => p.socket === socket);
            if (tournamentIndex > -1) {
                tournamentWaitingPool.splice(tournamentIndex, 1);
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
