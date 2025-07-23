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




export async function getConversationId(request, reply) {
  const user = request.body.user;
  const friend = request.body.friend;


  console.log(user);
  console.log(friend);

  const searchUser = `%,${user},%`;
  const searchFriend = `%,${friend},%`;


  console.log(searchFriend);
  console.log(searchUser);
  try {
    const query = request.server.db.prepare(
      "SELECT conversation_id FROM room WHERE members LIKE ? AND members LIKE ?"
    );
    const result = query.get(searchFriend, searchUser);

    if (result) {
      return reply.send(result);

    } else {
      reply.code(200).send([]);
    }
  } catch (err) {
    console.error("Database error:", err);
    reply.code(500).send({ error: "Internal server error" });
  }
}



export async function getMsgs (request , reply){
  const id = request.body.id;
  try{
      const query = request.server.db.prepare("SELECT * FROM message WHERE conv_id = ? ORDER BY created_at ASC");
      const messages = query.all(id);
      return reply.send(messages);

  }catch(err){
    console.log(err)
    reply.code(500).send({ error: "Internal server error" });
  }

}


export async function sendMsg (request , reply){

  const {user , input , id} = request.body;

  try{
      const query = request.server.db.prepare("INSERT INTO message (conv_id, message, sender) VALUES (?, ?, ?)");
      query.run(id, input, user);
      reply.code(200);
  }catch(err){
    console.log(err)
    reply.code(500).send({ error: "Internal server error" });
  }


}


export async function Xprank(request , reply){
  try {
    const users = request.server.db.prepare("SELECT * FROM users ORDER BY xp DESC").all();

    reply.send(users);
  } catch (err) {
    reply.code(500).send({ error: 'Database query failed' });
  }
}


