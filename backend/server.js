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
  .replace(/^,|,$/g, '') // remove leading/trailing commas
  .split(',')           
  .filter(Boolean);     



const new_res = usernames.filter(name => name !== sender);
return(new_res); 
}





wss.on('connection', (socket) => {
  console.log('Client connected');

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
    query.run(1, username);
    console.log(`User ${username} registered`);
    
    socket.on('close', () => {
      console.log(`Client ${username} disconnected`);
      users_socket.delete(username);
      db.prepare('UPDATE users SET status = ? WHERE username = ?');
      query.run(0 , username);
    });
  });
});




app.listen({ port: 4444, host: '0.0.0.0' });

