import {  aaa  , getConversationId  , sendMsg , getMsgs , Xprank , sendNotification} from '../modules/user.module.js';

export default async function routes(fastify, options) {
  fastify.get('/', aaa);
  fastify.post('/getConversationId', getConversationId);
  
  fastify.post('/sendMsg' , sendMsg);
  fastify.post('/getMsgs' , getMsgs);

  fastify.get('/Xprank' , Xprank);

  fastify.post('/sendNotification' , sendNotification);
  // fastify.get('/getNotification' , getNotification);

}
