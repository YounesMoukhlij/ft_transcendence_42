import { getConversationIdSchema , getMsgsSchema } from "./user.moduleSchema.js";





export async function getConversationId(request, reply) {

  const result = getConversationIdSchema.safeParse(request.body);

  if (!result.success) {
    return reply.code(400).send({ errors: result.error.errors });
  }
  const { friend_id } = result.data;

  const caseOne = friend_id + "," + request.user.id_user;
  const caseTwo = request.user.id_user + "," + friend_id;

  try
  {
    const query = request.server.db.prepare("SELECT * FROM room WHERE members = ?" );
    let result = query.get(caseOne);

    if (!result) {
      result = query.get(caseTwo);
    }

    if (result) {
      return reply.send(result);
    }

    return reply.code(404).send("conversation not found");

  }
  catch (dberr) {
    return reply.code(500).send( "internal server error" );
  }
}



export async function getMsgs(request , reply){
  const result = getMsgsSchema.safeParse(request.body);

  if (!result.success) {
    return reply.code(400).send({ errors: result.error.errors });
  }

  const { id } = result.data;

  try{
      const query = request.server.db.prepare("SELECT * FROM message WHERE conv_id = ? ORDER BY created_at ASC");
      const messages = query.all(id);
      return reply.send(messages);

  }catch(err){
    reply.code(500).send("Internal server error");
  }

}



export async function sendMsg(request, reply) {

  const { input, id, friend_id} = request.body;

  if (!id || !friend_id || !input ) {
    return reply.code(400).send("bad request ");
  }


  const socket = request.server.users_socket.get(friend_id.toString());


  try {
    const query = request.server.db.prepare(
      "INSERT INTO message (conv_id, message, sender, isSeen) VALUES (?, ?, ?, ?)"
    );

    const isSeen = socket ? 1 : 0;
    query.run(id, input, request.user.id_user, isSeen);

    if (socket) {
      // Get sender username for the message
      const getUserStmt = request.server.db.prepare('SELECT username FROM users WHERE id_user = ?');
      const senderUser = getUserStmt.get(request.user.id_user);

      const data = {
        message: input,
        conv_id: id,
        user: senderUser?.username || request.user.username, // Include sender username for updateLastMessage
        sender: request.user.id_user.toString(), // Include sender ID for addMessage
        created_at: new Date().toISOString(), // Include timestamp
        isSeen: 1, // Message is seen since friend is online (socket exists)
      };
      socket.send(JSON.stringify({
        type: "message",
        data,
      }));
    }

    reply.code(200).send( true );
  } catch (err) {
    reply.code(500).send({ error: "Internal server error" });
  }
}








export async function IsOnline(request , reply){

  const userId = request.query.userId;
  const socket = request.server.users_socket.get(userId.toString());

  try {
    if(socket)
      reply.code(200).send(true);
    else
      reply.code(200).send(false);

  } catch (err) {
    reply.code(500).send(err);
  }
}




export async function blockFunction(request , reply){

  const { conv_id , friend_id} = request.body;

  const socket = request.server.users_socket.get(friend_id.toString());
  try{


    const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
    const data = querydata.get(conv_id);

    if (data.is_double_block === 1 && data.block_user === request.user.username){
      return reply.code(200);
    }

    const query = request.server.db.prepare(`UPDATE room SET block_user = ?, is_double_block = CASE  WHEN is_double_block < 2 THEN is_double_block + 1 ELSE is_double_block END WHERE conversation_id = ?`);
    query.run(request.user.username , conv_id);

    if (socket){
        const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
        const data = querydata.get(conv_id);

        socket.send(JSON.stringify({
          type: "block",
          data: data
      }));
    }

    reply.send(true);

  }catch(err){
    reply.code(500);
    console.log(err);
  }
}


export async function DeblockFunction(request , reply){

  const {conv_id , friend , friend_id} = request.body;



  const socket = request.server.users_socket.get(friend_id.toString());

  try{
    const query = request.server.db.prepare(`SELECT * FROM  room WHERE conversation_id = ?`);
    const result = query.all(conv_id);



    if (result[0].is_double_block === 2){
      const query = request.server.db.prepare(`UPDATE room SET is_double_block = ?, block_user = ? WHERE conversation_id = ?`);
      query.run(1, friend, conv_id);

    }
    else if (result[0].is_double_block === 1) {
      const query = request.server.db.prepare(`UPDATE room SET is_double_block = ?, block_user = ? WHERE conversation_id = ?`);
      query.run( 0 , '' ,conv_id);
    }

    if (socket){

      const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
      const data = querydata.get(conv_id);

      socket.send(JSON.stringify({
        type: "block",
        data: data
      }));
    }


    reply.code(200).send(true);

  }catch(err){
    reply.code(500);
    console.log(err);
  }
}



export async function unfriend(request, reply) {

  const {conv_id , friend_id } = request.body;

  try {
    const socket = request.server.users_socket.get(friend_id.toString());

    const msg = request.server.db.prepare("DELETE FROM message WHERE conv_id = ?");
    msg.run(conv_id);

    const Roomquery = request.server.db.prepare("DELETE FROM room WHERE conversation_id = ?");
    Roomquery.run(conv_id);

    const Friendquery = request.server.db.prepare("DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)");
    Friendquery.run(request.user.id_user, friend_id, friend_id, request.user.id_user);

    if (socket){
      const data = {
        id_user : request.user.id_user,
        username: request.user.username
      };

      socket.send(JSON.stringify({
        type: "unfriend",
        data: data
      }));
    }

    reply.code(200);
  } catch (err) {
    console.log(err);
    reply.code(500).send({ error: 'Failed to unfriend' });
  }
}
