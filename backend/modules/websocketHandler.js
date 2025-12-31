// WebSocket Handler - Manages all WebSocket connection logic

import { handleGameMessage } from './gameWebSocketHandler.js';
import { statusShare } from './statusHandler.js';
import jwt from 'jsonwebtoken';

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

  const syncNotifications = (socket, userId) => {
    // Send all pending notifications to the user when they connect/reconnect
    setTimeout(() => {
      try {
        const getNotificationsStmt = db.prepare(`
          SELECT n.*,
                 u.username as sender_username,
                 u.profile_img as sender_profile_img
          FROM notification n
          LEFT JOIN users u ON n.sender_user = u.id_user
          WHERE n.getter_user = ? AND n.is_seen = 0
          ORDER BY n.notify_id DESC
        `);
        const notifications = getNotificationsStmt.all(userId);

        for (const notif of notifications) {
          const now = new Date();
          let expired = null;

          if (notif.expired) {
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
              expired = new Date(expiredStr.replace(' ', 'T') + 'Z');
            } catch {
              expired = null;
            }
          }

          if (!expired || expired > now) {
            let tournamentId = null;
            if (notif.title === 'tournament invite' && notif.notifyBody) {
              try {
                const parsed = JSON.parse(notif.notifyBody);
                if (parsed.tournamentId) tournamentId = parsed.tournamentId;
              } catch {
                // ignore
              }
            }

            const notifyData = {
              getter_user: notif.getter_user,
              sender_user: notif.sender_user,
              sender_username: notif.sender_username || 'Unknown',
              title: notif.title,
              sender_profile_img: notif.sender_profile_img || '',
              notify_id: notif.notify_id,
              expired: notif.expired,
              tournamentId: tournamentId
            };

            socket.send(JSON.stringify({
              type: 'notify',
              data: notifyData
            }));
          }
        }
      } catch (error) {
        console.error('Error syncing notifications on connection:', error);
      }
    }, 500);
  };

  const afterAuth = (socket, userId) => {
    const idStr = String(userId);
    socket.userId = idStr;
    users_socket.set(idStr, socket);

    console.log("============> connected the new size of map " , users_socket.size);

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

    syncNotifications(socket, userId);

    socket.on('message', (message) => {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch {
        return;
      }

      // ----------------------
      // Chat-related messages
      // ----------------------
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
          // ignore
        }
        return;
      }

      if (data.type === 'message') {
        const socketFriend = users_socket.get(String(data.contactId));

        try {
          db.prepare('INSERT INTO message (conv_id, message, sender, isSeen) VALUES (?, ?, ?, ?)')
            .run(data.conversation_id, data.input, idStr, 0);

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
          console.error('Error handling chat message:', err);
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

    // No token => expect first message to be userId
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

