import { createUser, getUsers  , getConversationId ,aaa , sendMsg , getMsgs} from '../modules/user.module.js';

export default async function routes(fastify, options) {
  fastify.get('/user', createUser);
  fastify.get('/users', getUsers);
  fastify.get('/', aaa);
  fastify.post('/getConversationId', getConversationId);
  fastify.post('/sendMsg' , sendMsg);
  fastify.post('/getMsgs' , getMsgs);

}
