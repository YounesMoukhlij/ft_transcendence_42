import fastify from "fastify";
import routes from './routes/routes.js';
import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ logger: true });
const db = new Database('Database.db');

try {

  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  if (tables.length === 0) {
    const init = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    db.exec(init);
    app.log.info('Database initialized');
  }
} catch (err) {
  app.log.error('Database initialization failed:', err);
  process.exit(1);
}

app.decorate('db', db);


app.register(routes);

app.get('/', async (request, reply) => {
  try {
    const stmt = db.prepare("SELECT * FROM users");
    const users = stmt.all(); 
    return users;
  } catch (err) {
    app.log.error(err);
    reply.code(500).send({ error: 'Database query failed' });
  }
});


const start = async () => {
  try {
    await app.listen({ port: 4000 });
    console.log('Server running at http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
