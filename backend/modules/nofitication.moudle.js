import jwt from 'jsonwebtoken';

  function ft_getTime() {
  const now = new Date();
  
  const pad = (n) => n.toString().padStart(2, '0');

  const year = now.getFullYear().toString().slice(-2);
  const month = pad(now.getMonth() + 1); 
  const day = pad(now.getDate()); 
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



export async function GetNotification(request, reply) {
  try {
    const query = request.server.db.prepare(` SELECT n.*, u.username AS sender_username, u.profile_img AS sender_profile_img FROM notification n JOIN users u ON n.sender_user = u.id_user WHERE n.getter_user = ?`);
    const notifications = query.all(request.user.id_user);

    return reply.send(notifications);

  } catch (err) {
    reply.code(500).send("internal server error");
  }
}


export async function DeleteFriendRequest(request , reply){


  const notify_id = request.query.id;


  if ( !notify_id)
    reply.code(400).send("Missing params");
  


  const firstQuery = request.server.db.prepare("select getter_user, sender_user from notification where notify_id = ?");
  const response = firstQuery.get(notify_id);


  const socket = request.server.users_socket.get(response.sender_user.toString());

  if (socket)
  {
   const object = {
    getter_user : response.getter_user,
    sender_user : response.sender_user
   }
    socket.send(JSON.stringify({
        type: "rejected",
        data: object
      }));

  }

  try{
    const query = request.server.db.prepare('DELETE FROM notification WHERE notify_id = ? AND getter_user = ?');
    const result =  query.run(notify_id , request.user.id_user );
    if (result.changes === 0){
      return reply.code(404).send("notification not found or not authorized");
    }

    return reply.code(200).send("Friend request deleted successfully");

  }catch(err){
    reply.code(500);
  }
}

export async function cancelFriendRequest(request , reply){


  const notify_id = request.query.id;
  const authHeader = request.headers['authorization'];

  if (!authHeader || !notify_id)
    reply.code(400).send("Missing params");
  
  const token = authHeader.split(' ')[1];

  let decodedObject;
  try{
    decodedObject = jwt.verify(token, process.env.SECRET);
  }
  catch(err){
    return reply.code(401).send("Invalid token");
  }


  const firstQuery = request.server.db.prepare("select getter_user, sender_user from notification where notify_id = ?");
  const response = firstQuery.get(notify_id);


  const socket = request.server.users_socket.get(response.getter_user.toString());
    console.log("Here is response : ",response);

  if (socket)
  {
    console.log("socket is alive");
   const object = {
    getter_user : response.getter_user,
    sender_user : response.sender_user
   }
    socket.send(JSON.stringify({
        type: "canceled request",
        data: object
      }));

  }

  try{
    const query = request.server.db.prepare('DELETE FROM notification WHERE notify_id = ? AND sender_user = ?');
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

  if ( !friend_id) {
    return reply.code(400).send("missing params");
  }

  const socket = request.server.users_socket.get(friend_id.toString());

  try {
    const title = "request friend";
    const existsNotify = request.server.db.prepare(`SELECT 1 FROM notification  WHERE getter_user = ? AND title = ? AND sender_user = ? AND notifyBody = ? LIMIT 1`);
    const exists = existsNotify.get(friend_id, title, request.user.id_user, "request friend");

  if (exists)
    return reply.code(200).send(true);
  
    const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody) VALUES (?, ?, ?, ?)`);
    const result = insertQuery.run(friend_id, title, request.user.id_user, "request friend");
    const insertedId = result.lastInsertRowid;

    
    if (socket) {
      
      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(request.user.id_user);
      
      const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ?");
      const res = query2.get(friend_id, request.user.id_user);
      
      const object = {
        getter_user: friend_id,
        sender_user: request.user.id_user,
        sender_username: request.user.username,
        title: title,
        sender_profile_img: result.profile_img,
        notify_id: res.notify_id
      };
      socket.send(JSON.stringify({
        type: "notify",
        data: object
      }));
    }

    return reply.code(200).send(insertedId);

  } catch (err) {
    reply.code(500).send({ error: "Internal server error" });
  }
}



export async function AddFriend( request  , reply){
  
  const { Freind_id } = request.body;
  
  
  if (!Freind_id)
    return reply.code(400),send(false);
  
  const socket = request.server.users_socket.get(Freind_id.toString());

  try{

      const Fquery = request.server.db.prepare("INSERT INTO friends (user_id , friend_id) VALUES (?,?)");
      Fquery.run(request.user.id_user , Freind_id);

      const conversationquery = request.server.db.prepare("INSERT INTO room (members) VALUES (?)");
      const members = [request.user.id_user, Freind_id].join(',');
      conversationquery.run(members);


      if (socket){
        const query = request.server.db.prepare("SELECT * FROM USERS WHERE id_user = ? ");
        const res = query.get(request.user.id_user);
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


        const title = "friend request accepted";
        const setQuery = request.server.db.prepare("INSERT INTO notification (getter_user, title, sender_user, notifyBody ) VALUES (?, ?, ?, ?)")
        const result = setQuery.run(Freind_id, title, request.user.id_user, "friend request accepted");

        const deleteQuery = request.server.db.prepare("Delete from notification where getter_user = ? AND sender_user = ? AND title = ?");
        const deleteResult = deleteQuery.run(request.user.id_user, Freind_id, "request friend");

        const notifyObject = {
          sender_profile_img: res.profile_img,
          sender_username: res.username,
          title: title,
          sender_user: request.user.id_user,
          notify_id: result.lastInsertRowid
        };
        socket.send(JSON.stringify({
            type: "notify",
            data: notifyObject
        }));
      }

      reply.code(200).send("");
    }catch(err){
      console.log(err);
      reply.code(500);
  }
}


export async function GetFriends(request, reply) {

  const username = request.query.username;
  if (!username) {
    return reply.code(400).send("Missing params");
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






export function NotificationSeen(request , reply){

  try{
    const query = request.server.db.prepare("UPDATE notification SET is_seen = ? WHERE getter_user = ?");
    query.run(1 , request.user.id_user);

    reply.code(200).send(true);
  }catch(err){

  }
}




// export function SendTyping (request , reply){
  
//   const authHeader = request.headers['authorization'];
//   const {Friend_id} = request.body;

//   console.log("============================================>1212121212121XDDDDDDDDDDDDDDDDD ");

//   if (!authHeader || !Friend_id)
//     reply.code(401).send("missing token");
  
//   const token = authHeader.split(' ')[1];
//   let decodedObject;

//   try{
//     decodedObject = jwt.verify(token, process.env.SECRET);
//   }
//   catch(err){
//     return reply.code(401).send("Invalid token");
//   }

//   try
//   {
//     const socket = request.server.users_socket.get(Friend_id.toString());
//     if (socket){
//       const object = {
//       };
//       socket.send(JSON.stringify({
//         type: "is_typing",
//         data: object
//       }));
//     }

//   reply.code(200).send(true);
//   }catch(err){

//   }

// }








export  function sendGameChallenge(request , reply){

  const {Friend_id} = request.body;
  if ( !Friend_id)
    reply.code(401).send("missing token");



  
  try{
    const title = "game challenge";
    const query = request.server.db.prepare('SELECT profile_img FROM users where id_user = ?');
    const result = query.get(request.user.id_user);
    
    const ExpiredTime =  ft_getTime();
    const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody , expired) VALUES (?, ?, ?, ? , ?)`);
    
    insertQuery.run(Friend_id, title, request.user.id_user, "game challenge" , ExpiredTime);
    
    
    const socket = request.server.users_socket.get(Friend_id.toString());
    
    
    if (socket){
      
      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(request.user.id_user);
      
      
      const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ?");
      const res = query2.get(Friend_id, request.user.id_user);


      const object  = {
        username: request.user.username,
        img: result.profile_img,    // problem in default and custumazze images
        id: request.user.id_user
      };
      socket.send(JSON.stringify({
          type: "game_invite",
          data: object
      }));

      const object_notify = {
        getter_user: Friend_id,
        sender_user: request.user.id_user,
        sender_username: request.user.username,
        title: title,
        sender_profile_img: result.profile_img,
        notify_id: res.notify_id,
        expired: ExpiredTime
      };

      socket.send(JSON.stringify({
        type: "notify",
        data: object_notify
      }));

    }
  }catch(err){
    return reply.code(500).send(false);
  }

  return reply.send(true);
}

export function AcceptGameChallenge(request , reply){

  const {Friend_id} = request.body;

  if (!Friend_id)
    reply.code(401).send("missing token");

  try{

    const socket = request.server.users_socket.get(Friend_id.toString());
    if (socket){
      const object  = {
      };
      
      socket.send(JSON.stringify({
        type: "start_game",
        data: object
      }));
    }
    return reply.send(true);
  }catch(err){
    return reply.code(500).send(false);
  }

}

export function GetSentRequests(request , reply){


  try{
      const query = request.server.db.prepare(`select * from notification where sender_user =?`);
      const result = query.all(request.user.id_user);
      return reply.send(result);
  }catch(err){
    console.log(err);
    return reply.code(500).send(false);
  }
}