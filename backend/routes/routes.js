import {changeusersettings, getMsgs , IsOnline , blockFunction ,DeblockFunction , unfriend , pinned} from '../modules/user.module.js';
import { GetNotification , sendRequestFriend , AddFriend , GetFriends , DeleteFriendRequest, cancelFriendRequest , sendGameChallenge, AcceptGameChallenge , NotificationSeen, GetSentRequests , DeleteNotification } from '../modules/nofitication.moudle.js';
import {
    AddUser,
    DeleteAccount,
    forgotPassword,
    verifyCode,
    resetPasswordWithToken,
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
    leaderboard,
    searchUsers,
    me

} from '../modules/userAuth.module.js';
import { getUserStats, getUserStatsbyUsername } from '../modules/profile.module.js';
import { getMatchHistory } from '../modules/matchHistory.module.js';
import { getLeagueStats } from '../modules/leagues.module.js';
import { getPlayerProgress } from '../modules/playerProgress.js';
import { saveGameCustomization, getGameCustomization } from '../modules/game.module.js';
import { getTournamentBracket, recordMatchOnBlockChain, getMatchFromBlockChainById, getTournamentMatchesFromBlockChain } from '../modules/bracket.js';











export default async function routes(fastify, options) {

  fastify.addHook('onRequest' , async (request , reply) => {
    // const publicRoutes = ["/login", "/signUp", "/auth/42", "/42Auth" , "/AddUser" , "/getUserById/2"];
        const publicRoutes = ["/login", "/signUp", "/auth/42", "/42Auth" , "/AddUser" , "/forgotPassword",
       "/verifyCode", "/resetPasswordWithToken", "/auth/google", "/GoogleAuth", "/auth/42", "/42Auth", "/2fa/login-verify"];
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;


    
    if (publicRoutes.includes(pathname)) 
      return;
    
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: "here unauthorized" });
    }
  });


  

    fastify.post('/AddUser', AddUser);
    // fastify.get('/getAllUsers', getAllUsers);
    // fastify.get('/getUserById/:id', getUserById);
    // fastify.get('/getUserByEmail/:email', getUserByEmail);
    fastify.delete('/DeleteAccount', DeleteAccount);
    fastify.post('/sendGameChallenge' , sendGameChallenge);
    fastify.post('/startGame' , AcceptGameChallenge);
    fastify.post('/NotificationSeen' , NotificationSeen);
    fastify.post('/pinned' , pinned);
    fastify.post('/changeusersettings' , changeusersettings);
    // fastify.post('/SendTyping' ,SendTyping );

    fastify.get('/leaderboard', leaderboard);

    // Search
    fastify.get('/searchUsers', searchUsers);

    // fastify.get('/getConversationId', getConversationId);
    fastify.get('/GetFriends' , GetFriends);
    fastify.get('/getMsgs' , getMsgs);
    // fastify.post('/sendMsg' , sendMsg);
    fastify.get('/IsOnline' , IsOnline);
    fastify.post('/unfriend' , unfriend)
    fastify.post('/AddFriend' , AddFriend);
    fastify.post('/sendRequestFriend' , sendRequestFriend);
    fastify.get('/GetNotification' , GetNotification);    
    fastify.post('/block' , blockFunction);
    fastify.post('/Deblock' , DeblockFunction);
    fastify.delete('/DeleteFriendRequest' , DeleteFriendRequest);
    fastify.delete('/cancelFriendRequest', cancelFriendRequest);
    fastify.get('/getSentRequests', GetSentRequests);
    fastify.delete('/DeleteNotification' , DeleteNotification);

    // setting routes
    fastify.post('/updateUserInfo', updateUserInfo);
    fastify.post('/updateUserPassword', updateUserPassword);
    fastify.post('/update2FA', update2FA);
    


    fastify.post('/forgotPassword', forgotPassword);
    fastify.post('/verifyCode', verifyCode);
    fastify.post('/resetPasswordWithToken', resetPasswordWithToken);


    // Password reset route
    // fastify.post('/resetPassword', resetPassword);

    fastify.post('/login', login);
    // fastify.post('/refreshToken', refreshToken);
   
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
  // blockchain 
  fastify.get('/getTournamentBracket/:id', getTournamentBracket);
  fastify.post('/recordMatchOnBlockChain', recordMatchOnBlockChain);
  fastify.get('/getMatchFromBlockChainById/:id', getMatchFromBlockChainById);
  fastify.get('/getTournamentMatchesFromBlockChain/:id', getTournamentMatchesFromBlockChain);
  // Profile Routes

  // logged in USer
  fastify.get('/getUserStats', getUserStats);

  // user by username 
  fastify.get('/getUserStats/:username', getUserStatsbyUsername);
  
  // leagues Toutes

  fastify.get('/getLeaguesStats/:league', getLeagueStats);


  // MatchHistory

  fastify.get('/getMatchHistory/:username', getMatchHistory);


  // PLayer Progress (7days)
  fastify.get('/getPlayerProgress/:username', getPlayerProgress);
   // Game customization
  fastify.post('/saveGameCustomization', saveGameCustomization);
  fastify.get('/getGameCustomization', getGameCustomization);



  // zakaria
  fastify.post('/2fa/generate',generate2FA); // khasra
  fastify.post('/2fa/verify', verifyAndEnable2FA);
  fastify.post('/2fa/login-verify', loginVerify2FA);
  fastify.get('/me', me);

}