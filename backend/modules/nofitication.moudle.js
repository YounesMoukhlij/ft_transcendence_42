import jwt from 'jsonwebtoken';
import {ParseIdSchema} from './moduleSchema.js'
import { title } from 'process';
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

// Expiration time helper (keeps YY-MM-DD format for frontend compatibility)
function ft_getExpiredTime(minutesFromNow = 1.5) {
  const now = new Date();
  const expired = new Date(now.getTime() + minutesFromNow * 60 * 1000);

  const pad = (n) => n.toString().padStart(2, '0');

  const year = expired.getFullYear().toString().slice(-2);
  const month = pad(expired.getMonth() + 1);
  const day = pad(expired.getDate());
  const hours = pad(expired.getHours());
  const minutes = pad(expired.getMinutes());
  const seconds = pad(expired.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



export async function GetNotification(request, reply) {
  try {
    const query = request.server.db.prepare(` SELECT n.*, u.username AS sender_username, u.profile_img AS sender_profile_img FROM notification n JOIN users u ON n.sender_user = u.id_user WHERE n.getter_user = ?`);
    const notifications = query.all(request.user.id_user);

    // Filter out expired notifications (supports YY-MM-DD and YYYY-MM-DD)
    const now = new Date();
    const validNotifications = notifications.filter((notif) => {
      if (!notif.expired) return true;
      try {
        let expiredStr = notif.expired;
        if (expiredStr && expiredStr.match(/^\d{2}-\d{2}-\d{2}/)) {
          const parts = expiredStr.split(' ');
          const datePart = parts[0].split('-');
          if (datePart[0].length === 2) {
            datePart[0] = '20' + datePart[0];
            expiredStr = datePart.join('-') + ' ' + (parts[1] || '00:00:00');
          }
        }
        const expiredDate = new Date(expiredStr.replace(' ', 'T') + 'Z');
        return expiredDate > now;
      } catch {
        return true;
      }
    });

    // Extract tournamentId for tournament invites (if notifyBody is JSON)
    const processed = validNotifications.map((notif) => {
      if (notif.title === 'tournament invite' && notif.notifyBody) {
        try {
          const parsed = JSON.parse(notif.notifyBody);
          if (parsed?.tournamentId) {
            return {
              ...notif,
              tournamentId: parsed.tournamentId,
              notifyBody: parsed.message || notif.notifyBody
            };
          }
        } catch {
          // ignore
        }
      }
      return notif;
    });

    return reply.send(processed);

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
      sender_user : response.sender_user,
      notify_id: id
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

  const { id: targetId } = result.data;
  const userId = request.user.id_user;
  const db = request.server.db;

  if (targetId === userId)
    return reply.code(400).send(false);

  try {
    const userExists = db.prepare("SELECT id_user FROM users WHERE id_user = ?").get(targetId);

    if (!userExists)
      return reply.code(404).send({ error: "user not found" });

    const alreadyFriends = db.prepare(`SELECT 1 FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    `).get(userId, targetId, targetId, userId);

    if (alreadyFriends)
      return reply.code(409).send({ error: "already friends" });

    const existsNotify = db.prepare(` SELECT notify_id FROM notification WHERE title = ? AND ( (getter_user = ? AND sender_user = ?) OR (getter_user = ? AND sender_user = ?))LIMIT 1`).get(
      "request friend",
      targetId, userId, 
      userId, targetId
    );
  if (existsNotify)
    return reply.code(409).send({ error: "Friend request already exists" });


    const insert = db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody)VALUES (?, ?, ?, ?)`).run(targetId, "request friend", userId, "request friend");

    const notifyId = insert.lastInsertRowid;

    const socket = request.server.users_socket.get(targetId.toString());
    if (socket) {
      const sender = db.prepare(`
        SELECT username, profile_img
        FROM users WHERE id_user = ?
      `).get(userId);

      socket.send(JSON.stringify({
        type: "notify",
        data: {
          notify_id: notifyId,
          getter_user: targetId,
          sender_user: userId,
          sender_username: sender.username,
          sender_profile_img: sender.profile_img,
          title: "request friend"
        }
      }));
    }

    reply.code(200).send(notifyId);

  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Internal server error" });
  }
}








export async function AddFriend(request, reply) {
  const result = ParseIdSchema.safeParse(request.body);
  if (!result.success)
    return reply.code(400).send("missing params");

  const { id: friendId } = result.data;
  const userId = request.user.id_user;
  const db = request.server.db;

  if (friendId === userId)
    return reply.code(400).send({ error: "you cannot add yourself" });

  try {

    const targetUser = db.prepare("SELECT id_user FROM users WHERE id_user = ?").get(friendId);

    if (!targetUser)
      return reply.code(404).send({ error: "user not found" });

    const alreadyFriends = db.prepare(`SELECT 1 FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`).get(userId, friendId, friendId, userId);

    if (alreadyFriends)
      return reply.code(409).send({ error: "already friends" });

    const notify = db.prepare(`SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ? AND title = ?`).get(
    request.user.id_user, 
    friendId,      
    "request friend"
  );

  if (!notify)
    return reply.code(403).send({ error: "Friend request not found" });
  const notifyId = notify.notify_id;
    
    const transaction = db.transaction(() => {
      db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)").run(userId, friendId);

      db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)").run(friendId, userId);

      const members = [userId, friendId].join(',');
      const room = db.prepare("INSERT INTO room (members) VALUES (?)").run(members);

      db.prepare("DELETE FROM notification WHERE notify_id = ?").run(notifyId);
      const notify = db.prepare(`INSERT INTO notification (getter_user, sender_user, title ,notifyBody) VALUES (?, ?, ?, ?)
      `).run(
        friendId,
        userId,
        "friend request accepted",
        "friend request accepted",
      );

      return {
        room_id: room.lastInsertRowid,
        notify_id: notify.lastInsertRowid
      };
    });

    const resultTx = transaction();

    const socket = request.server.users_socket.get(friendId.toString());
    if (socket) {
      const me = db.prepare(`SELECT id_user, username, profile_img, fullname FROM users WHERE id_user = ?`).get(userId);

      socket.send(JSON.stringify({
        type: "notify",
        data: {
          title:"friend request accepted",
          id_user: me.id_user,
          sender_user: request.user.id_user,
          username: me.username,
          fullname: me.fullname,
          profile_img: me.profile_img,
          room_id: resultTx.room_id
        }
      }));
    }

    reply.code(200).send(resultTx);

  } catch (err) {
    console.error(err);

    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return reply.code(409).send({ error: "friendship already exists" });
    }

    reply.code(500).send({ error: "Failed to add friend" });
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

    // Update status based on real-time socket connections (more accurate than DB)
    const usersSocket = request.server.users_socket;
    for (const friend of friendDetails) {
      const friendSocket = usersSocket.get(friend.id_user.toString());
      friend.status = friendSocket && friendSocket.readyState === 1 ? 1 : 0;
    }

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
  // Support both {Friend_id} (game mate) and {id} (older)
  const id = request.body?.Friend_id ?? request.body?.id;
  if (!id) return reply.code(400).send("missing params");

  try{
    const senderId = request.user.id_user;

    // Check if target user exists
    const targetUser = request.server.db.prepare("SELECT id_user FROM users WHERE id_user = ?").get(id);
    if (!targetUser) {
      return reply.code(404).send({ error: "User not found" });
    }

    // Check if target user is in friend list
    const areFriends = request.server.db.prepare(`
      SELECT 1 FROM friends
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    `).get(senderId, id, id, senderId);

    if (!areFriends) {
      return reply.code(403).send({ error: "Can only send game challenges to friends" });
    }

    // Check if there's already an active game challenge between these users
    const existingChallenge = request.server.db.prepare(`
      SELECT notify_id FROM notification
      WHERE title = 'game challenge'
      AND ((getter_user = ? AND sender_user = ?) OR (getter_user = ? AND sender_user = ?))
      AND expired > ?
    `).get(id, senderId, senderId, id, ft_getTime());

    if (existingChallenge) {
      return reply.code(409).send({ error: "Game challenge already exists between these users" });
    }

    const title = "game challenge";
    const query = request.server.db.prepare('SELECT profile_img FROM users where id_user = ?');
    const result = query.get(senderId);

    // 1.5 minutes in the future (YY-MM-DD format)
    const ExpiredTime = ft_getExpiredTime(1.5);
    const insertQuery = request.server.db.prepare(` INSERT INTO notification (getter_user, title, sender_user, notifyBody , expired) VALUES (?, ?, ?, ? , ?)`);

    const insertResult = insertQuery.run(id, title, senderId, "game challenge" , ExpiredTime);
    const notify_id = insertResult.lastInsertRowid;
    
    
    const socket = request.server.users_socket.get(id.toString());
    
    
    if (socket){
      
      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(senderId);


      const object  = {
        username: request.user.username,
        img: result.profile_img,
        id: senderId
      };
      socket.send(JSON.stringify({
          type: "game_invite",
          data: object
      }));

      const object_notify = {
        getter_user: id,
        sender_user: senderId,
        sender_username: request.user.username,
        title: title,
        sender_profile_img: result.profile_img,
        notify_id: notify_id,
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
  // Support both {Friend_id} and {id}
  const inviterId = request.body?.Friend_id ?? request.body?.id;
  if (!inviterId) return reply.code(400).send("missing params");

  try {
    const acceptorId = request.user.id_user;

    // Prevent sender from accepting their own challenge
    if (parseInt(inviterId) === acceptorId) {
      return reply.code(403).send({ error: 'Cannot accept your own game challenge' });
    }

    // Check if there's a valid game challenge notification
    const notification = request.server.db.prepare(`
      SELECT notify_id, expired FROM notification
      WHERE title = 'game challenge'
      AND getter_user = ?
      AND sender_user = ?
      AND expired > ?
    `).get(acceptorId, inviterId, ft_getTime());

    if (!notification) {
      return reply.code(404).send({ error: 'No valid game challenge found or challenge has expired' });
    }

    const inviterSocket = request.server.users_socket.get(inviterId.toString());
    const acceptorSocket = request.server.users_socket.get(acceptorId.toString());

    const getUserStmt = request.server.db.prepare('SELECT username, id_user FROM users WHERE id_user = ?');
    const acceptor = getUserStmt.get(acceptorId);

    if (!acceptor) {
      return reply.code(404).send({ error: 'User not found' });
    }

    // Delete the notification after accepting
    request.server.db.prepare('DELETE FROM notification WHERE notify_id = ?').run(notification.notify_id);

    // Create challengeId and store it for game matchmaking
    const challengeId = `${inviterId}_${acceptorId}`;
    if (request.server.gameManager) {
      request.server.gameManager.acceptedChallenges.set(challengeId, {
        inviterId: inviterId,
        acceptorId: acceptorId,
        inviterUsername: null,
        acceptorUsername: acceptor.username,
        inviterReady: false,
        acceptorReady: false,
        inviterCustomization: null,
        acceptorCustomization: null,
        timestamp: Date.now()
      });
    } else {
      return reply.code(500).send({ error: 'Game service unavailable' });
    }

    // Notify inviter (if online)
    if (inviterSocket) {
      inviterSocket.send(JSON.stringify({
        type: 'game_challenge_accepted',
        data: {
          acceptedBy: acceptor.id_user,
          acceptedByUsername: acceptor.username,
          challengeId: challengeId,
          message: 'Game challenge accepted! Starting game...'
        }
      }));
    }

    // Notify acceptor to start (if online)
    if (acceptorSocket) {
      acceptorSocket.send(JSON.stringify({
        type: 'start_game',
        data: {
          friendId: inviterId,
          challengeId: challengeId,
          message: 'Game challenge accepted! Starting game...'
        }
      }));
    }

    return reply.send({ success: true, challengeId });
  } catch (err) {
    console.error('Error accepting game challenge:', err);
    return reply.code(500).send({ error: 'Failed to accept challenge' });
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

  const notifyId = request.query.notifyId ?? request.query.id;
  if (!notifyId) {
    return reply.code(400).send({ error: "Missing notifyId" });
  }

  try {
    const getNotifyStmt = request.server.db.prepare('SELECT getter_user, sender_user, title FROM notification WHERE notify_id = ?');
    const notification = getNotifyStmt.get(notifyId);

    if (!notification) {
      return reply.code(404).send({ error: 'Notification not found' });
    }

    const deleteStmt = request.server.db.prepare('DELETE FROM notification WHERE notify_id = ? AND getter_user = ?');
    const result = deleteStmt.run(notifyId, request.user.id_user);

    if (result.changes === 0) {
      return reply.code(404).send({ error: 'Notification not found or not authorized' });
    }

    // Notify sender for game challenges (optional but useful)
    const senderSocket = request.server.users_socket.get(notification.sender_user?.toString?.() ?? String(notification.sender_user));
    if (senderSocket && notification.title === 'game challenge') {
      senderSocket.send(JSON.stringify({
        type: 'notification_deleted',
        data: {
          notify_id: notifyId,
          deletedBy: request.user.id_user,
          title: notification.title
        }
      }));
    }

    return reply.code(200).send({ success: true });
  } catch (err) {
    console.error('Error deleting notification:', err);
    return reply.code(500).send({ error: 'Internal server error' });
  }
}







export function getConversationId(request , reply)
{

  console.log("1-=================+>");
  const { id } = request.query;
  if (!id )
    return reply(400).send(fasle);
  console.log("1-=================+>");
  try{
    console.log("1-=================+>");
    const targetUser = request.server.db.prepare("SELECT id_user FROM users WHERE id_user = ?").get(id);
    if (!targetUser)
      return reply.code(404).send({ error: "user not found" });
    console.log("1-=================+>");
    
    
    
    const caseOne = id + "," + request.user.id_user;
    const casetwo= request.user.id_user+ "," + id ;
    console.log("1-=================+>");
    const roomId = request.server.db.prepare("SELECT conversation_id FROM room WHERE members = ? OR members = ?").get(caseOne , casetwo);
    console.log("1-=================+>");
    reply.code(200).send(roomId);

  }catch(err){
    console.log(err);
    reply.code(500).send(false);

  }
}