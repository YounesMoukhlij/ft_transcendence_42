// Status Handler - Manages user online/offline status sharing with friends

export function statusShare(id, mode, db, users_socket) {
  const getFriendsStmt1 = db.prepare(`SELECT user_id FROM friends WHERE friend_id = ?`);
  const getFriendsStmt2 = db.prepare(`SELECT friend_id FROM friends WHERE user_id = ?`);

  const friends1 = getFriendsStmt1.all(id).map(row => row.user_id);
  const friends2 = getFriendsStmt2.all(id).map(row => row.friend_id);
  const allFriends = [...friends1, ...friends2];

  console.log(`[statusShare] User ${id} status changed to ${mode ? 'online' : 'offline'}. Notifying ${allFriends.length} friends.`);

  for (let i = 0; i < allFriends.length; i++) {
    const socket = users_socket.get(allFriends[i].toString());

    if (socket) {
      const data = {
        status: mode,
        friend: id
      };
      socket.send(JSON.stringify({
        type: "status",
        data: data
      }));
      console.log(`[statusShare] Status update sent to friend ${allFriends[i]}: ${mode ? 'online' : 'offline'}`);
    } else {
      console.log(`[statusShare] Friend ${allFriends[i]} is not connected, skipping status update`);
    }
  }
}

