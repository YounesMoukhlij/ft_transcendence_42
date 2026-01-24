


export function handleGameMessage(socket, userId, message, gameManager, db, usersSocket) {
  
  if (message.type === 'game_challenge_declined') {
    const friendId = message.data?.friendId;
    if (friendId) {
      
      const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
      const decliner = getUserStmt.get(userId);
      const declinerUsername = decliner?.username || 'Unknown';

      
      gameManager.handleGameChallengeDecline(userId, declinerUsername, friendId);
    }
    return; 
  }

  switch (message.type) {
    case 'findMatch': {
      
      const challengeId = message.payload?.challengeId;
      const username = message.payload?.username;
      const customization = message.payload?.customization || {};

      if (!username) {
        socket.send(JSON.stringify({ type: 'error', message: 'Username required' }));
        return;
      }

      
      if (challengeId) {
        

        if (!gameManager.acceptedChallenges.has(challengeId)) {
          console.error(`[findMatch] Challenge ${challengeId} not found in acceptedChallenges`);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Challenge not found or expired. Please send a new invitation.'
          }));
          return; 
        }

        const challenge = gameManager.acceptedChallenges.get(challengeId);
        
        
        
        
        
        

        
        if (challenge.inviterId !== userId && challenge.acceptorId !== userId) {
          
          socket.send(JSON.stringify({
            type: 'error',
            message: 'You are not part of this challenge'
          }));
          return;
        }

        
        if (challenge.inviterId === userId) {
          challenge.inviterReady = true;
          challenge.inviterCustomization = customization;
          
        } else if (challenge.acceptorId === userId) {
          challenge.acceptorReady = true;
          challenge.acceptorCustomization = customization;
          
        }

        
        gameManager.acceptedChallenges.set(challengeId, challenge);

        
        if (challenge.inviterReady && challenge.acceptorReady) {
          
          const inviterSocket = usersSocket.get(challenge.inviterId.toString());
          const acceptorSocket = usersSocket.get(challenge.acceptorId.toString());

          if (!inviterSocket || !acceptorSocket) {
            
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Opponent is no longer online'
            }));
            gameManager.acceptedChallenges.delete(challengeId);
            return;
          }

          
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

          
          const result = gameManager.createGameRoom(player1, player2);
          

          
          gameManager.acceptedChallenges.delete(challengeId);

          
        } else {
          
          
          socket.send(JSON.stringify({
            type: 'waitingForOpponent',
            message: 'Waiting for opponent to finish customization...'
          }));
        }

        return; 
      }

      
      let activeChallenge = null;
      for (const [challengeId, challenge] of gameManager.acceptedChallenges.entries()) {
        if (challenge.inviterId === userId || challenge.acceptorId === userId) {
          activeChallenge = { challengeId, challenge };
          
          break;
        }
      }

      if (activeChallenge) {
        
        const { challengeId, challenge } = activeChallenge;

        
        if (challenge.inviterId === userId) {
          challenge.inviterReady = true;
          challenge.inviterCustomization = customization;
          
        } else if (challenge.acceptorId === userId) {
          challenge.acceptorReady = true;
          challenge.acceptorCustomization = customization;
          
        }

        
        gameManager.acceptedChallenges.set(challengeId, challenge);

        
        if (challenge.inviterReady && challenge.acceptorReady) {
          
          const inviterSocket = usersSocket.get(challenge.inviterId.toString());
          const acceptorSocket = usersSocket.get(challenge.acceptorId.toString());

          if (!inviterSocket || !acceptorSocket) {
            
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Opponent is no longer online'
            }));
            gameManager.acceptedChallenges.delete(challengeId);
            return;
          }

          
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

          
          const result = gameManager.createGameRoom(player1, player2);
          

          
          gameManager.acceptedChallenges.delete(challengeId);

          
        } else {
          
          
          socket.send(JSON.stringify({
            type: 'waitingForOpponent',
            message: 'Waiting for opponent to finish customization...'
          }));
        }

        return; 
      }

      
      
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

    case 'requestGameState': {
      
      const roomCode = message.payload?.roomCode;
      if (roomCode) {
        const room = gameManager.gameRooms.get(roomCode);
        if (room && room.gameState) {
          
          
          const gameState = {
            player1: {
              id: room.gameState.player1.id,
              username: room.gameState.player1.username,
              avatar: room.gameState.player1.avatar || null,
              y: room.gameState.player1.y,
              score: room.gameState.player1.score,
              customization: room.gameState.player1.customization || room.player1.customization || null
            },
            player2: {
              id: room.gameState.player2.id,
              username: room.gameState.player2.username,
              avatar: room.gameState.player2.avatar || null,
              y: room.gameState.player2.y,
              score: room.gameState.player2.score,
              customization: room.gameState.player2.customization || room.player2.customization || null
            },
            ball: room.gameState.ball
          };

          
          const gameStateMessage = {
            type: 'gameState',
            roomCode: roomCode,
            payload: gameState
          };

          if (room.tournamentContext) {
            gameStateMessage.tournamentId = room.tournamentContext.tournamentId;
            gameStateMessage.matchId = room.tournamentContext.matchId;
            gameStateMessage.round = room.tournamentContext.round;
            gameStateMessage.matchNumber = room.tournamentContext.matchNumber;
          }

          socket.send(JSON.stringify(gameStateMessage));
          
        } else {
          console.warn(`[requestGameState] Room ${roomCode} not found or has no gameState`);
        }
      }
      break;
    }

    case 'leaveRoom': {
      const roomCode = message.payload?.roomCode;
      const isBack = message.payload?.back;

      if (roomCode) {
        gameManager.removePlayer(roomCode, userId, isBack);
      } else {
      }
      break;
    }

    case 'cancelSearch': {
      
      
      const removed = gameManager.removeFromMatchmakingQueue(userId);
      if (removed) {
        socket.send(JSON.stringify({ type: 'searchCancelled' }));
        
      } else {
        
        
        socket.send(JSON.stringify({ type: 'searchCancelled' }));
        
      }
      break;
    }

    case 'cancelFriendChallenge': {
      
      const challengeId = message.payload?.challengeId;

      if (!challengeId) {
        
        for (const [id, challenge] of gameManager.acceptedChallenges.entries()) {
          if (challenge.inviterId === userId || challenge.acceptorId === userId) {
            gameManager.acceptedChallenges.delete(id);
            
            socket.send(JSON.stringify({ type: 'searchCancelled' }));
            return;
          }
        }
        socket.send(JSON.stringify({ type: 'error', message: 'No active challenge found' }));
        return;
      }

      
      const challenge = gameManager.acceptedChallenges.get(challengeId);
      if (challenge && (challenge.inviterId === userId || challenge.acceptorId === userId)) {
        
        gameManager.acceptedChallenges.delete(challengeId);
        

        
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
      
      const roomCode = message.payload?.roomCode;
      const customization = message.payload?.customization || {};

      
      const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
      const user = getUserStmt.get(userId);

      if (!user) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'User not found'
        }));
        return;
      }

      
      
      let invitation = null;
      let inviterId = null;
      for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
        if (inv.roomCode === roomCode) {
          
          if (parseInt(friendId) === userId) {
            invitation = inv;
            inviterId = inv.from; 
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

      
      const result = gameManager.acceptFriendInvitation(
        userId, 
        inviterId, 
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
      
      break;
    }

    case 'declineInvitation': {
      
      const roomCode = message.payload?.roomCode;

      
      for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
        if (inv.roomCode === roomCode) {
          gameManager.declineFriendInvitation(friendId);
          break;
        }
      }
      break;
    }

    case 'rematch:request': {
      
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
      
      const action = message.action;
      const payload = message.payload || {};

      
      switch (action) {
        case 'inviteFriend': {
          
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

          
          const getUserStmt = db.prepare('SELECT username FROM users WHERE id_user = ?');
          const user = getUserStmt.get(userId);

          if (!user) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'User not found'
            }));
            return;
          }

          
          
          let invitation = null;
          let inviterId = null;
          for (const [friendId, inv] of gameManager.pendingInvitations.entries()) {
            if (inv.roomCode === roomCode) {
              
              if (parseInt(friendId) === userId) {
                invitation = inv;
                inviterId = inv.from; 
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

          
          const result = gameManager.acceptFriendInvitation(
            userId, 
            inviterId, 
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
          
          break;
        }

        case 'declineInvitation': {
          const roomCode = payload.roomCode;

          
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
      
      break;
  }
}

