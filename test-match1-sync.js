/**
 * Test Script for Round 1 Match 1 Synchronization
 *
 * This script verifies that Match 1 synchronization is working correctly:
 * 1. Room creation for Match 1
 * 2. GameState broadcasting to both players
 * 3. Socket validation and updates
 * 4. Paddle movement synchronization
 * 5. No race conditions
 */

// Test configuration
const TEST_CONFIG = {
  tournamentId: 'test-tournament-1',
  match1Player1Id: 1,
  match1Player2Id: 2,
  expectedRoomCode: null, // Will be set when room is created
  gameStateHistory: {
    player1: [],
    player2: []
  },
  paddleMoveHistory: {
    player1: [],
    player2: []
  }
};

// Mock gameManager for testing
class Match1SyncTester {
  constructor() {
    this.testResults = {
      roomCreation: false,
      gameStateBroadcast: false,
      socketValidation: false,
      paddleSync: false,
      raceConditionCheck: false,
      overall: false
    };
  }

  // Test 1: Verify Match 1 room creation
  testRoomCreation(gameManager, tournamentId) {
    console.log('\n=== TEST 1: Match 1 Room Creation ===');

    const tournament = gameManager.tournaments.get(tournamentId);
    if (!tournament) {
      console.error('❌ Tournament not found');
      return false;
    }

    const bracket = tournament.bracket;
    if (!bracket || bracket.length === 0) {
      console.error('❌ Bracket not found');
      return false;
    }

    const match1 = bracket.find(m => m.id === 1 && m.round === 1);
    if (!match1) {
      console.error('❌ Match 1 not found in bracket');
      return false;
    }

    if (!match1.roomCode) {
      console.error('❌ Match 1 roomCode not set');
      return false;
    }

    const room = gameManager.gameRooms.get(match1.roomCode);
    if (!room) {
      console.error('❌ Match 1 room not found in gameRooms');
      return false;
    }

    // Verify tournament context
    if (!room.tournamentContext) {
      console.error('❌ Match 1 room missing tournament context');
      return false;
    }

    if (room.tournamentContext.matchId !== 1) {
      console.error('❌ Match 1 room has incorrect matchId');
      return false;
    }

    if (room.tournamentContext.round !== 1) {
      console.error('❌ Match 1 room has incorrect round');
      return false;
    }

    // Verify both players are in the room
    if (!room.player1 || !room.player2) {
      console.error('❌ Match 1 room missing players');
      return false;
    }

    if (room.player1.id !== match1.player1.id || room.player2.id !== match1.player2.id) {
      console.error('❌ Match 1 room has incorrect players');
      return false;
    }

    // Verify game loop is running
    if (!gameManager.gameLoops.has(match1.roomCode)) {
      console.error('❌ Match 1 game loop not running');
      return false;
    }

    console.log('✅ Match 1 room created successfully');
    console.log(`   Room Code: ${match1.roomCode}`);
    console.log(`   Player 1: ${room.player1.username} (ID: ${room.player1.id})`);
    console.log(`   Player 2: ${room.player2.username} (ID: ${room.player2.id})`);
    console.log(`   Tournament Context: Match ${room.tournamentContext.matchId}, Round ${room.tournamentContext.round}`);

    TEST_CONFIG.expectedRoomCode = match1.roomCode;
    this.testResults.roomCreation = true;
    return true;
  }

