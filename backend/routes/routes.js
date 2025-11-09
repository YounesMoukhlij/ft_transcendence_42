import {getConversationId  , sendMsg , getMsgs , Xprank , IsOnline , blockFunction ,DeblockFunction , unfriend } from '../modules/user.module.js';
import { GetNotification , sendRequestFriend , AddFriend , GetFriends , DeleteFriendRequest , sendGameChallenge } from '../modules/nofitication.moudle.js';
import {
    AddUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    DeleteUserById,
    forgotPassword,
    verifyCode,
    resetPasswordWithToken,
    refreshToken,
    login,
    InitiateGoogleAuth,
    GoogleAuth,
    Initiate42Auth,
    FortyTwoAuth,
    // requestPasswordReset,
    updateUserInfo,
    updateUserPassword,
    update2FA,
} from '../modules/userAuth.module.js';

import { getUserStats, getUserStatsbyUsername } from '../modules/profile.module.js';
import { getMatchHistory } from '../modules/matchHistory.module.js';
import { getLeagueStats } from '../modules/leagues.module.js';













export default async function routes(fastify, options) {
    // Existing routes

   
    // User management routes
    fastify.post('/AddUser', AddUser);
    fastify.get('/getAllUsers', getAllUsers);
    fastify.get('/getUserById/:id', getUserById);
    fastify.get('/getUserByEmail/:email', getUserByEmail);
    fastify.delete('/DeleteUserById/:id', DeleteUserById);
    fastify.post('/sendGameChallenge' , sendGameChallenge);

    fastify.post('/getConversationId', getConversationId);
    fastify.get('/Xprank' , Xprank);
    fastify.get('/GetFriends' , GetFriends);
    fastify.post('/getMsgs' , getMsgs);
    fastify.post('/sendMsg' , sendMsg);
    fastify.get('/IsOnline' , IsOnline);
    fastify.post('/unfriend' , unfriend)
    fastify.post('/AddFriend' , AddFriend);
    fastify.post('/sendRequestFriend' , sendRequestFriend);
    fastify.get('/GetNotification' , GetNotification);    
    fastify.post('/block' , blockFunction);
    fastify.post('/Deblock' , DeblockFunction);
    fastify.delete('/DeleteFriendRequest' , DeleteFriendRequest);

    // setting routes
    fastify.post('/updateUserInfo', { preHandler: [fastify.authenticate] }, updateUserInfo);
    fastify.post('/updateUserPassword', { preHandler: [fastify.authenticate] }, updateUserPassword);
    fastify.post('/update2FA', { preHandler: [fastify.authenticate] }, update2FA);
    


    fastify.post('/forgotPassword', forgotPassword);
    fastify.post('/verifyCode', verifyCode);
    fastify.post('/resetPasswordWithToken', resetPasswordWithToken);


    // Password reset route
    // fastify.post('/resetPassword', resetPassword);

    fastify.post('/login', login);
    fastify.post('/refreshToken', refreshToken);
   
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


    // Ayoub

  // Profile Routes

  // logged in USer
  fastify.get('/getUserStats', getUserStats);

  // user by username 
  fastify.get('/getUserStats/:username', getUserStatsbyUsername);
  
  // leagues Toutes

  fastify.get('/getLeaguesStats/:league', getLeagueStats);


  // MatchHistory

  fastify.get('/getMatchHistory/:username', getMatchHistory);
}