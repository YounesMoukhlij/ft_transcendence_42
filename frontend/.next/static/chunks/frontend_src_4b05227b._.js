(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/components/PingPongGame.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/GameContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/store/userStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const PADDLE_HEIGHT = 100;
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
const PADDLE_WIDTH = 16;
const BALL_RADIUS = 10;
const WINNING_SCORE = 5;
// Initial state for local game
const useLocalGameState = (players)=>{
    _s();
    const [gameState, setGameState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        scores: {
            player1: 0,
            player2: 0
        },
        paddles: [
            GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2
        ],
        ball: {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT / 2,
            vx: 5,
            vy: 5
        }
    });
    const resetGameState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocalGameState.useCallback[resetGameState]": ()=>{
            setGameState({
                scores: {
                    player1: 0,
                    player2: 0
                },
                paddles: [
                    GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                    GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2
                ],
                ball: {
                    x: GAME_WIDTH / 2,
                    y: GAME_HEIGHT / 2,
                    vx: Math.random() > 0.5 ? 5 : -5,
                    vy: Math.random() > 0.5 ? 5 : -5
                }
            });
        }
    }["useLocalGameState.useCallback[resetGameState]"], []);
    const updateGameState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocalGameState.useCallback[updateGameState]": (keysPressed)=>{
            setGameState({
                "useLocalGameState.useCallback[updateGameState]": (prev)=>{
                    // Paddles
                    const newPaddles = [
                        ...prev.paddles
                    ];
                    if (keysPressed['w']) newPaddles[0] -= 8;
                    if (keysPressed['s']) newPaddles[0] += 8;
                    if (keysPressed['ArrowUp']) newPaddles[1] -= 8;
                    if (keysPressed['ArrowDown']) newPaddles[1] += 8;
                    newPaddles[0] = Math.max(0, Math.min(newPaddles[0], GAME_HEIGHT - PADDLE_HEIGHT));
                    newPaddles[1] = Math.max(0, Math.min(newPaddles[1], GAME_HEIGHT - PADDLE_HEIGHT));
                    // Ball
                    let { x, y, vx, vy } = prev.ball;
                    x += vx;
                    y += vy;
                    // Wall collision
                    if (y - BALL_RADIUS < 0 || y + BALL_RADIUS > GAME_HEIGHT) {
                        vy = -vy;
                    }
                    // Paddle collision
                    if (x - BALL_RADIUS < 10 + PADDLE_WIDTH && x - BALL_RADIUS > 10 && y > newPaddles[0] && y < newPaddles[0] + PADDLE_HEIGHT) {
                        vx = -vx * 1.02;
                        x = 10 + PADDLE_WIDTH + BALL_RADIUS; // prevent sticking
                    }
                    if (x + BALL_RADIUS > GAME_WIDTH - PADDLE_WIDTH - 10 && x + BALL_RADIUS < GAME_WIDTH - 10 && y > newPaddles[1] && y < newPaddles[1] + PADDLE_HEIGHT) {
                        vx = -vx * 1.02;
                        x = GAME_WIDTH - PADDLE_WIDTH - 10 - BALL_RADIUS; // prevent sticking
                    }
                    const newScores = {
                        ...prev.scores
                    };
                    let ballReset = false;
                    // Score
                    if (x + BALL_RADIUS < 0) {
                        newScores.player2++;
                        ballReset = true;
                    } else if (x - BALL_RADIUS > GAME_WIDTH) {
                        newScores.player1++;
                        ballReset = true;
                    }
                    const newBall = ballReset ? {
                        x: GAME_WIDTH / 2,
                        y: GAME_HEIGHT / 2,
                        vx: Math.random() > 0.5 ? 5 : -5,
                        vy: Math.random() > 0.5 ? 2 : -2
                    } : {
                        x,
                        y,
                        vx,
                        vy
                    };
                    return {
                        scores: newScores,
                        paddles: newPaddles,
                        ball: newBall
                    };
                }
            }["useLocalGameState.useCallback[updateGameState]"]);
        }
    }["useLocalGameState.useCallback[updateGameState]"], []);
    return {
        ...gameState,
        updateGameState,
        resetGameState
    };
};
_s(useLocalGameState, "uEMTzKIOFtsO4jBLb/ElPJNJL08=");
const PingPongGame = (param)=>{
    let { serverGameState, opponentLeft, setServerGameState, rematchDeclinedMessage, setRematchDeclinedMessage, rematchOffer, handleAcceptRematch, tournamentMode = false, tournamentPlayers = [], onTournamentMatchEnd } = param;
    var _localPlayers_, _localPlayers_1;
    _s1();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const keysPressed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"])();
    const { user, socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Unified state
    const [winner, setWinner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rematchRequested, setRematchRequested] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Local game state
    const localPlayers = tournamentMode ? tournamentPlayers : [];
    const { scores, paddles, ball, updateGameState, resetGameState } = useLocalGameState(localPlayers);
    // Reset game state for new tournament match
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            if (tournamentMode) {
                setWinner(null);
                resetGameState();
                keysPressed.current = {};
            }
        }
    }["PingPongGame.useEffect"], [
        tournamentPlayers,
        tournamentMode,
        resetGameState
    ]); // Key dependency
    // Keyboard controls for local and remote
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const handleKeyDown = {
                "PingPongGame.useEffect.handleKeyDown": (e)=>{
                    if (winner) return;
                    if (tournamentMode) {
                        keysPressed.current[e.key] = true;
                    } else {
                        if (e.key === 'w' || e.key === 'ArrowUp') {
                            if (socket && socket.readyState === WebSocket.OPEN) {
                                socket.send(JSON.stringify({
                                    type: 'paddleMove',
                                    payload: {
                                        direction: 'up'
                                    }
                                }));
                            }
                        } else if (e.key === 's' || e.key === 'ArrowDown') {
                            if (socket && socket.readyState === WebSocket.OPEN) {
                                socket.send(JSON.stringify({
                                    type: 'paddleMove',
                                    payload: {
                                        direction: 'down'
                                    }
                                }));
                            }
                        }
                    }
                }
            }["PingPongGame.useEffect.handleKeyDown"];
            const handleKeyUp = {
                "PingPongGame.useEffect.handleKeyUp": (e)=>{
                    if (winner) return;
                    if (tournamentMode) {
                        keysPressed.current[e.key] = false;
                    } else {
                        if (e.key === 'w' || e.key === 'ArrowUp' || e.key === 's' || e.key === 'ArrowDown') {
                            if (socket && socket.readyState === WebSocket.OPEN) {
                                socket.send(JSON.stringify({
                                    type: 'paddleMove',
                                    payload: {
                                        direction: 'stop'
                                    }
                                }));
                            }
                        }
                    }
                }
            }["PingPongGame.useEffect.handleKeyUp"];
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            return ({
                "PingPongGame.useEffect": ()=>{
                    window.removeEventListener('keydown', handleKeyDown);
                    window.removeEventListener('keyup', handleKeyUp);
                }
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], [
        socket,
        user,
        winner,
        tournamentMode
    ]);
    // Game loop for local tournament
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            if (!tournamentMode || winner) return;
            const gameLoop = setInterval({
                "PingPongGame.useEffect.gameLoop": ()=>{
                    updateGameState(keysPressed.current);
                }
            }["PingPongGame.useEffect.gameLoop"], 1000 / 60); // 60 FPS
            return ({
                "PingPongGame.useEffect": ()=>clearInterval(gameLoop)
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], [
        tournamentMode,
        winner,
        updateGameState
    ]);
    // Check for winner in local tournament
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            if (!winner && tournamentMode && onTournamentMatchEnd && localPlayers.length >= 2) {
                if (scores.player1 >= WINNING_SCORE) {
                    setWinner(localPlayers[0].name);
                    onTournamentMatchEnd(localPlayers[0]);
                } else if (scores.player2 >= WINNING_SCORE) {
                    setWinner(localPlayers[1].name);
                    onTournamentMatchEnd(localPlayers[1]);
                }
            }
        }
    }["PingPongGame.useEffect"], [
        scores,
        tournamentMode,
        onTournamentMatchEnd,
        localPlayers,
        winner
    ]);
    // Check for winner in remote game
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            if (!tournamentMode && serverGameState) {
                if (serverGameState.player1.score >= WINNING_SCORE) {
                    setWinner(serverGameState.player1.username);
                } else if (serverGameState.player2.score >= WINNING_SCORE) {
                    setWinner(serverGameState.player2.username);
                }
            }
        }
    }["PingPongGame.useEffect"], [
        serverGameState,
        tournamentMode
    ]);
    // Drawing logic (works for both modes)
    const draw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PingPongGame.useCallback[draw]": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            if (tournamentMode) {
                const { customisation } = gameState;
                // Local Tournament Draw
                ctx.fillStyle = (customisation === null || customisation === void 0 ? void 0 : customisation.tableBg) || '#333';
                ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                ctx.beginPath();
                ctx.setLineDash([
                    10,
                    10
                ]);
                ctx.moveTo(GAME_WIDTH / 2, 0);
                ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = (customisation === null || customisation === void 0 ? void 0 : customisation.paddleColor) || '#ff0000';
                ctx.fillRect(10, paddles[0], PADDLE_WIDTH, PADDLE_HEIGHT);
                ctx.fillStyle = (customisation === null || customisation === void 0 ? void 0 : customisation.paddleColor) || '#0000ff';
                ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, paddles[1], PADDLE_WIDTH, PADDLE_HEIGHT);
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = (customisation === null || customisation === void 0 ? void 0 : customisation.ballColor) || '#fff';
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '45px Arial';
                ctx.fillText(scores.player1.toString(), GAME_WIDTH / 2 - 100, 50);
                ctx.fillText(scores.player2.toString(), GAME_WIDTH / 2 + 60, 50);
            } else if (serverGameState) {
                // Remote Game Draw
                const { player1, player2, ball: remoteBall } = serverGameState;
                const p1Custom = player1.customization;
                const p2Custom = player2.customization;
                ctx.fillStyle = (p1Custom === null || p1Custom === void 0 ? void 0 : p1Custom.tableBg) || '#333';
                ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                ctx.beginPath();
                ctx.setLineDash([
                    10,
                    10
                ]);
                ctx.moveTo(GAME_WIDTH / 2, 0);
                ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = (p1Custom === null || p1Custom === void 0 ? void 0 : p1Custom.paddleColor) || '#ff0000';
                ctx.fillRect(10, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
                ctx.fillStyle = (p2Custom === null || p2Custom === void 0 ? void 0 : p2Custom.paddleColor) || '#0000ff';
                ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT);
                ctx.beginPath();
                ctx.arc(remoteBall.x, remoteBall.y, BALL_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = (p1Custom === null || p1Custom === void 0 ? void 0 : p1Custom.ballColor) || '#fff';
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '45px Arial';
                ctx.fillText(player1.score.toString(), GAME_WIDTH / 2 - 100, 50);
                ctx.fillText(player2.score.toString(), GAME_WIDTH / 2 + 60, 50);
            }
        }
    }["PingPongGame.useCallback[draw]"], [
        serverGameState,
        tournamentMode,
        paddles,
        ball,
        scores
    ]);
    // Render loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const render = {
                "PingPongGame.useEffect.render": ()=>{
                    draw();
                    requestAnimationFrame(render);
                }
            }["PingPongGame.useEffect.render"];
            const animationFrameId = requestAnimationFrame(render);
            return ({
                "PingPongGame.useEffect": ()=>cancelAnimationFrame(animationFrameId)
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], [
        draw
    ]);
    // --- UI Rendering ---
    const handleExit = ()=>{
        // In tournament mode, we don't exit, the parent component handles it
        if (!tournamentMode) {
            router.push('/game');
        }
    };
    const handleRematchRequest = ()=>{
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'rematch:request'
            }));
            setRematchRequested(true);
            if (setRematchDeclinedMessage) setRematchDeclinedMessage('');
        }
    };
    if (opponentLeft) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-white text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "Your opponent has left the game."
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 344,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleExit,
                    className: "mt-4 px-4 py-2 bg-blue-500 rounded",
                    children: "Back to Game Lobby"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 345,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/components/PingPongGame.tsx",
            lineNumber: 343,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Winner screen for remote game
    if (winner && !tournamentMode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-white text-center p-8 bg-gray-800 rounded-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-4xl font-bold mb-4",
                    children: "Game Over"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 354,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-2xl mt-4 mb-6",
                    children: [
                        winner,
                        " is the winner!"
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 355,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                rematchDeclinedMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-400 mb-4",
                    children: rematchDeclinedMessage
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 357,
                    columnNumber: 36
                }, ("TURBOPACK compile-time value", void 0)),
                rematchOffer ? handleAcceptRematch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleAcceptRematch,
                    className: "mt-4 px-6 py-3 bg-yellow-500 rounded-lg text-lg hover:bg-yellow-600 transition-colors",
                    children: "Accept Rematch"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 361,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : rematchRequested ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-yellow-400",
                    children: "Waiting for opponent to accept..."
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 365,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleRematchRequest,
                    className: "mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors",
                    children: "Request Rematch"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 367,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleExit,
                    className: "mt-4 ml-4 px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors",
                    children: "Back to Game Lobby"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/components/PingPongGame.tsx",
            lineNumber: 353,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Loading/initial state for remote game
    if (!tournamentMode && !serverGameState) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-white",
            children: "Connecting to game..."
        }, void 0, false, {
            fileName: "[project]/frontend/src/components/PingPongGame.tsx",
            lineNumber: 381,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Main game display
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between w-full max-w-4xl mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white text-xl",
                        children: tournamentMode ? (_localPlayers_ = localPlayers[0]) === null || _localPlayers_ === void 0 ? void 0 : _localPlayers_.name : serverGameState === null || serverGameState === void 0 ? void 0 : serverGameState.player1.username
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white text-xl",
                        children: tournamentMode ? (_localPlayers_1 = localPlayers[1]) === null || _localPlayers_1 === void 0 ? void 0 : _localPlayers_1.name : serverGameState === null || serverGameState === void 0 ? void 0 : serverGameState.player2.username
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                lineNumber: 387,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                className: "bg-gray-800 rounded-lg shadow-lg"
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                lineNumber: 395,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Player 1: W/S keys. Player 2: Up/Down Arrow keys."
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                        lineNumber: 402,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "First to ",
                            WINNING_SCORE,
                            " points wins!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/components/PingPongGame.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/components/PingPongGame.tsx",
        lineNumber: 386,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(PingPongGame, "YgOp7QpUJmK9Huy0xqBjJIpa094=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        useLocalGameState
    ];
});
_c = PingPongGame;
const __TURBOPACK__default__export__ = PingPongGame;
var _c;
__turbopack_context__.k.register(_c, "PingPongGame");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/app/(protected)/game/local/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocalGamePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/GameContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/PingPongGame.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LocalGamePage() {
    var _gameState_players_;
    _s();
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Set page title
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocalGamePage.useEffect": ()=>{
            document.title = 'Local Multiplayer Ping Pong';
        }
    }["LocalGamePage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocalGamePage.useEffect": ()=>{
            var _gameState_players_;
            if (!gameState.players || !((_gameState_players_ = gameState.players[1]) === null || _gameState_players_ === void 0 ? void 0 : _gameState_players_.name)) {
                router.replace('/game/player2');
            }
        }
    }["LocalGamePage.useEffect"], [
        gameState.players,
        router
    ]);
    if (!gameState.players || !((_gameState_players_ = gameState.players[1]) === null || _gameState_players_ === void 0 ? void 0 : _gameState_players_.name)) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-[100%] w-[100%] ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-[90%] h-[80%]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/frontend/src/app/(protected)/game/local/page.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/(protected)/game/local/page.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/game'),
                    className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200",
                    children: "Back to Game Modes"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/app/(protected)/game/local/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/(protected)/game/local/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/app/(protected)/game/local/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(LocalGamePage, "JSOnyGZuK/OkXMcDx1JDS6LdJdc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LocalGamePage;
var _c;
__turbopack_context__.k.register(_c, "LocalGamePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_4b05227b._.js.map