import {  aaa  , getConversationId  , sendMsg , getMsgs , Xprank } from '../modules/user.module.js';
import { GetNotification , sendRequestFriend , AddFriend , GetFriends } from '../modules/nofitication.moudle.js';

export default async function routes(fastify, options) {
  fastify.get('/', aaa);
  // fastify.post('/getConversation', getConversation);

  fastify.get('/Xprank' , Xprank);

  fastify.get('/GetNotification' , GetNotification);
  fastify.post('/sendRequestFriend' , sendRequestFriend);
  fastify.post('/AddFriend' , AddFriend);
  fastify.get('/GetFriends' , GetFriends);


  // user management
  // createuser
  // login
  // logout
  // update user info
  // delete user
  fastify.post('/AddUser', AddUser);
  fastify.post('/Login', Login);
  fastify.post('/Logout', Logout);
  fastify.put('/UpdateUser', UpdateUser);
  fastify.delete('/DeleteUser', DeleteUser);
  fastify.get('/GetUsers', GetUsers);
  fastify.get('/GetUserById/:id', GetUserById);


}
