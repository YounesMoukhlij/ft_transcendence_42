import {ParseIdSchema ,usersettings , BlockSchema , PinnedSchema} from "./moduleSchema.js";


export async function getMsgs(request , reply){

  const result = ParseIdSchema.safeParse(request.query);

  if (!result.success) {
    return reply.code(400).send("missing params");
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



export async function blockFunction(request , reply){

  const result = BlockSchema.safeParse(request.body);

  if (!result.success)
    return reply.code(400).send("missing params");

  const { conv_id , friend_id} = result.data;



  const socket = request.server.users_socket.get(friend_id.toString());
  try{


    const roomStmt = request.server.db.prepare("SELECT members FROM room WHERE conversation_id = ?");
    const room = roomStmt.get(conv_id);

    if (!room)
      return reply.code(404).send({ error: "conversation  not found" });

    const members = room.members.split(',').map(n => Number(n));

    if (!members.includes(request.user.id_user))
      return reply.code(403).send({ error: "you are not a member of this conversation" });


    const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
    const data = querydata.get(conv_id);

    if (data.blockedByUser1 !== -1 && data.blockedByUser2 !== -1)
      return reply.code(200);

    let query;
    if (data.blockedByUser1 === -1)
      query = request.server.db.prepare(`UPDATE room SET blockedByUser1 = ? WHERE conversation_id = ?`);
    else
      query = request.server.db.prepare(`UPDATE room SET blockedByUser2 = ? WHERE conversation_id = ?`);
    query.run(request.user.id_user , conv_id);
    
    if (socket){
        const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
        const data = querydata.get(conv_id);

        socket.send(JSON.stringify({
          type: "block",
          data: {
            ...data,
            id: request.user.id_user,
            subtype:"block"
          }
      }));
    }
    reply.send(true);
    
  }catch(err){
    reply.code(500);
    console.log(err);
  }
}


export async function DeblockFunction(request , reply){

  const result = BlockSchema.safeParse(request.body);
  if (!result.success)
    return reply.code(400).send("midding prams");
  
  const {conv_id , friend_id } = result.data;


  const socket = request.server.users_socket.get(friend_id.toString());

  try{

    const roomStmt = request.server.db.prepare("SELECT members FROM room WHERE conversation_id = ?");
    const room = roomStmt.get(conv_id);

    if (!room)
      return reply.code(404).send({ error: "conversation  not found" });

    const members = room.members.split(',').map(n => Number(n));

    if (!members.includes(request.user.id_user))
      return reply.code(403).send({ error: "you are not a member of this conversation" });

    const query = request.server.db.prepare(`SELECT * FROM  room WHERE conversation_id = ?`);
    const result = query.all(conv_id);


    
    if (result[0].blockedByUser1 === -1 && result[0].blockedByUser2 === -1)
      return reply.code(200).send(true);

    let queryDeblock;
    if (result[0].blockedByUser1 === request.user.id_user)
      queryDeblock = request.server.db.prepare(`UPDATE room SET blockedByUser1 = ? WHERE conversation_id = ?`)
    else if (result[0].blockedByUser2 === request.user.id_user)
      queryDeblock = request.server.db.prepare(`UPDATE room SET blockedByUser2 = ? WHERE conversation_id = ?`)
    queryDeblock.run(-1 , conv_id);

    if (socket){

      const querydata = request.server.db.prepare(`SELECT * from room WHERE conversation_id = ?`);
      const data = querydata.get(conv_id);

      socket.send(JSON.stringify({
        type: "block",
        data: {
          ...data,
          id: request.user.id_user,
          subtype:"deblock"
        }
      }));
    }


    reply.code(200).send(true);
    
  }catch(err){
    reply.code(500);
    console.log(err);
  }
}


export async function unfriend(request, reply) {
  const result = BlockSchema.safeParse(request.body);
  if (!result.success)
    return reply.code(400).send("missing params");

  const { conv_id, friend_id } = result.data;
  const userId = request.user.id_user;

  try {
 
    const roomStmt = request.server.db.prepare(
      "SELECT members FROM room WHERE conversation_id = ?"
    );
    const room = roomStmt.get(conv_id);

    if (!room)
      return reply.code(404).send({ error: "conversation  not found" });

    // try {
      const members = room.members.split(',').map(n => Number(n));
    // } catch {
    //   return reply.code(500).send({ error: "invalid room members format" });
    // }

    if (!members.includes(userId))
      return reply.code(403).send({ error: "you are not a member of this conversation" });

    request.server.db
      .prepare("DELETE FROM message WHERE conv_id = ?")
      .run(conv_id);
    request.server.db
      .prepare("DELETE FROM room WHERE conversation_id = ?")
      .run(conv_id);

    request.server.db.prepare(`
      DELETE FROM friends 
      WHERE (user_id = ? AND friend_id = ?) 
         OR (user_id = ? AND friend_id = ?)
    `).run(userId, friend_id, friend_id, userId);

    const socket = request.server.users_socket.get(friend_id.toString());
    if (socket) {
      socket.send(JSON.stringify({
        type: "unfriend",
        data: {
          id_user: userId,
          username: request.user.username
        }
      }));
    }

    reply.code(200).send(true);

  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Failed to unfriend" });
  }
}





export async function pinned(request, reply) {
  const result = PinnedSchema.safeParse(request.query);
  if (!result.success)
    return reply.code(400).send("missing params");

  const { id, pinned } = result.data;


  try {
    const room = request.server.db
      .prepare("SELECT * FROM room WHERE conversation_id = ?")
      .get(id);

    if (!room)
      return reply.code(404).send("conversation not found");

    const userId = request.user.id_user;
    const [member1, member2] = room.members.split(",").map(Number);

    let userField = null;
    let dateField = null;

    if (userId === member1) {
      userField = "pinnedUser1";
      dateField = "pinnedDateUser1";
    } else if (userId === member2) {
      userField = "pinnedUser2";
      dateField = "pinnedDateUser2";
    } else {
      return reply.code(403).send("not allowed");
    }

    let sql;
    if (pinned == "pinned") {
      sql = request.server.db.prepare(
        `UPDATE room 
         SET ${userField} = ?, ${dateField} = CURRENT_TIMESTAMP 
         WHERE conversation_id = ?`
      );
      sql.run(userId, id);
    }
    else if (pinned == "unpinned"){

      sql = request.server.db.prepare(
        `UPDATE room 
        SET ${userField} = -1, ${dateField} = NULL 
        WHERE conversation_id = ?`
      );
      sql.run(id);
    }
    else
      return reply.code(403).send(false);
    
    return reply.code(200).send(true);

  } catch (err) {
    console.error(err);
    return reply.code(500).send(false);
  }
}


export async function changeusersettings(request , reply){
  const result = usersettings.safeParse(request.body);
  if (!result.success)
    return reply.code(400).send("Invalid payload");

    const { settingAttribute, newValue } = result.data;

    const allowedSettings = [
      "sound_notification",
      "typing_indicator",
      "read_receipts",
      "status_share",
    ];


  if (!allowedSettings.includes(settingAttribute)) {
    return reply.code(400).send("Invalid setting attribute" );
  }

    try {
      const stmt = request.server.db.prepare(
        `UPDATE users SET ${settingAttribute} = ? WHERE id_user = ?`
      );

      stmt.run(newValue ? 1 : 0, request.user.id_user);

      return reply.send(true);
    } catch (err) {
      return reply.code(500).send(false);
    }
}