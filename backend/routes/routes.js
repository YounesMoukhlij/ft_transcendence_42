import {getConversationId  , sendMsg , getMsgs , Xprank , IsOnline , blockFunction ,DeblockFunction , unfriend } from '../modules/user.module.js';
import { GetNotification , sendRequestFriend , AddFriend , GetFriends , DeleteFriendRequest } from '../modules/nofitication.moudle.js';

export default async function routes(fastify, options) {
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

}
