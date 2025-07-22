import {  aaa  , getConversationId  , sendMsg , getMsgs , Xprank } from '../modules/user.module.js';
import { GetNotification , sendRequestFriend , AddFriend } from '../modules/nofitication.moudle.js';
import { createUser, getUsers   } from '../modules/user.module.js';

export default async function routes(fastify, options) {
  fastify.get('/', aaa);
  // fastify.post('/getConversation', getConversation);

  fastify.get('/Xprank' , Xprank);

  fastify.get('/GetNotification' , GetNotification);
  fastify.post('/sendRequestFriend' , sendRequestFriend);
  fastify.post('/AddFriend' , AddFriend);

}
