import { aaa, getConversationId, sendMsg, getMsgs, Xprank } from '../modules/user.module.js';
import { GetNotification, sendRequestFriend, AddFriend, GetFriends } from '../modules/nofitication.moudle.js';
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
    generate2FA,        
    verifyAndEnable2FA, 
    loginVerify2FA,
    leaderboard      

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
    fastify.get('/getAllUsers',{ preHandler: [fastify.authenticate] }, getAllUsers);
    fastify.get('/getUserById/:id', getUserById);
    fastify.get('/getUserByEmail/:email', getUserByEmail);
    fastify.delete('/DeleteUserById/:id', DeleteUserById);

    //leaderboard
    fastify.get('/leaderboard', leaderboard);

    // setting routes
    fastify.post('/updateUserInfo', { preHandler: [fastify.authenticate] }, updateUserInfo);
    fastify.post('/updateUserPassword', { preHandler: [fastify.authenticate] }, updateUserPassword);
    
    // --- MODIFIED 2FA Routes ---
    
    // This route is now only for *disabling* 2FA
    fastify.post('/update2FA', { preHandler: [fastify.authenticate] }, update2FA);
    
    // Step 1 of enabling 2FA (setup)
    fastify.post('/2fa/generate', { preHandler: [fastify.authenticate] }, generate2FA);
    
    // Step 2 of enabling 2FA (setup)
    fastify.post('/2fa/verify', { preHandler: [fastify.authenticate] }, verifyAndEnable2FA);



    // Password reset route
    // fastify.post('/requestPasswordReset', resetPassword);
    fastify.post('/forgotPassword', forgotPassword);
    fastify.post('/verifyCode', verifyCode);
    fastify.post('/resetPasswordWithToken', resetPasswordWithToken);

    fastify.post('/login', login);
    fastify.post('/refreshToken', refreshToken);

    // --- NEW: 2FA LOGIN VERIFICATION ---
    // This route is called after /login, /GoogleAuth, or /42Auth
    // if 2FA is required.
    fastify.post('/2fa/login-verify', loginVerify2FA);
   
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