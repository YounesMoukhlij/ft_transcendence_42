// WebSocket Handler - Manages all WebSocket connection logic

import { handleGameMessage } from './gameWebSocketHandler.js';
import { statusShare } from './statusHandler.js';

export function setupWebSocketServer(wss, db, users_socket, gameManager) {
  wss.on('connection', (socket) => {
    let id = -1;
    let isAuthenticated = false;

    socket.once('message', (msg) => {
      try {
        id = parseInt(msg.toString());

        if (isNaN(id)) {
          socket.close();
          return;
        }

        // Verify user exists
        const userQuery = db.prepare('SELECT id_user, username FROM users WHERE id_user = ?');
        const user = userQuery.get(id);

        if (!user) {
          socket.close();
          return;
        }

        isAuthenticated = true;
        users_socket.set(id.toString(), socket);

        // Update user status in database
        const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
        query.run(1, id);

        // Share status with friends
        statusShare(id, 1, db, users_socket);

        // Send all pending notifications to the user when they connect/reconnect
        // This ensures notifications are synced without needing a page refresh
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
            const notifications = getNotificationsStmt.all(id);

            // Send each notification via WebSocket
            console.log(`[WebSocketHandler] Syncing ${notifications.length} notifications for user ${id}`);
            for (const notif of notifications) {
              // Check if notification is expired
              const now = new Date();
              const expired = notif.expired ? new Date(notif.expired) : null;

              if (!expired || expired > now) {
                // Try to extract tournamentId from notifyBody if it's a JSON string
                let tournamentId = null;
                if (notif.title === 'tournament invite' && notif.notifyBody) {
                  try {
                    const parsed = JSON.parse(notif.notifyBody);
                    if (parsed.tournamentId) {
                      tournamentId = parsed.tournamentId;
                      console.log(`[WebSocketHandler] Extracted tournamentId ${tournamentId} from notification ${notif.notify_id}`);
                    }
                  } catch (e) {
                    // If parsing fails, notifyBody is not JSON, so no tournamentId
                    console.log(`[WebSocketHandler] Notification ${notif.notify_id} notifyBody is not JSON: ${notif.notifyBody}`);
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

                try {
                  socket.send(JSON.stringify({
                    type: 'notify',
                    data: notifyData
                  }));
                  console.log(`[WebSocketHandler] Sent notification ${notif.notify_id} (${notif.title}) to user ${id}`);
                } catch (error) {
                  console.error(`[WebSocketHandler] Error sending notification ${notif.notify_id} to user ${id}:`, error);
                }
              } else {
                console.log(`[WebSocketHandler] Skipping expired notification ${notif.notify_id}`);
              }
            }
          } catch (error) {
            console.error('Error syncing notifications on connection:', error);
          }
        }, 500); // Small delay to ensure socket is fully ready

        // Handle all subsequent messages
        socket.on('message', (message) => {
          try {
            const data = JSON.parse(message.toString());

            // Update socket reference in active game rooms if player is in a game
            gameManager.handlePlayerReconnect(id, socket);

            // Handle game messages (including game challenge decline)
            handleGameMessage(socket, id, data, gameManager, db, users_socket);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        socket.on('close', () => {
          // Share offline status with friends
          statusShare(id, 0, db, users_socket);

          // Update user status in database
          const query = db.prepare('UPDATE users SET status = ? WHERE id_user = ?');
          query.run(0, id);

          // Cleanup game-related data
          gameManager.handlePlayerDisconnect(id);

          users_socket.delete(id.toString());
        });

        socket.on('error', (error) => {
          console.error('WebSocket error for user', id, ':', error);
        });

      } catch (error) {
        console.error('Error in WebSocket connection:', error);
        socket.close();
      }
    });
  });
}