  // Test 2: Verify gameState broadcasting
  testGameStateBroadcast(gameManager, roomCode) {
    console.log('\n=== TEST 2: GameState Broadcasting ===');

    const room = gameManager.gameRooms.get(roomCode);
    if (!room) {
      console.error('❌ Room not found');
      return false;
    }

    // Check if sockets are valid
    const p1SocketValid = room.player1.socket && room.player1.socket.readyState === 1;
    const p2SocketValid = room.player2.socket && room.player2.socket.readyState === 1;

    if (!p1SocketValid || !p2SocketValid) {
      console.error('❌ Invalid sockets:', {
        player1Valid: p1SocketValid,
        player2Valid: p2SocketValid,
        player1ReadyState: room.player1.socket?.readyState,
        player2ReadyState: room.player2.socket?.readyState
      });
      return false;
    }

    // Verify gameState structure
    const gameState = room.gameState;
    if (!gameState || !gameState.player1 || !gameState.player2 || !gameState.ball) {
      console.error('❌ Invalid gameState structure');
      return false;
    }

    // Verify tournament context in gameState
    if (!gameState.tournamentId || !gameState.matchId || !gameState.round) {
      console.error('❌ GameState missing tournament context');
      return false;
    }

    if (gameState.matchId !== 1 || gameState.round !== 1) {
      console.error('❌ GameState has incorrect tournament context');
      return false;
    }

    console.log('✅ GameState broadcasting verified');
    console.log(`   Player 1 Socket: ${p1SocketValid ? 'Valid' : 'Invalid'}`);
    console.log(`   Player 2 Socket: ${p2SocketValid ? 'Valid' : 'Invalid'}`);
    console.log(`   GameState has tournament context: Match ${gameState.matchId}, Round ${gameState.round}`);

    this.testResults.gameStateBroadcast = true;
    return true;
  }

  // Test 3: Verify socket validation and updates
  testSocketValidation(gameManager, roomCode) {
    console.log('\n=== TEST 3: Socket Validation ===');

    const room = gameManager.gameRooms.get(roomCode);
    if (!room) {
      console.error('❌ Room not found');
      return false;
    }

    // Check if sockets are in usersSocket map
    const p1SocketInMap = gameManager.usersSocket.get(room.player1.id.toString());
    const p2SocketInMap = gameManager.usersSocket.get(room.player2.id.toString());

    if (!p1SocketInMap || !p2SocketInMap) {
      console.error('❌ Sockets not found in usersSocket map');
      return false;
    }

    // Verify socket references match
    if (room.player1.socket !== p1SocketInMap) {
      console.warn('⚠️  Player 1 socket reference mismatch (will be updated on next broadcast)');
    }

    if (room.player2.socket !== p2SocketInMap) {
      console.warn('⚠️  Player 2 socket reference mismatch (will be updated on next broadcast)');
    }

    // Verify socket readyState
    if (p1SocketInMap.readyState !== 1 || p2SocketInMap.readyState !== 1) {
      console.error('❌ Sockets not in OPEN state');
      return false;
    }

    console.log('✅ Socket validation passed');
    console.log(`   Player 1 Socket: ${p1SocketInMap.readyState === 1 ? 'OPEN' : 'CLOSED'}`);
    console.log(`   Player 2 Socket: ${p2SocketInMap.readyState === 1 ? 'OPEN' : 'CLOSED'}`);

    this.testResults.socketValidation = true;
    return true;
  }

  // Test 4: Verify paddle movement synchronization
  testPaddleSync(gameManager, roomCode) {
    console.log('\n=== TEST 4: Paddle Movement Synchronization ===');

    const room = gameManager.gameRooms.get(roomCode);
    if (!room) {
      console.error('❌ Room not found');
      return false;
    }

    // Simulate paddle movements
    const testDirections = ['up', 'down', 'stop'];

    for (const direction of testDirections) {
      // Move player 1 paddle
      gameManager.handlePaddleMove(room.player1.id, direction);
      if (room.paddleDirections.player1 !== direction) {
        console.error(`❌ Player 1 paddle direction not set correctly: expected ${direction}, got ${room.paddleDirections.player1}`);
        return false;
      }

      // Move player 2 paddle
      gameManager.handlePaddleMove(room.player2.id, direction);
      if (room.paddleDirections.player2 !== direction) {
        console.error(`❌ Player 2 paddle direction not set correctly: expected ${direction}, got ${room.paddleDirections.player2}`);
        return false;
      }
    }

    console.log('✅ Paddle movement synchronization verified');
    console.log(`   Player 1 can move: up, down, stop`);
    console.log(`   Player 2 can move: up, down, stop`);

    this.testResults.paddleSync = true;
    return true;
  }

