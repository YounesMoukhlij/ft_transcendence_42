import fastify from "fastify";
import routes from './routes/routes.js';
import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors'

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
    app.log.info('database initialized');
  }
} catch (err) {
  app.log.error('database initialization error:', err);
  process.exit(1);
}





const start = async () => {
  try {
    await app.listen({ port: 4444 });
    console.log('Server running at http://localhost:4444');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
