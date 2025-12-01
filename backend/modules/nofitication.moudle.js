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

    // Extract tournamentId from notifyBody for tournament invites
    const processedNotifications = notifications.map(notif => {
      if (notif.title === 'tournament invite' && notif.notifyBody) {
        try {
          const parsed = JSON.parse(notif.notifyBody);
          if (parsed.tournamentId) {
            return {
              ...notif,
              tournamentId: parsed.tournamentId,
              notifyBody: parsed.message || notif.notifyBody // Restore original message
            };
          }
        } catch (e) {
          // If parsing fails, notifyBody is not JSON, so return as-is
        }
      }
      return notif;
    });

    return reply.send(processedNotifications);

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

    // Prepare notification data
    const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
    const profileResult = query1.get(request.user.id_user);

    const query2 = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ? AND title = ? ORDER BY notify_id DESC LIMIT 1");
    const notifyResult = query2.get(friend_id, request.user.id_user, title);

    const notifyObject = {
      getter_user: friend_id,
      sender_user: request.user.id_user,
      sender_username: request.user.username,
      title: title,
      sender_profile_img: profileResult?.profile_img || '',
      notify_id: notifyResult?.notify_id || insertedId
    };

    // Send notification via WebSocket if recipient is online
    if (socket) {
      // Check if socket is in OPEN state (readyState === 1)
      if (socket.readyState === 1) { // WebSocket.OPEN
        try {
          socket.send(JSON.stringify({
            type: "notify",
            data: notifyObject
          }));
          console.log(`[sendRequestFriend] Notification sent via WebSocket to user ${friend_id} (notify_id: ${notifyObject.notify_id})`);
        } catch (sendError) {
          console.error(`[sendRequestFriend] Error sending WebSocket notification to user ${friend_id}:`, sendError);
          // Notification is still saved in DB, will be synced on next connection
        }
      } else {
        console.log(`[sendRequestFriend] User ${friend_id} socket exists but not OPEN (readyState: ${socket.readyState}). Notification saved in DB.`);
      }
    } else {
      console.log(`[sendRequestFriend] User ${friend_id} is offline. Notification saved in DB and will be synced on reconnect.`);
    }

    return reply.code(200).send(insertedId);

  } catch (err) {
    console.error('[sendRequestFriend] Error:', err);
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

        // Get the notification ID before deleting (the friend request notification that the acceptor received)
        const getNotifyStmt = request.server.db.prepare("SELECT notify_id FROM notification WHERE getter_user = ? AND sender_user = ? AND title = ? LIMIT 1");
        const deletedNotify = getNotifyStmt.get(request.user.id_user, Freind_id, "request friend");

        const deleteQuery = request.server.db.prepare("Delete from notification where getter_user = ? AND sender_user = ? AND title = ?");
        const deleteResult = deleteQuery.run(request.user.id_user, Freind_id, "request friend");

        // Notify the acceptor (current user) that their friend request notification was removed
        if (deletedNotify) {
          const acceptorSocket = request.server.users_socket.get(request.user.id_user.toString());
          if (acceptorSocket) {
            acceptorSocket.send(JSON.stringify({
              type: "notification_deleted",
              data: {
                notify_id: deletedNotify.notify_id,
                title: "request friend"
              }
            }));
          }
        }

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

    // Update status based on real-time socket connections (more accurate than database)
    const usersSocket = request.server.users_socket;
    for (const friend of friendDetails) {
      // Check if friend has an active WebSocket connection (real-time status)
      const friendSocket = usersSocket.get(friend.id_user.toString());
      if (friendSocket) {
        // Friend is online if socket exists and is open
        friend.status = friendSocket.readyState === 1 ? 1 : 0; // 1 = OPEN, 0 = CLOSED
      } else {
        // No socket means offline
        friend.status = 0;
      }
    }

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

    const insertResult = insertQuery.run(Friend_id, title, request.user.id_user, "game challenge" , ExpiredTime);
    const notify_id = insertResult.lastInsertRowid; // Get the ID from the insert result


    const socket = request.server.users_socket.get(Friend_id.toString());


    if (socket){

      const query1 = request.server.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
      const result = query1.get(request.user.id_user);


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
        getter_user: Friend_id,
        sender_user: request.user.id_user,
        sender_username: request.user.username,
        title: title,
        sender_profile_img: result.profile_img,
        notify_id: notify_id, // Use the ID from insert result
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
    const inviterId = Friend_id; // The one who sent the invitation
    const acceptorId = request.user.id_user; // The one accepting

    // Get the inviter's socket
    const inviterSocket = request.server.users_socket.get(inviterId.toString());

    // Get the acceptor's info
    const getUserStmt = request.server.db.prepare('SELECT username, id_user FROM users WHERE id_user = ?');
    const acceptor = getUserStmt.get(acceptorId);

    if (!acceptor) {
      return reply.code(404).send({ error: 'User not found' });
    }

    // Create a pending accepted challenge in gameManager
    // This will be used to match them after customization
    const challengeId = `${inviterId}_${acceptorId}`;
    console.log(`[AcceptGameChallenge] Creating challenge with ID: ${challengeId} for inviter ${inviterId} and acceptor ${acceptorId}`);

    if (request.server.gameManager) {
      request.server.gameManager.acceptedChallenges.set(challengeId, {
        inviterId: inviterId,
        acceptorId: acceptorId,
        inviterUsername: null, // Will be set when inviter sends customization
        acceptorUsername: acceptor.username,
        inviterReady: false,
        acceptorReady: false,
        inviterCustomization: null,
        acceptorCustomization: null,
        timestamp: Date.now()
      });
      console.log(`[AcceptGameChallenge] Challenge stored. Total challenges: ${request.server.gameManager.acceptedChallenges.size}`);
    } else {
      console.error('[AcceptGameChallenge] gameManager not available!');
      return reply.code(500).send({ error: 'Game service unavailable' });
    }

    if (inviterSocket && acceptor){
      // Notify the inviter that the challenge was accepted
      // Both players should go to customization page
      const acceptData = {
        acceptedBy: acceptor.id_user,
        acceptedByUsername: acceptor.username,
        challengeId: challengeId,
        message: "Game challenge accepted! Starting game..."
      };

      inviterSocket.send(JSON.stringify({
        type: "game_challenge_accepted",
        data: acceptData
      }));
    }

    // Also notify the acceptor (current user) to go to customization
    const acceptorSocket = request.server.users_socket.get(acceptorId.toString());
    if (acceptorSocket) {
      acceptorSocket.send(JSON.stringify({
        type: "start_game",
        data: {
          friendId: inviterId,
          challengeId: challengeId,
          message: "Game challenge accepted! Starting game..."
        }
      }));
    }

    return reply.send({ success: true, challengeId });
  }catch(err){
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

  const notifyId = request.query.notifyId;
  if (!notifyId) {
    return reply.code(400).send({ error: "Missing notifyId" });
  }

  try{
    // Get notification details before deleting
    const getNotifyStmt = request.server.db.prepare("SELECT getter_user, sender_user, title FROM notification WHERE notify_id = ?");
    const notification = getNotifyStmt.get(notifyId);

    if (!notification) {
      return reply.code(404).send({ error: "Notification not found" });
    }

    // Delete the notification
    const deleteStmt = request.server.db.prepare('DELETE FROM notification WHERE notify_id = ? AND getter_user = ?');
    const result = deleteStmt.run(notifyId, request.user.id_user);

    if (result.changes === 0) {
      return reply.code(404).send({ error: "Notification not found or not authorized" });
    }

    // Notify the sender that the notification was deleted (if they're online)
    // This is useful for game challenges - when acceptor accepts, inviter should see notification removed
    const senderSocket = request.server.users_socket.get(notification.sender_user.toString());
    if (senderSocket && notification.title === "game challenge") {
      senderSocket.send(JSON.stringify({
        type: "notification_deleted",
        data: {
          notify_id: notifyId,
          deletedBy: request.user.id_user,
          title: notification.title
        }
      }));
    }

    return reply.code(200).send({ success: true });
  }catch(err){
    console.error('Error deleting notification:', err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}
