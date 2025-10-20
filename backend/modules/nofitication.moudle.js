import fastify from "fastify";
const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';
import jwt from 'jsonwebtoken';


export async function GetNotification(request, reply) {
  const username = request.query.user;

  if (!username) {
    return reply.code(400).send({ error: "missing username" });
  }

  try {
    const query = request.server.db.prepare(`
      SELECT 
        n.*,
        u.profile_img AS sender_profile_img
      FROM notification n
      JOIN users u ON n.sender_user = u.username
      WHERE n.getter_user = ?
    `);

    const notifications = query.all(username);
    return reply.send(notifications);

  } catch (err) {
    console.error("GetNotification error:", err);
    reply.code(500).send({ error: "internal server error" });
  }
}

export async function DeleteFriendRequest(request , reply){

  const notify_id = request.query.id;

  try{
      const query = request.server.db.prepare('DELETE FROM notification WHERE notify_id = ?');
      query.run(notify_id);
      reply.code(200);
  }catch(err){
    console.log(err);
  }
}


export async function sendRequestFriend(request, reply) {
  const { sender, friend, title } = request.body;

  if (!title || !sender || !friend) {
    return reply.code(400).send({ error: 'Title, sender, and friend are required fields.' });
  }
  

  const socket = request.server.users_socket.get(friend);



  try {
    const existsNotify = request.server.db.prepare(`SELECT 1 FROM notification  WHERE getter_user = ? AND title = ? AND sender_user = ? AND notifyBody = ? LIMIT 1`);
    const exists = existsNotify.get(friend, title, sender, "test");

  if (exists)
    return reply.code(200);
  const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody) VALUES (?, ?, ?, ?)`);
  insertQuery.run(friend, title, sender, "test");

    if (socket) {


      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE username = ?");
      const result = query1.get(sender);

      const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ?");
      const res = query2.get(friend, sender);

      const object = {
        getter_user: friend,
        sender_user: sender,
        title: title,
        sender_profile_img: result.profile_img,
        notify_id: res.notify_id
      };
      socket.send(JSON.stringify({
        type: "notify",
        data: object
      }));
    }

    return reply.code(200);

  } catch (err) {
    console.log(err);
    reply.code(500).send({ error: "Internal server error" });
  }
}



export async function AddFriend( request  , reply){

  const {user1 , user2 } = request.body;


    const authHeader = request.headers['authorization'];
  
    if (!user1 || !user2 || !authHeader)
      return reply.code(403),send("");

    const token = authHeader.split(' ')[1];


        const decodedObject = jwt.verify(token, SECRET);


    if (!decodedObject || user2 !== decodedObject.username){
      return reply.code(403).send("");
    }


  try{
      const query = request.server.db.prepare("SELECT id_user FROM users WHERE username = ?");
      const user = query.get(user1);
      const user1Id = user.id_user;


      const Fquery = request.server.db.prepare("INSERT INTO friends (user_id , friend_id) VALUES (?,?)");
      Fquery.run(decodedObject.id_user , user1Id);

      const conversationquery = request.server.db.prepare("INSERT INTO room (members) VALUES (?)");
      const members = [decodedObject.id_user, user1Id].join(',');
      conversationquery.run(members);

      reply.code(200).send("");
    }catch(err){
      
      reply.code(500);
  }
}


export async function GetFriends(request, reply) {
  const username = request.query.username;

  if (!username) {
    return reply.code(400).send({ error: "Username is required" });
  }




  try {
    const getUserIdStmt = request.server.db.prepare(`SELECT id_user FROM users WHERE username = ?`);
    const user = getUserIdStmt.get(username);

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    const userId = user.id_user;

    const getFriendsStmt1 = request.server.db.prepare(`SELECT user_id FROM friends WHERE friend_id = ?`);
    const getFriendsStmt2 = request.server.db.prepare(`SELECT friend_id FROM friends WHERE user_id = ?`);

    const friends1 = getFriendsStmt1.all(userId).map(row => row.user_id);
    const friends2 = getFriendsStmt2.all(userId).map(row => row.friend_id);

    const allFriendIds = [...new Set([...friends1, ...friends2])];

    if (allFriendIds.length === 0) {
      return reply.send([]);
    }

    const placeholders = allFriendIds.map(() => '?').join(', ');
    const getFriendDetailsStmt = request.server.db.prepare(`
      SELECT id_user, username, email, fullname, profile_img, xp, access_token, status 
      FROM users
      WHERE id_user IN (${placeholders})
    `);

    const friendDetails = getFriendDetailsStmt.all(...allFriendIds);

    const getLastMessageStmt = request.server.db.prepare(`
      SELECT message, created_at
      FROM message
      WHERE conv_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);

    for (const friend of friendDetails) {
      const getConvIdStmt = request.server.db.prepare(`
        SELECT conversation_id
        FROM room
        WHERE (members LIKE ? OR members LIKE ?)
        LIMIT 1
      `);

      const case1 = `%${username},${friend.username}%`;
      const case2 = `%${friend.username},${username}%`;

      const convIdRow = getConvIdStmt.get(case1, case2);

      if (convIdRow) {
        const lastMessage = getLastMessageStmt.get(convIdRow.conversation_id);
        friend.LastMessage = lastMessage ? lastMessage.message : "Say Hello";
        friend.LastMessageTime = lastMessage ? lastMessage.created_at : "0000-01-01 00:00:00"
      }
    }

    return reply.send(friendDetails);

  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}


