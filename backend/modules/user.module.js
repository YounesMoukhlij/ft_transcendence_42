import jwt from 'jsonwebtoken';


export async function test(request , reply){

  
  reply.code(201).send(`hello ${request.user.id_user}`);
}







export async function getConversationId(request, reply) {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) 
      return reply.code(401).send({ error: "unauthorized: Missing token" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return reply.code(401).send({ error: "unauthorized: invalid header" });
    }

    const token = parts[1];

    let decodedObject;
    try {
      decodedObject = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return reply.code(401).send({ error: "unauthorized: invalid token" });
    }


    if (!request.body) {
      return reply.code(400).send({ error: "Invalid body format" });
    }

    const { friend_id } = request.body;
    if (!friend_id) {
      return reply.code(400).send({ error: "Missing friend id" });
    }


    const caseOne = friend_id + "," + decodedObject.id_user;
    const caseTwo = decodedObject.id_user + "," + friend_id;


    try {
      const query = request.server.db.prepare("SELECT * FROM room WHERE members = ?" );
      let result = query.get(caseOne);

      if (!result) {
        result = query.get(caseTwo);
      }

      if (result) {
        return reply.send(result);
      }

      return reply.code(404).send({ error: "conversation not found" });

    } catch (dberr) {
      console.error("database error: can't execute query", dberr);
      return reply.code(500).send({ error: "internal server error" });
    }

  } catch (Error) {
    console.error("Unexpected error:", Error);
    return reply.code(400).send({ error: "Bad Request: Unexpected error" });
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



export async function sendMsg(request, reply) {

  const { user, input, id, friend_id} = request.body;
  const authHeader = request.headers['authorization'];




  console.log(user , id , authHeader , friend_id);
  if (!id || !friend_id || !authHeader) {
    return reply.code(403).send("");
  }

  const token = authHeader.split(' ')[1];
  let decodedObject;

  decodedObject = jwt.verify(token, process.env.SECRET);



  const socket = request.server.users_socket.get(friend_id.toString());


  try {
    const query = request.server.db.prepare(
      "INSERT INTO message (conv_id, message, sender, isSeen) VALUES (?, ?, ?, ?)"
    );

    const isSeen = socket ? 1 : 0;
    query.run(id, input, decodedObject.id_user, isSeen);

    if (socket) {
      const data = {
        user,
        message: input,
        conv_id: id,
      };
      socket.send(JSON.stringify({
        type: "message",
        data,
      }));
    }

    reply.code(200).send({ success: true });
  } catch (err) {
    console.error("Error in sendMsg:", err);
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
      reply.code(200).send(true);
    else
      reply.code(200).send(false);

  } catch (err) {
    reply.code(500).send(err);
  }
}




export async function blockFunction(request , reply){

  const { user , conv_id , friend , friend_id} = request.body;

  const socket = request.server.users_socket.get(friend_id.toString());
  try{


    const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
    const data = querydata.get(conv_id);

    if (data.is_double_block === 1 && data.block_user === user){
      return reply.code(200);
    }



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

  const { user , conv_id , friend , friend_id} = request.body;



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

  
    reply.code(200);

    
  }catch(err){
    reply.code(500);
    console.log(err);
  }
}



export async function unfriend(request, reply) {

  const { user, friend, conv_id , friend_id } = request.body;
  
  try {
    const socket = request.server.users_socket.get(friend_id.toString());

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