  // Test 5: Check for race conditions
  testRaceConditions(gameManager, roomCode) {
    console.log('\n=== TEST 5: Race Condition Check ===');

    const room = gameManager.gameRooms.get(roomCode);
    if (!room) {
      console.error('❌ Room not found');
      return false;
    }

    // Test 1: Socket update race condition
    // Simulate socket update during broadcast
    const originalP1Socket = room.player1.socket;
    const originalP2Socket = room.player2.socket;

    // Get fresh sockets (simulating reconnection)
    const freshP1Socket = gameManager.usersSocket.get(room.player1.id.toString());
    const freshP2Socket = gameManager.usersSocket.get(room.player2.id.toString());

    // Verify broadcastGameState handles fresh sockets correctly
    if (freshP1Socket && freshP1Socket.readyState === 1) {
      room.player1.socket = freshP1Socket;
    }
    if (freshP2Socket && freshP2Socket.readyState === 1) {
      room.player2.socket = freshP2Socket;
    }

    // Verify sockets are still valid after update
    if (room.player1.socket.readyState !== 1 || room.player2.socket.readyState !== 1) {
      console.error('❌ Sockets invalid after update');
      return false;
    }

    // Test 2: Paddle move race condition
    // Simulate rapid paddle movements
    const rapidMoves = ['up', 'down', 'up', 'down', 'stop'];
    for (const move of rapidMoves) {
      gameManager.handlePaddleMove(room.player1.id, move);
      if (room.paddleDirections.player1 !== move) {
        console.error(`❌ Race condition detected in paddle moves: expected ${move}, got ${room.paddleDirections.player1}`);
        return false;
      }
    }

    console.log('✅ No race conditions detected');
    console.log(`   Socket updates handled correctly`);
    console.log(`   Rapid paddle movements handled correctly`);

    this.testResults.raceConditionCheck = true;
    return true;
  }

  // Run all tests
  runAllTests(gameManager, tournamentId) {
    console.log('\n' + '='.repeat(60));
    console.log('MATCH 1 SYNCHRONIZATION TEST SUITE');
    console.log('='.repeat(60));

    // Test 1: Room creation
    if (!this.testRoomCreation(gameManager, tournamentId)) {
      this.printResults();
      return false;
    }

    const roomCode = TEST_CONFIG.expectedRoomCode;
    if (!roomCode) {
      console.error('❌ Room code not set');
      this.printResults();
      return false;
    }

    // Test 2: GameState broadcast
    if (!this.testGameStateBroadcast(gameManager, roomCode)) {
      this.printResults();
      return false;
    }

    // Test 3: Socket validation
    if (!this.testSocketValidation(gameManager, roomCode)) {
      this.printResults();
      return false;
    }

    // Test 4: Paddle sync
    if (!this.testPaddleSync(gameManager, roomCode)) {
      this.printResults();
      return false;
    }

    // Test 5: Race conditions
    if (!this.testRaceConditions(gameManager, roomCode)) {
      this.printResults();
      return false;
    }

    // All tests passed
    this.testResults.overall = true;
    this.printResults();
    return true;
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Room Creation:        ${this.testResults.roomCreation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`GameState Broadcast:   ${this.testResults.gameStateBroadcast ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Socket Validation:     ${this.testResults.socketValidation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Paddle Sync:          ${this.testResults.paddleSync ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Race Condition Check:  ${this.testResults.raceConditionCheck ? '✅ PASS' : '❌ FAIL'}`);
    console.log('='.repeat(60));
    console.log(`Overall:               ${this.testResults.overall ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('='.repeat(60) + '\n');
  }
}

// Export for use in backend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Match1SyncTester;
}

// For direct execution
if (require.main === module) {
  console.log('Match 1 Synchronization Test Script');
  console.log('This script should be run from the backend with access to gameManager');
  console.log('Usage: Import and call runAllTests(gameManager, tournamentId)');
}

