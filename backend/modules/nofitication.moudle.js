import jwt from 'jsonwebtoken';
import {ParseIdSchema} from './moduleSchema.js'
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

  const result = ParseIdSchema.safeParse(request.query);
  if (!result.success)
    return reply.code(400).send("missing params");

  const {id} = result.data;

  const firstQuery = request.server.db.prepare("select getter_user, sender_user from notification where notify_id = ?");
  const response = firstQuery.get(id);


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
    const result =  query.run(id , request.user.id_user );
    if (result.changes === 0){
      return reply.code(404).send("notification not found or not authorized");
    }

    return reply.code(200).send("Friend request deleted successfully");

  }catch(err){
    reply.code(500);
  }
}



export async function cancelFriendRequest(request , reply){
  const result = ParseIdSchema.safeParse(request.query);
  if (!result.success)
    return reply.code(400).send("missing params");

  const {id} = result.data;

  const firstQuery = request.server.db.prepare("select getter_user, sender_user from notification where notify_id = ?");
  const response = firstQuery.get(id);
  
  const socket = request.server.users_socket.get(response.getter_user.toString());


  if (socket)
  {
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
    const result =  query.run(id , request.user.id_user );
    if (result.changes === 0){
      return reply.code(404).send("notification not found");
    }

    return reply.code(200).send("Friend request deleted successfully");

  }catch(err){
    reply.code(500);
  }
}


export async function sendRequestFriend(request, reply) {
  const result = ParseIdSchema.safeParse(request.body);

  if (!result.success)
    return reply.code(400).send("missing params");

  const { id } = result.data;
  const socket = request.server.users_socket.get(id.toString());

  try {
    const title = "request friend";
    const existsNotify = request.server.db.prepare(`SELECT 1 FROM notification  WHERE getter_user = ? AND title = ? AND sender_user = ? AND notifyBody = ? LIMIT 1`);
    const exists = existsNotify.get(id, title, request.user.id_user, "request friend");

  if (exists)
    return reply.code(200).send(true);
  
    const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody) VALUES (?, ?, ?, ?)`);
    const result = insertQuery.run(id, title, request.user.id_user, "request friend");
    const insertedId = result.lastInsertRowid;

    
    if (socket) {
      
      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(request.user.id_user);
      
      const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ?");
      const res = query2.get(id, request.user.id_user);
      
      const object = {
        getter_user: id,
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
  const result = ParseIdSchema.safeParse(request.body);

  if (!result.success)
    return reply.code(400).send("missing params");

  const { id } = result.data;
  const socket = request.server.users_socket.get(id.toString());

  try{
      const Fquery = request.server.db.prepare("INSERT INTO friends (user_id , friend_id) VALUES (?,?)");
      Fquery.run(request.user.id_user , id);

      const conversationquery = request.server.db.prepare("INSERT INTO room (members) VALUES (?)");
      const members = [request.user.id_user, id].join(',');
      const ret = conversationquery.run(members);


      const title = "friend request accepted";
      const setQuery = request.server.db.prepare("INSERT INTO notification (getter_user, title, sender_user, notifyBody ) VALUES (?, ?, ?, ?)")
      const result = setQuery.run(id, title, request.user.id_user, "friend request accepted");

      const deleteQuery = request.server.db.prepare("Delete from notification where getter_user = ? AND sender_user = ? AND title = ?");
      const deleteResult = deleteQuery.run(request.user.id_user, id, "request friend");

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
      reply.code(200).send(ret);
    }catch(err){
      console.log(err);
      reply.code(500);
    }
}



export async function GetFriends(request, reply) {
  try {
    const db = request.server.db;


    const getFriendsStmt1 = db.prepare(`SELECT user_id FROM friends WHERE friend_id = ?`);
    const getFriendsStmt2 = db.prepare(`SELECT friend_id FROM friends WHERE user_id = ?`);

    const friends1 = getFriendsStmt1.all(request.user.id_user).map(row => row.user_id);
    const friends2 = getFriendsStmt2.all(request.user.id_user).map(row => row.friend_id);

    const allFriendIds = [...new Set([...friends1, ...friends2])];

    if (allFriendIds.length === 0) return reply.send([]);


    const placeholders = allFriendIds.map(() => '?').join(', ');
    const getFriendDetailsStmt = db.prepare(`
      SELECT id_user, username, fullname, profile_img, xp, status, bio , lastSeen
      FROM users
      WHERE id_user IN (${placeholders})
    `);

    const friendDetails = getFriendDetailsStmt.all(...allFriendIds);

    const conversationStmt = db.prepare(`
      SELECT conversation_id, lastMessage, lastMessageSender, lastMessageTime , pinnedUser1,pinnedUser2,blockedByUser1 , blockedByUser2 ,pinnedDateUser1, pinnedDateUser2
      FROM room
      WHERE members = ? OR members = ?
      LIMIT 1
    `);


    const result = friendDetails.map(friend => {
      const members1 = `${request.user.id_user},${friend.id_user}`;
      const members2 = `${friend.id_user},${request.user.id_user}`;

      const conv = conversationStmt.get(members1, members2);

      return {
        ...friend,
        conversation_id: conv?.conversation_id ?? null,
        lastMessage: conv?.lastMessage ?? null,
        lastMessageSender: conv?.lastMessageSender ?? null,
        lastMessageTime: conv?.lastMessageTime ?? null,
        blockedByUser1: conv?.blockedByUser1 ?? -1,
        blockedByUser2: conv?.blockedByUser2 ?? -1,
        pinnedDateUser1: conv?.pinnedDateUser1 ?? null,
        pinnedDateUser2: conv?.pinnedDateUser2 ?? null,
        pinnedUser1: conv?.pinnedUser1 ?? -1,
        pinnedUser2: conv?.pinnedUser2 ?? -1
      };
    });

    return reply.send(result);

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
    reply.code(500).send("internal server error");
  }
}




export  function sendGameChallenge(request , reply){
  const result = ParseIdSchema.safeParse(request.body);
  if (!result.success)
    reply.code(400).send("missing params");
  const {id} = result.data;
  
  try{
    const title = "game challenge";
    const query = request.server.db.prepare('SELECT profile_img FROM users where id_user = ?');
    const result = query.get(request.user.id_user);
    
    const ExpiredTime =  ft_getTime();
    const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody , expired) VALUES (?, ?, ?, ? , ?)`);
    
    insertQuery.run(id, title, request.user.id_user, "game challenge" , ExpiredTime);
    
    
    const socket = request.server.users_socket.get(id.toString());
    
    
    if (socket){
      
      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(request.user.id_user);
      
      
      const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ?");
      const res = query2.get(id, request.user.id_user);


      const object  = {
        username: request.user.username,
        img: result.profile_img,
        id: request.user.id_user
      };
      socket.send(JSON.stringify({
          type: "game_invite",
          data: object
      }));

      const object_notify = {
        getter_user: id,
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
  const result = ParseIdSchema.safeParse(request.body);
  if (!result.success)
    return reply.code(400).send("missing params");

  const {id} = request.body;

  try{

    const socket = request.server.users_socket.get(id.toString());
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



export function DeleteNotification(request , reply){

  const notifyId = request.query.notifyId;
  try{
    reply.code(200).send(true);
  }catch(err){
    reply.code(500).send(false);
  }
}