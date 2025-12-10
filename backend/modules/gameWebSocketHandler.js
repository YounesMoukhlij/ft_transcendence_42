// Game WebSocket Message Handler
// Handles all game-related WebSocket messages

export function handleGameMessage(socket, userId, message, gameManager, db, usersSocket) {
  // Handle game challenge decline messages (forward to friend)
  if (message.type === 'game_challenge_declined') {
    const friendId = message.data?.friendId;
    if (friendId) {
      // Get decliner username from database
      const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
      const decliner = getUserStmt.get(userId);
      const declinerUsername = decliner?.username || 'Unknown';

      // Use GameManager to handle the decline
      gameManager.handleGameChallengeDecline(userId, declinerUsername, friendId);
    }
    return; // Don't process further
  }

  switch (message.type) {
    case 'findMatch': {
      // Check if this is for an accepted challenge first
      const challengeId = message.payload?.challengeId;
      const username = message.payload?.username;
      const customization = message.payload?.customization || {};

      if (!username) {
        socket.send(JSON.stringify({ type: 'error', message: 'Username required' }));
        return;
      }

      // If there's a challengeId, this is for an accepted challenge (friend invitation)
      if (challengeId) {
        console.log(`[findMatch] Challenge-based matchmaking requested. challengeId: ${challengeId}, userId: ${userId}`);

        if (!gameManager.acceptedChallenges.has(challengeId)) {
          console.error(`[findMatch] Challenge ${challengeId} not found in acceptedChallenges`);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Challenge not found or expired. Please send a new invitation.'
          }));
          return; // Don't proceed to random matchmaking
        }

        const challenge = gameManager.acceptedChallenges.get(challengeId);
        console.log(`[findMatch] Found challenge:`, {
          inviterId: challenge.inviterId,
          acceptorId: challenge.acceptorId,
          inviterReady: challenge.inviterReady,
          acceptorReady: challenge.acceptorReady
        });

        // Verify this user is part of the challenge
        if (challenge.inviterId !== userId && challenge.acceptorId !== userId) {
          console.error(`[findMatch] User ${userId} is not part of challenge ${challengeId}`);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'You are not part of this challenge'
          }));
          return;
        }

        // Mark this player as ready
        if (challenge.inviterId === userId) {
          challenge.inviterReady = true;
          challenge.inviterCustomization = customization;
          console.log(`[findMatch] Inviter (${userId}) is ready`);
        } else if (challenge.acceptorId === userId) {
          challenge.acceptorReady = true;
          challenge.acceptorCustomization = customization;
          console.log(`[findMatch] Acceptor (${userId}) is ready`);
        }

        // Update the challenge in the map
        gameManager.acceptedChallenges.set(challengeId, challenge);

        // If both players are ready, create the game room
        if (challenge.inviterReady && challenge.acceptorReady) {
          console.log(`[findMatch] Both players ready, creating game room...`);
          const inviterSocket = usersSocket.get(challenge.inviterId.toString());
          const acceptorSocket = usersSocket.get(challenge.acceptorId.toString());

          if (!inviterSocket || !acceptorSocket) {
            console.error(`[findMatch] One or both sockets not found. inviterSocket: ${!!inviterSocket}, acceptorSocket: ${!!acceptorSocket}`);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Opponent is no longer online'
            }));
            gameManager.acceptedChallenges.delete(challengeId);
            return;
          }

          // Get usernames
          const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
          const inviterUser = getUserStmt.get(challenge.inviterId);
          const acceptorUser = getUserStmt.get(challenge.acceptorId);

          const player1 = {
            id: challenge.inviterId,
            username: inviterUser?.username || 'Player 1',
            socket: inviterSocket,
            customization: challenge.inviterCustomization || {}
          };

          const player2 = {
            id: challenge.acceptorId,
            username: acceptorUser?.username || 'Player 2',
            socket: acceptorSocket,
            customization: challenge.acceptorCustomization || {}
          };

          // Create game room
          const result = gameManager.createGameRoom(player1, player2);
          console.log(`[findMatch] Game room created: ${result.roomCode}`);

          // Remove challenge
          gameManager.acceptedChallenges.delete(challengeId);

          // Both players will receive matchFound message from createGameRoom
        } else {
          // One player is ready, waiting for the other
          console.log(`[findMatch] Waiting for opponent. inviterReady: ${challenge.inviterReady}, acceptorReady: ${challenge.acceptorReady}`);
          socket.send(JSON.stringify({
            type: 'waitingForOpponent',
            message: 'Waiting for opponent to finish customization...'
          }));
        }

        return; // Don't proceed to random matchmaking
      }

      // Check if user has an active accepted challenge (in case challengeId wasn't sent)
      let activeChallenge = null;
      for (const [challengeId, challenge] of gameManager.acceptedChallenges.entries()) {
        if (challenge.inviterId === userId || challenge.acceptorId === userId) {
          activeChallenge = { challengeId, challenge };
          console.log(`[findMatch] Found active challenge ${challengeId} for user ${userId}`);
          break;
        }
      }

      if (activeChallenge) {
        // User has an active challenge but didn't send challengeId - use the found challenge
        const { challengeId, challenge } = activeChallenge;

        // Mark this player as ready
        if (challenge.inviterId === userId) {
          challenge.inviterReady = true;
          challenge.inviterCustomization = customization;
          console.log(`[findMatch] Inviter (${userId}) is ready (challenge found automatically)`);
        } else if (challenge.acceptorId === userId) {
          challenge.acceptorReady = true;
          challenge.acceptorCustomization = customization;
          console.log(`[findMatch] Acceptor (${userId}) is ready (challenge found automatically)`);
        }

        // Update the challenge in the map
        gameManager.acceptedChallenges.set(challengeId, challenge);

        // If both players are ready, create the game room
        if (challenge.inviterReady && challenge.acceptorReady) {
          console.log(`[findMatch] Both players ready, creating game room...`);
          const inviterSocket = usersSocket.get(challenge.inviterId.toString());
          const acceptorSocket = usersSocket.get(challenge.acceptorId.toString());

          if (!inviterSocket || !acceptorSocket) {
            console.error(`[findMatch] One or both sockets not found. inviterSocket: ${!!inviterSocket}, acceptorSocket: ${!!acceptorSocket}`);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Opponent is no longer online'
            }));
            gameManager.acceptedChallenges.delete(challengeId);
            return;
          }

          // Get usernames
          const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
          const inviterUser = getUserStmt.get(challenge.inviterId);
          const acceptorUser = getUserStmt.get(challenge.acceptorId);

          const player1 = {
            id: challenge.inviterId,
            username: inviterUser?.username || 'Player 1',
            socket: inviterSocket,
            customization: challenge.inviterCustomization || {}
          };

          const player2 = {
            id: challenge.acceptorId,
            username: acceptorUser?.username || 'Player 2',
            socket: acceptorSocket,
            customization: challenge.acceptorCustomization || {}
          };

          // Create game room
          const result = gameManager.createGameRoom(player1, player2);
          console.log(`[findMatch] Game room created: ${result.roomCode}`);

          // Remove challenge
          gameManager.acceptedChallenges.delete(challengeId);

          // Both players will receive matchFound message from createGameRoom
        } else {
          // One player is ready, waiting for the other
          console.log(`[findMatch] Waiting for opponent. inviterReady: ${challenge.inviterReady}, acceptorReady: ${challenge.acceptorReady}`);
          socket.send(JSON.stringify({
            type: 'waitingForOpponent',
            message: 'Waiting for opponent to finish customization...'
          }));
        }

        return; // Don't proceed to random matchmaking
      }

      // Random matchmaking (no challengeId and no active challenge)
      console.log(`[findMatch] Random matchmaking requested for user ${userId}`);
      const player = {
        id: userId,
        username: username,
        socket: socket,
        customization: customization
      };

      const result = gameManager.addToMatchmakingQueue(player);

      if (result.error) {
        socket.send(JSON.stringify({ type: 'error', message: result.error }));
      } else if (result.status === 'searching') {
        socket.send(JSON.stringify({ type: 'searching' }));
      }
      break;
    }

    case 'paddleMove': {
      const direction = message.payload?.direction;
      if (direction && ['up', 'down', 'stop'].includes(direction)) {
        gameManager.handlePaddleMove(userId, direction);
      }
      break;
    }

    case 'leaveRoom': {
      const roomCode = message.payload?.roomCode;
      if (roomCode) {
        gameManager.removePlayer(roomCode, userId);
      }
      break;
    }

    case 'cancelSearch': {
      // Remove player from matchmaking queue
      // Make it idempotent - don't error if not in queue (user might have already cancelled or never joined)
      const removed = gameManager.removeFromMatchmakingQueue(userId);
      if (removed) {
        socket.send(JSON.stringify({ type: 'searchCancelled' }));
        console.log(`[cancelSearch] User ${userId} cancelled matchmaking search`);
      } else {
        // User is not in matchmaking queue - this is fine, just send success
        // This can happen if they already cancelled, or if they're in a friend challenge
        socket.send(JSON.stringify({ type: 'searchCancelled' }));
        console.log(`[cancelSearch] User ${userId} not in matchmaking queue (already cancelled or friend challenge)`);
      }
      break;
    }

    case 'cancelFriendChallenge': {
      // Handle cancellation of friend challenge (User A cancels waiting for User B)
      const challengeId = message.payload?.challengeId;

      if (!challengeId) {
        // If no challengeId provided, try to find active challenge for this user
        for (const [id, challenge] of gameManager.acceptedChallenges.entries()) {
          if (challenge.inviterId === userId || challenge.acceptorId === userId) {
            gameManager.acceptedChallenges.delete(id);
            console.log(`[cancelFriendChallenge] User ${userId} cancelled challenge ${id}`);
            socket.send(JSON.stringify({ type: 'searchCancelled' }));
            return;
          }
        }
        socket.send(JSON.stringify({ type: 'error', message: 'No active challenge found' }));
        return;
      }

      // Verify this user is part of the challenge
      const challenge = gameManager.acceptedChallenges.get(challengeId);
      if (challenge && (challenge.inviterId === userId || challenge.acceptorId === userId)) {
        // Remove the challenge
        gameManager.acceptedChallenges.delete(challengeId);
        console.log(`[cancelFriendChallenge] User ${userId} cancelled challenge ${challengeId}`);

        // Notify the other player that the challenge was cancelled
        const otherUserId = challenge.inviterId === userId ? challenge.acceptorId : challenge.inviterId;
        const otherUserSocket = usersSocket.get(otherUserId.toString());
        if (otherUserSocket) {
          gameManager.sendToPlayer(otherUserSocket, {
            type: 'friendChallengeCancelled',
            data: {
              message: 'The other player cancelled the challenge'
            }
          });
        }

        socket.send(JSON.stringify({ type: 'searchCancelled' }));
      } else {
        socket.send(JSON.stringify({ type: 'error', message: 'Challenge not found or you are not part of it' }));
      }
      break;
    }

    case 'inviteFriend': {
      // Handle friend invitation directly (not nested in 'game' action)
      const friendId = message.payload?.friendId;
      const username = message.payload?.username;
      const customization = message.payload?.customization || {};

      if (!friendId) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Friend ID required'
        }));
        return;
      }

      // Check if they are friends
      const friendsCheck = db.prepare(`
        SELECT * FROM friends
        WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
      `);
      const friendship = friendsCheck.get(userId, friendId, friendId, userId);

      if (!friendship) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'You are not friends with this user'
        }));
        return;
      }

      const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
      const user = getUserStmt.get(userId);

      const result = gameManager.sendFriendInvitation(
        userId,
        user?.username || username,
        friendId,
        customization
      );

      if (result.error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: result.error
        }));
      } else {
        socket.send(JSON.stringify({
          type: 'gameInvitationSent',
          payload: { roomCode: result.roomCode, friendId }
        }));
      }
      break;
    }

    case 'acceptInvitation': {
      // Handle accept invitation directly (not nested in 'game' action)
      const roomCode = message.payload?.roomCode;
      const customization = message.payload?.customization || {};

      // Get user info
      const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
      const user = getUserStmt.get(userId);

      if (!user) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'User not found'
        }));
        return;
      }

      // Find invitation by roomCode
      // Invitations are stored with the friendId (acceptor) as key
      let invitation = null;
      let inviterId = null;
      for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
        if (inv.roomCode === roomCode) {
          // friendId is the acceptor (the one who received the invitation)
          if (parseInt(friendId) === userId) {
            invitation = inv;
            inviterId = inv.from; // the one who sent the invitation
            break;
          }
        }
      }

      if (!invitation) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Invitation not found or expired'
        }));
        return;
      }

      // userId is the acceptor, inviterId is the one who sent the invitation
      const result = gameManager.acceptFriendInvitation(
        userId, // acceptorId (the one who received the invitation)
        inviterId, // the one who sent it
        user.username,
        socket,
        customization
      );

      if (result.error) {
        socket.send(JSON.stringify({
          type: 'error',
          message: result.error
        }));
      }
      // Success handled in acceptFriendInvitation (sends matchFound to both players)
      break;
    }

    case 'declineInvitation': {
      // Handle decline invitation directly (not nested in 'game' action)
      const roomCode = message.payload?.roomCode;

      // Find invitation by roomCode
      for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
        if (inv.roomCode === roomCode) {
          gameManager.declineFriendInvitation(friendId);
          break;
        }
      }
      break;
    }

    case 'rematch:request': {
      // Find room by player
      const found = gameManager.findRoomByPlayer(userId);
      if (found) {
        const result = gameManager.requestRematch(found.roomCode, userId);
        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        }
      }
      break;
    }

    case 'rematch:accept': {
      const found = gameManager.findRoomByPlayer(userId);
      if (found) {
        const result = gameManager.acceptRematch(found.roomCode, userId);
        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        }
      }
      break;
    }

    case 'rematch:decline': {
      const found = gameManager.findRoomByPlayer(userId);
      if (found) {
        gameManager.declineRematch(found.roomCode, userId);
      }
      break;
    }

    case 'game': {
      // Handle game actions (for backward compatibility and tournament actions)
      const action = message.action;
      const payload = message.payload || {};

      // Tournament actions
      if (action === 'createTournament') {
        const playerCount = payload.playerCount || 4;
        const isPrivate = payload.isPrivate !== undefined ? payload.isPrivate : true;

        const playerInfo = {
          playerName: payload.playerName || 'Host Player',
          avatar: payload.avatar,
          color: payload.color || '#3B82F6'
        };

        const result = gameManager.createTournament(userId, playerInfo, playerCount, isPrivate);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        } else {
          socket.send(JSON.stringify({
            type: 'tournamentCreated',
            data: {
              tournamentId: result.tournamentId,
              tournament: gameManager.getTournamentData(result.tournament)
            }
          }));
        }
        return;
      }

      if (action === 'searchTournaments') {
        const tournaments = gameManager.searchTournaments(userId);
        socket.send(JSON.stringify({
          type: 'tournamentsFound',
          data: tournaments
        }));
        return;
      }

      if (action === 'requestJoinTournament') {
        const tournamentId = payload.tournamentId;
        if (!tournamentId) {
          socket.send(JSON.stringify({
            type: 'tournamentJoinRequestFailed',
            data: { message: 'Tournament ID required' }
          }));
          return;
        }

        const playerInfo = {
          playerName: payload.playerName || 'Player',
          avatar: payload.avatar,
          color: payload.color || '#10B981'
        };

        const result = gameManager.requestJoinTournament(tournamentId, userId, playerInfo);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'tournamentJoinRequestFailed',
            data: { message: result.error, tournamentId }
          }));
        } else {
          socket.send(JSON.stringify({
            type: 'tournamentJoinRequestSent',
            data: {
              message: 'Join request sent. Waiting for host approval...',
              tournamentId: tournamentId,
              requestId: result.requestId
            }
          }));
        }
        return;
      }

      if (action === 'approveJoinRequest') {
        const tournamentId = payload.tournamentId;
        const requestId = payload.requestId;

        if (!tournamentId || !requestId) {
          socket.send(JSON.stringify({
            type: 'joinRequestError',
            data: { message: 'Tournament ID and Request ID required' }
          }));
          return;
        }

        const result = gameManager.approveJoinRequest(tournamentId, requestId, userId);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'joinRequestError',
            data: { message: result.error }
          }));
        }
        // Success handled in approveJoinRequest
        return;
      }

      if (action === 'declineJoinRequest') {
        const tournamentId = payload.tournamentId;
        const requestId = payload.requestId;

        if (!tournamentId || !requestId) {
          socket.send(JSON.stringify({
            type: 'joinRequestError',
            data: { message: 'Tournament ID and Request ID required' }
          }));
          return;
        }

        const result = gameManager.declineJoinRequest(tournamentId, requestId, userId);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'joinRequestError',
            data: { message: result.error }
          }));
        }
        // Success handled in declineJoinRequest
        return;
      }

      if (action === 'inviteToTournament') {
        const friendId = payload.friendId;
        const tournamentId = payload.tournamentId;

        if (!friendId || !tournamentId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Friend ID and Tournament ID required'
          }));
          return;
        }

        // Check if they are friends
        const friendsCheck = db.prepare(`
          SELECT * FROM friends
          WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
        `);
        const friendship = friendsCheck.get(userId, friendId, friendId, userId);

        if (!friendship) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'You are not friends with this user'
          }));
          return;
        }

        const result = gameManager.inviteToTournament(tournamentId, userId, friendId);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        }
        // Success handled in inviteToTournament
        return;
      }

      if (action === 'acceptTournamentInvite') {
        const tournamentId = payload.tournamentId;

        if (!tournamentId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament ID required'
          }));
          return;
        }

        // Get user info
        const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
        const user = getUserStmt.get(userId);

        if (!user) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'User not found'
          }));
          return;
        }

        const playerInfo = {
          playerName: user.username,
          avatar: payload.avatar,
          color: payload.color || '#10B981'
        };

        const result = gameManager.acceptTournamentInvite(tournamentId, userId, playerInfo);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        }
        // Success handled in acceptTournamentInvite
        return;
      }

      if (action === 'declineTournamentInvite') {
        const tournamentId = payload.tournamentId;

        if (!tournamentId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament ID required'
          }));
          return;
        }

        const result = gameManager.declineTournamentInvite(tournamentId, userId);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        } else {
          socket.send(JSON.stringify({
            type: 'tournamentInviteDeclined',
            data: {
              tournamentId: tournamentId,
              message: 'Tournament invitation declined successfully'
            }
          }));
        }
        return;
      }

      if (action === 'findRandomOpponent') {
        const tournamentId = payload.tournamentId;

        if (!tournamentId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament ID required'
          }));
          return;
        }

        // Get user info
        const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
        const user = getUserStmt.get(userId);

        if (!user) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'User not found'
          }));
          return;
        }

        const playerInfo = {
          playerId: userId,
          playerName: payload.playerName || user.username,
          avatar: payload.avatar,
          color: payload.color || '#10B981'
        };

        const result = gameManager.findRandomOpponent(tournamentId, userId, playerInfo);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        } else {
          socket.send(JSON.stringify({
            type: 'randomOpponentSearchStarted',
            data: { message: result.message }
          }));
        }
        return;
      }

      if (action === 'cancelTournament') {
        const tournamentId = payload.tournamentId;

        if (!tournamentId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament ID required'
          }));
          return;
        }

        const result = gameManager.cancelTournament(tournamentId, userId);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        } else {
          socket.send(JSON.stringify({
            type: 'tournamentCancelled',
            data: {
              tournamentId: tournamentId,
              message: 'Tournament cancelled successfully'
            }
          }));
        }
        return;
      }

      if (action === 'startTournament') {
        const tournamentId = payload.tournamentId;
        const customization = payload.customization || {};

        if (!tournamentId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament ID required'
          }));
          return;
        }

        // Verify user is the host
        const tournament = gameManager.tournaments.get(tournamentId);
        if (!tournament) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament not found'
          }));
          return;
        }

        if (tournament.host.id !== userId) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Only the host can start the tournament'
          }));
          return;
        }

        if (tournament.currentPlayers !== tournament.maxPlayers) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Tournament is not full'
          }));
          return;
        }

        // Store customization in tournament (can be used later for game settings)
        tournament.customization = customization;

        // Start the tournament
        const result = gameManager.startTournament(tournamentId);

        if (result.error) {
          socket.send(JSON.stringify({
            type: 'error',
            message: result.error
          }));
        } else {
          // Success - tournamentStarted message will be sent via broadcastTournamentUpdate
          // which is called in startTournament
        }
        return;
      }

      // Legacy game actions (friend invitations, etc.)
      switch (action) {
        case 'inviteFriend': {
          // Redirect to new format
          const friendId = payload.friendId;
          const username = payload.playerName || payload.username;
          const customization = payload.customization || {};

          if (!friendId) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Friend ID required'
            }));
            return;
          }

          // Check if they are friends
          const friendsCheck = db.prepare(`
            SELECT * FROM friends
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
          `);
          const friendship = friendsCheck.get(userId, friendId, friendId, userId);

          if (!friendship) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'You are not friends with this user'
            }));
            return;
          }

          const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
          const user = getUserStmt.get(userId);

          const result = gameManager.sendFriendInvitation(
            userId,
            user?.username || username,
            friendId,
            customization
          );

          if (result.error) {
            socket.send(JSON.stringify({
              type: 'error',
              message: result.error
            }));
          } else {
            socket.send(JSON.stringify({
              type: 'gameInvitationSent',
              payload: { roomCode: result.roomCode, friendId }
            }));
          }
          break;
        }

        case 'acceptInvitation': {
          const roomCode = payload.roomCode;
          const customization = payload.customization || {};

          // Get user info
          const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
          const user = getUserStmt.get(userId);

          if (!user) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'User not found'
            }));
            return;
          }

          // Find invitation by roomCode
          // Invitations are stored with the friendId (acceptor) as key
          let invitation = null;
          let inviterId = null;
          for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
            if (inv.roomCode === roomCode) {
              // friendId is the acceptor (the one who received the invitation)
              if (parseInt(friendId) === userId) {
                invitation = inv;
                inviterId = inv.from; // the one who sent the invitation
                break;
              }
            }
          }

          if (!invitation) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Invitation not found or expired'
            }));
            return;
          }

          // userId is the acceptor, inviterId is the one who sent the invitation
          const result = gameManager.acceptFriendInvitation(
            userId, // acceptorId (the one who received the invitation)
            inviterId, // the one who sent it
            user.username,
            socket,
            customization
          );

          if (result.error) {
            socket.send(JSON.stringify({
              type: 'error',
              message: result.error
            }));
          }
          // Success handled in acceptFriendInvitation (sends matchFound)
          break;
        }

        case 'declineInvitation': {
          const roomCode = payload.roomCode;

          // Find invitation by roomCode
          for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
            if (inv.roomCode === roomCode) {
              gameManager.declineFriendInvitation(friendId);
              break;
            }
          }
          break;
        }
      }
      break;
    }

    default:
      // Unknown message type - ignore
      break;
  }
}

