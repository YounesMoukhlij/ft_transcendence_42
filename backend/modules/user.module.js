
export async function getConversationId(request, reply) {
  const user = request.body.user;
  const friend = request.body.friend;

  const caseOne = user + ',' + friend;
  const caseTwo = friend + ',' + user;


  try {
    const query = request.server.db.prepare("SELECT conversation_id FROM room WHERE members = ?");

    let result = query.get(caseOne);

    if (!result) {
      result = query.get(caseTwo);
    }

    if (result) {
      return reply.send(result);
    } else {
      reply.code(404).send({ error: "Conversation not found" });
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

  const {user , input , id , friend} = request.body;

  const socket = request.server.users_socket.get(friend);

  try{
      const query = request.server.db.prepare("INSERT INTO message (conv_id, message, sender , isSeen) VALUES (?, ?, ? , ?)");
      if (socket){
        query.run(id, input, user , 1);
      }
      else 
        query.run(id, input, user , 0);

      if (socket){
        const data = {
          user:user,
          message:input,
          conv_id: id,
        };
          socket.send(JSON.stringify({
          type: "message",
          data: data
        }));
      }
      else{
        request.server.waitingMessages.add(friend);
      }
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


export async function IsOnline(request , reply){
  const username = request.query.username;
  const socket = request.server.users_socket.get(username);
  try {
    if(socket)
      reply.send(true);
    else
      reply.send(false);

  } catch (err) {
    reply.code(500).send(err);
  }
}

