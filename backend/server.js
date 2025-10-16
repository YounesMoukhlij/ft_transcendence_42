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


app.decorate('users_socket', users_socket);



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
        if (socket){
          socket.send(message);
          socket.send(JSON.stringify({
            type: "message",
            data: `${message}`
          }));
          console.log("send to " , user , "===>" ,message)
        }
      }
    });

    socket.on('close', () => {
      console.log(`Client ${username} disconnected`);
      users_socket.delete(username);
    });
  });
});



app.listen({ port: 4444, host: '0.0.0.0' });

