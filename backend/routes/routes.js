import { aaa, getConversationId, sendMsg, getMsgs, Xprank } from '../modules/user.module.js';
import { GetNotification, sendRequestFriend, AddFriend, GetFriends } from '../modules/nofitication.moudle.js';
import {
    AddUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    login,
    GoogleAuth  // Make sure this is imported
} from '../modules/userAuth.module.js';

export default async function routes(fastify, options) {
    fastify.get('/', aaa);
    fastify.get('/Xprank', Xprank);
    fastify.get('/GetNotification', GetNotification);
    fastify.post('/sendRequestFriend', sendRequestFriend);
    fastify.post('/AddFriend', AddFriend);
    fastify.get('/GetFriends', GetFriends);
   
    // User management
    fastify.post('/AddUser', AddUser);
    fastify.get('/getAllUsers', getAllUsers);
    fastify.get('/getUserById/:id', getUserById);
    fastify.get('/getUserByEmail/:email', getUserByEmail);
    fastify.post('/login', login);
    
    // GOOGLE OAUTH - THIS IS THE CORRECT WAY
    fastify.get('/GoogleAuth', GoogleAuth);  // GET request, path matches exactly
}