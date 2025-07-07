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


app.decorate('db', db);
app.register(routes);

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  if (tables.length === 0) {
    const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    db.exec(init);
    app.log.info('Database initialized');
  }
} catch (err) {
  app.log.error('Database initialization error:', err);
  process.exit(1);
}



const wss = new WebSocketServer({ server: app.server, path: '/ws' });
const users_socket = new Map();


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
    console.log(`User ${username} registered`);

    socket.on('message', async (msg) => {
      const data = JSON.parse(msg);
      const {user , message , conv_id} = data;
      const res = await test_function(conv_id , user);
      for (const user of res) {
        const socket = users_socket.get(user);
        socket.send(message);
        console.log("send to " , user , "===>" ,message)
      }
    });

    socket.on('close', () => {
      console.log(`Client ${username} disconnected`);
      users_socket.delete(username);
    });
  });
});




app.listen({ port: 4444, host: '0.0.0.0' });

