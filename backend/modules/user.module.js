import fastify from "fastify";

export async function createUser(request, reply) {
  return {
    message: `User created`,
  };
}



export async function getUsers(request, reply) {
  return {
    message: `User hhhhhhh khdam `,
  };
}


export async function aaa(request, reply) {
  try {
    const users = request.server.db.prepare("SELECT * FROM users").all();
    reply.send(users);
  } catch (err) {
    reply.code(500).send({ error: 'Database query failed' });
  }
}


export async function getConversation(request , reply){
 console.log('Route params:', request.body);
  reply.send([
    {id: 1 , ms:'hello brother are you fine ', sender:'avatar'},
    {id: 2 , ms:'hello brother are you fine ', sender:'savatae'},
    {id: 2 , ms:'hello brother are you fine ', sender:'abechcha'},
    {id: 2 , ms:'hello brother are you fine ', sender:'savatar'}
]);
}