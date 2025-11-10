const SECRET = '6fc9ce2928ed0bf049825c8b15086ec8b8f6bf990674452eecd462dba06243a467d974a9230cbb26d03314ea2fa6441eb387fb9442a32b7b3fd6ba69c00652bd';
import jwt from 'jsonwebtoken';


export async function GetNotification(request, reply) {

  const authHeader = request.headers['authorization'];

  if (!authHeader)
    reply.code(401).send("missing token");
  
  const token = authHeader.split(' ')[1];
  let decodedObject;

  try{
    decodedObject = jwt.verify(token, SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }
  

  try {
    const query = request.server.db.prepare(` SELECT n.*, u.username AS sender_username, u.profile_img AS sender_profile_img FROM notification n JOIN users u ON n.sender_user = u.id_user WHERE n.getter_user = ?`);
    const notifications = query.all(decodedObject.id_user);

    return reply.send(notifications);

  } catch (err) {
    reply.code(500).send("internal server error");
  }
}


export async function DeleteFriendRequest(request , reply){


  const notify_id = request.query.id;
  const authHeader = request.headers['authorization'];

  if (!authHeader || !notify_id)
    reply.code(400).send("Missing params");
  
  const token = authHeader.split(' ')[1];

  let decodedObject;
  try{
    decodedObject = jwt.verify(token, SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }

  try{
    const query = request.server.db.prepare('DELETE FROM notification WHERE notify_id = ? AND getter_user = ?');
    const result =  query.run(notify_id , decodedObject.id_user );
    if (result.changes === 0){
      return reply.code(404).send("notification not found or not authorized");
    }

    return reply.code(200).send("Friend request deleted successfully");

  }catch(err){
    reply.code(500);
  }
}


export async function sendRequestFriend(request, reply) {

  const { friend_id} = request.body;




  const authHeader = request.headers['authorization'];
  

  if ( !friend_id || !authHeader) {
    return reply.code(400).send("missing params");
  }


  const token = authHeader.split(' ')[1];
  let decodedObject;
  
  
  
  try{
    decodedObject = jwt.verify(token, SECRET);
  }catch(err){
    return reply.code(401).send("invalid token ");
  }
  
  const socket = request.server.users_socket.get(friend_id.toString());

  try {
    const title = "request friend";
    const existsNotify = request.server.db.prepare(`SELECT 1 FROM notification  WHERE getter_user = ? AND title = ? AND sender_user = ? AND notifyBody = ? LIMIT 1`);
    const exists = existsNotify.get(friend_id, title, decodedObject.id_user, "request friend");

  if (exists)
    return reply.code(200).send(true);
  
    const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody) VALUES (?, ?, ?, ?)`);
    insertQuery.run(friend_id, title, decodedObject.id_user, "request friend");

    
    if (socket) {
      
      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(decodedObject.id_user);
      
      const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ?");
      const res = query2.get(friend_id, decodedObject.id_user);
      
      const object = {
        getter_user: friend_id,
        sender_user: decodedObject.id_user,
        sender_username: decodedObject.username,
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
  
  const { Freind_id } = request.body;
  
  const authHeader = request.headers['authorization'];
  
  if ( !authHeader || !Freind_id)
    return reply.code(400),send(false);
  
  const token = authHeader.split(' ')[1];
  let decodedObject;
  
  
  try{
    decodedObject = jwt.verify(token, SECRET);
  }catch(err){
    return reply.code(401).send("invalid token ");
  }
  
  const socket = request.server.users_socket.get(Freind_id.toString());


  try{
      const Fquery = request.server.db.prepare("INSERT INTO friends (user_id , friend_id) VALUES (?,?)");
      Fquery.run(decodedObject.id_user , Freind_id);

      const conversationquery = request.server.db.prepare("INSERT INTO room (members) VALUES (?)");
      const members = [decodedObject.id_user, Freind_id].join(',');
      conversationquery.run(members);


      if (socket){
        const query = request.server.db.prepare("SELECT * FROM USERS WHERE id_user = ? ");
        const res = query.get(decodedObject.id_user);
        const object = {
          profile_img: res.profile_img,
          username: res.username,
          fullname:"say hello",
          id_user: res.id_user,
          status:1
        };
        socket.send(JSON.stringify({
            type: "test",
            data: object
        }));
      }

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





export function sendGameChallenge(request , reply){

  const authHeader = request.headers['authorization'];
  const {Friend_id} = request.body;
  if (!authHeader || !Friend_id)    // must be check if is not a freind;
    reply.code(401).send("missing token");
  
  const token = authHeader.split(' ')[1];
  let decodedObject;

  try{
    decodedObject = jwt.verify(token, SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }



  try{
    const query = request.server.db.prepare('SELECT profile_img FROM users where id_user = ?');
    const result = query.get(decodedObject.id_user);



    const socket = request.server.users_socket.get(Friend_id.toString());
    if (socket){
      const object  = {
        username: decodedObject.username,
        img: result.profile_img
      };
      socket.send(JSON.stringify({
          type: "game_invite",
          data: object
      }));
    }
  }catch(err){
    console.log(err);
    return reply.code(500).send(false);
  }

  return reply.send(true);
}