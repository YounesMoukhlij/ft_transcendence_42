// WebSocket Handler - Manages all WebSocket connection logic

import { profile } from 'console';
import { handleGameMessage } from './gameWebSocketHandler.js';
import { statusShare } from './statusHandler.js';
import jwt from 'jsonwebtoken';
import { convertCompilerOptionsFromJson } from 'typescript';

export function setupWebSocketServer(wss, db, users_socket, gameManager) {
  const parseTokenFromReq = (req) => {
    try {
      const url = req?.url || '';
      const query = url.includes('?') ? url.split('?')[1] : '';
      const params = new URLSearchParams(query);
      return params.get('token');
    } catch {
      return null;
    }
  };

  
  const afterAuth = (socket, userId) => {
    const idStr = String(userId);
    socket.userId = idStr;
    users_socket.set(idStr, socket);


    let statusMode = 1;
    try {
      const allowQuery = db.prepare('SELECT status_share FROM users WHERE id_user = ?');
      const result = allowQuery.get(userId);
      statusMode = result?.status_share ? 1 : 0;
    } catch {
      statusMode = 1;
    }

    try {
      db.prepare('UPDATE users SET status = ? WHERE id_user = ?').run(statusMode, userId);
    } catch {
      // ignore
    }

    try {
      statusShare(userId, statusMode, db, users_socket);
    } catch {
      // ignore
    }

    // syncNotifications(socket, userId);

    socket.on('message', (message) => {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch {
        return;
      }

      if (data.type === 'ping') {
        socket.send(JSON.stringify({ type: 'pong' }));
        console.log("here================================++>");
        return;
      }

      if (data.type === 'istyping') {
        const socketFriend = users_socket.get(String(data.friend));
        if (socketFriend) {
          socketFriend.send(JSON.stringify({
            type: 'isTyping',
            data: { friendId: idStr }
          }));
        }
        return;
      }

      if (data.type === 'isSeen') {
        const socketFriend = users_socket.get(String(data.contactId));
        try {
          const q = db.prepare('SELECT read_receipts FROM users WHERE id_user = ?');
          const res = q.get(userId);

          if (res?.read_receipts) {
            db.prepare('UPDATE message SET isSeen = 1 WHERE conv_id = ? AND sender = ? AND isSeen = 0')
              .run(data.convId, data.contactId);

            if (socketFriend) {
              socketFriend.send(JSON.stringify({
                type: 'seen',
                data: { seen: true, conv_id: data.convId }
              }));
            }
          }
        } catch {
        }
        return;
      }

      if (data.type === 'message') {

        if (typeof data !== "object" || typeof data.input !== "string" || data.input.trim().length === 0 || typeof data.contactId === "undefined" ||typeof data.conversation_id === "undefined" || typeof data.userId === "undefined") {
          return;
        }

        const socketFriend = users_socket.get(String(data.contactId));

        try {

          if (data.contactId == data.userId)
              return ;

          const room = db.prepare("SELECT *  FROM room WHERE conversation_id = ?").get(data.conversation_id);
          const map = room.members.split(",").map(id => id.trim());

          if (Number(map[0]) != data.userId && Number(map[1]) != data.userId )
            return ;
          console.log(room.blockedByUser2);
          console.log(room.blockedByUser1);
          if (room.blockedByUser2 != -1 || room.blockedByUser1 != -1){
            console.log("you are blocked");
            return ;
          }
                    
            db.prepare('INSERT INTO message (conv_id, message, sender, isSeen) VALUES (?, ?, ?, ?)').run(data.conversation_id, data.input, idStr, 0);
                    
            db.prepare('UPDATE room SET lastMessage = ?, lastMessageTime = CURRENT_TIMESTAMP, lastMessageSender = ? WHERE conversation_id = ?')
            .run(data.input, idStr, data.conversation_id);

          if (socketFriend) {
            socketFriend.send(JSON.stringify({
              type: 'message',
              data: {
                message: data.input,
                conv_id: data.conversation_id,
                sender_user_id: idStr
              }
            }));
          }
        } catch (err) {
          // console.error('Error handling chat message:', err);
        }
        return;
      }


      // ----------------------
      // Game-related messages
      // ----------------------
      try {
        gameManager.handlePlayerReconnect(userId, socket);
      } catch {
        // ignore
      }

      handleGameMessage(socket, userId, data, gameManager, db, users_socket);
    });

    socket.on('close', () => {
      try {
        statusShare(userId, 0, db, users_socket);
      } catch {
        // ignore
      }

      try {
        db.prepare('UPDATE users SET status = ? WHERE id_user = ?').run(0, userId);
      } catch {
        // ignore
      }

      try {
        gameManager.handlePlayerDisconnect(userId);
      } catch {
        // ignore
      }

      users_socket.delete(idStr);
    });

    socket.on('error', (error) => {
      console.error('WebSocket error for user', userId, ':', error);
    });
  };

  wss.on('connection', (socket, req) => {
    // Support BOTH:
    // 1) /ws?token=JWT  (existing chat/auth flow)
    // 2) /ws then first message is userId (game flow)
    const token = parseTokenFromReq(req);

    
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded?.id_user;
        console.log("============> new clinet want to connect " , userId);
        if (!userId) {
          socket.close();
          return;
        }
        afterAuth(socket, Number(userId));
        return;
      } catch {
        socket.close();
        return;
      }
    }

    // // No token => expect first message to be userId
    // socket.once('message', (msg) => {
    //   try {
    //     const userId = parseInt(msg.toString());
    //     if (isNaN(userId)) {
    //       socket.close();
    //       return;
    //     }

    //     const userQuery = db.prepare('SELECT id_user FROM users WHERE id_user = ?');
    //     const user = userQuery.get(userId);
    //     if (!user) {
    //       socket.close();
    //       return;
    //     }

    //     afterAuth(socket, userId);
    //   } catch (error) {
    //     console.error('Error in WebSocket connection:', error);
    //     socket.close();
    //   }
    // });
  });
}

