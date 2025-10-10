import { aaa, getConversationId, sendMsg, getMsgs, Xprank } from '../modules/user.module.js';
import { GetNotification, sendRequestFriend, AddFriend, GetFriends } from '../modules/nofitication.moudle.js';
import {
    AddUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    DeleteUserById,
    login,
    InitiateGoogleAuth,
    GoogleAuth,
    Initiate42Auth,
    FortyTwoAuth,
    resetPassword
} from '../modules/userAuth.module.js';

export default async function routes(fastify, options) {
    // Existing routes
    fastify.get('/', aaa);
    fastify.get('/Xprank', Xprank);
    fastify.get('/GetNotification', GetNotification);
    fastify.post('/sendRequestFriend', sendRequestFriend);
    fastify.post('/AddFriend', AddFriend);
    fastify.get('/GetFriends', GetFriends);
   
    // User management routes
    fastify.post('/AddUser', AddUser);
    fastify.get('/getAllUsers', getAllUsers);
    fastify.get('/getUserById/:id', getUserById);
    fastify.get('/getUserByEmail/:email', getUserByEmail);
    fastify.delete('/DeleteUserById/:id', DeleteUserById);

    // Password reset route
    fastify.post('/resetPassword', resetPassword);

    fastify.post('/login', login);
   
    // ====== GOOGLE OAUTH ROUTES ======
    // Step 1: Initiate OAuth flow
    fastify.get('/auth/google', InitiateGoogleAuth);
    
    // Step 2: Google redirects here with code
    fastify.get('/GoogleAuth', GoogleAuth);
    
    // ====== 42 OAUTH ROUTES ======
    // Step 1: Initiate OAuth flow
    fastify.get('/auth/42', Initiate42Auth);
    
    // Step 2: 42 redirects here with code
    fastify.get('/42Auth', FortyTwoAuth);
}