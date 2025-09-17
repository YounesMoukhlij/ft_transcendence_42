
export async function getConversationId(request, reply) {
  const user = request.body.user;
  const friend = request.body.friend;

  const caseOne = user + ',' + friend;
  const caseTwo = friend + ',' + user;


  try {
    const query = request.server.db.prepare("SELECT * FROM room WHERE members = ?");

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



export async function Xprank(request, reply) {
  try {
    const username = request.query.user;
    const idQuery = request.server.db.prepare("SELECT id_user FROM users WHERE username = ?");
    const res = idQuery.get(username);

    if (!res) {
      return reply.code(404).send({ error: 'User not found' });
    }

    const currentUserId = res.id_user;


    const users = request.server.db.prepare("SELECT * FROM users ORDER BY xp DESC").all();
;

    const friendsQuery = request.server.db.prepare(`SELECT friend_id  FROM friends WHERE user_id = ? UNION SELECT user_id FROM friends WHERE friend_id = ?`);
    const friendsResult = friendsQuery.all(currentUserId, currentUserId);
    


    const friends = [...new Set(friendsResult.map((entry) => entry.friend_id))];


    const usersWithStatus = users.map((user) => {


      let friendStatus = 'not friend'; 

      if (friends.includes(user.id_user)) {
        friendStatus = 'friend';
      }

      return { ...user, friend_status: friendStatus };
    });

    reply.send(usersWithStatus);
  } catch (err) {
    console.error('Error in Xprank endpoint:', err);
    reply.code(500).send({ error: 'Database query failed', details: err.message });
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




export async function blockFunction(request , reply){

  const { user , conv_id , friend } = request.body;
  const socket = request.server.users_socket.get(friend);
  try{
    const query = request.server.db.prepare(`UPDATE room SET block_user = ?, is_double_block = CASE  WHEN is_double_block < 2 THEN is_double_block + 1 ELSE is_double_block END WHERE conversation_id = ?`);
    query.run(user , conv_id);

    
    
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

  const { user , conv_id , friend} = request.body;
  const socket = request.server.users_socket.get(friend);

  try{
    const query = request.server.db.prepare(`SELECT * FROM  room WHERE conversation_id = ?`);
    const result = query.all(conv_id);

    if (result[0].is_double_block === 2){
      const query = request.server.db.prepare(`UPDATE room SET is_double_block = ? AND block_user = ?  WHERE conversation_id = ?`);
      query.run( 1 , friend, conv_id);
    }
    else if (result[0].is_double_block === 1) {
      const query = request.server.db.prepare(`UPDATE room SET is_double_block = ? WHERE conversation_id = ?`);
      query.run( 0 ,conv_id);
    }

    if (socket){
      const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
      const data = querydata.get(conv_id);
      socket.send(JSON.stringify({
        type: "block",
        data: data
      }));
    }

    
    console.log(result[0].is_double_block);

    reply.send(true);
    
  }catch(err){
    reply.code(500);
    console.log(err);
  }
}



export async function unfriend(request, reply) {

  const { user, friend, conv_id } = request.body;
  
  try {
    const socket = request.server.users_socket.get(friend);

    const query = request.server.db.prepare("SELECT id_user FROM users WHERE username = ?");
    const userresult = query.get(user);
    const user1Id = userresult.id_user;
    const query1 = request.server.db.prepare("SELECT id_user FROM users WHERE username = ?");
    const result = query1.get(friend);
    const user2Id = result.id_user;

    const msg = request.server.db.prepare("DELETE FROM message WHERE conv_id = ?");
    msg.run(conv_id);

    const Roomquery = request.server.db.prepare("DELETE FROM room WHERE conversation_id = ?");
    Roomquery.run(conv_id);

    const Friendquery = request.server.db.prepare("DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)");
    Friendquery.run(user1Id, user2Id, user2Id, user1Id);




    if (socket){

      const data = {
        username: user
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
