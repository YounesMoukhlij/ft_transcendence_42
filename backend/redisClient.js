// backend/redisClient.js
const { createClient } = require('redis');

// Creates a client instance targeting the local Redis server (default port 6379)
const client = createClient({
    url: 'redis://localhost:6379' 
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect the client immediately
client.connect()
    .then(() => console.log('Redis connected successfully!'))
    .catch(err => console.error('Failed to connect to Redis:', err));

module.exports = client;