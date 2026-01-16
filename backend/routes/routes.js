import {changeusersettings, getMsgs  , GetbotMessages, GetbotChat, blockFunction ,DeblockFunction , unfriend , pinned} from '../modules/user.module.js';
import { GetNotification , sendRequestFriend , AddFriend , GetFriends , DeleteFriendRequest, cancelFriendRequest , sendGameChallenge, AcceptGameChallenge , NotificationSeen, GetSentRequests , DeleteNotification ,getConversationId } from '../modules/nofitication.moudle.js';
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
    updateUserInfo,
    updateUserPassword,
    update2FA,
    generate2FA,        
    verifyAndEnable2FA, 
    loginVerify2FA,
    leaderboard,
    searchUsers,
    me,
    registerInTournament,
    saveTournamentMatch,
    createLocalTournament

} from '../modules/userAuth.module.js';
import { getUserStats, getUserStatsbyId } from '../modules/profile.module.js';
import { getMatchHistory } from '../modules/matchHistory.module.js';
import { getLeagueStats } from '../modules/leagues.module.js';
import { getPlayerProgress } from '../modules/playerProgress.js';
import { saveGameCustomization, getGameCustomization } from '../modules/game.module.js';
import { getTournamentBracket, recordMatchOnBlockChain, getMatchFromBlockChainById, getTournamentMatchesFromBlockChain } from '../modules/bracket.js';











export default async function routes(fastify, options) {

  fastify.addHook('onRequest' , async (request , reply) => {
        const publicRoutes = ["/login", "/signUp", "/auth/42", "/42Auth" , "/AddUser" , "/forgotPassword",
       "/verifyCode", "/resetPasswordWithToken", "/auth/google", "/GoogleAuth", "/auth/42", "/42Auth", "/2fa/login-verify"];
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;


    
    if (publicRoutes.includes(pathname)) 
      return;
    
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: "unauthorized" });
    }
  });

  fastify.get('/GetbotMessages' , GetbotMessages);
  fastify.get('/GetbotChat' , GetbotChat),
  

  fastify.post('/AddUser', AddUser);
  fastify.post('/2fa/generate',generate2FA); // khasra
  fastify.post('/2fa/verify', verifyAndEnable2FA);
  fastify.post('/2fa/login-verify', loginVerify2FA);
  fastify.get('/me', me);
  fastify.post('/DeleteAccount', DeleteAccount);
  fastify.post('/changeusersettings' , changeusersettings);
  fastify.get('/leaderboard', leaderboard);
  fastify.post('/updateUserInfo', updateUserInfo);
  fastify.post('/updateUserPassword', updateUserPassword);
  fastify.post('/update2FA', update2FA);
  fastify.post('/forgotPassword', forgotPassword);
  fastify.post('/verifyCode', verifyCode);
  fastify.post('/resetPasswordWithToken', resetPasswordWithToken);
  fastify.post('/login', login);
  fastify.post('/registerInTournament', registerInTournament);
  fastify.post('/saveTournamentMatch', saveTournamentMatch);
  fastify.get('/auth/google', InitiateGoogleAuth);
  fastify.get('/auth/42', Initiate42Auth);
  fastify.get('/GoogleAuth', GoogleAuth);
  fastify.get('/42Auth', FortyTwoAuth);
  

  fastify.post('/sendGameChallenge' , sendGameChallenge); // in order to send game challenge must be the user in friend list 
  fastify.post('/startGame' , AcceptGameChallenge);     // Dont start the game unless it is in notifications,and must not be expired, and the user sent the invite can't accept
  fastify.post('/saveGameCustomization', saveGameCustomization);    // missing parsing
  fastify.get('/searchUsers', searchUsers);
  fastify.get('/getGameCustomization', getGameCustomization);


  fastify.post('/NotificationSeen' , NotificationSeen);
  fastify.post('/pinned' , pinned);
  fastify.get('/GetFriends' , GetFriends);
  fastify.get('/getMsgs' , getMsgs);
  fastify.post('/unfriend' , unfriend);   
  fastify.post('/AddFriend' , AddFriend);
  fastify.post('/sendRequestFriend' , sendRequestFriend); 
  fastify.get('/GetNotification' , GetNotification);    
  fastify.post('/block' , blockFunction);
  fastify.post('/Deblock' , DeblockFunction);  
  fastify.get('/getSentRequests', GetSentRequests);
  fastify.get('/getConversationId' , getConversationId);
  fastify.delete('/DeleteFriendRequest' , DeleteFriendRequest);
  fastify.delete('/cancelFriendRequest', cancelFriendRequest);
  fastify.delete('/DeleteNotification' , DeleteNotification);






  fastify.get('/getUserStats', getUserStats);
  fastify.get('/getUserStats/:id', getUserStatsbyId);
  fastify.get('/getLeaguesStats/:league', getLeagueStats);
  fastify.get('/getMatchHistory/:username', getMatchHistory);
  fastify.get('/getPlayerProgress/:username', getPlayerProgress); // ila salina 
  // Game endpoints with additional protection
  fastify.get('/getTournamentBracket/:id', getTournamentBracket);


  // ana ayoub zedt hadi but dyal local tournament

  fastify.post('/createLocalTournament', createLocalTournament);



  // ----------------------

  // fastify.post('/recordMatchOnBlockChain', recordMatchOnBlockChain);
  fastify.get('/getMatchFromBlockChainById/:id', getMatchFromBlockChainById);
  fastify.get('/getTournamentMatchesFromBlockChain/:id', getTournamentMatchesFromBlockChain);





}