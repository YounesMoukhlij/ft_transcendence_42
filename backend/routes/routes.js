import { createUser, getUsers } from '../modules/user.module.js';

export default async function routes(fastify, options) {
  fastify.get('/user', createUser);
  fastify.get('/users', getUsers);
}
