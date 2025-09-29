(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/PingPongGame.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const PingPongGame = ({ tournamentMode = false, tournamentPlayers = [], onTournamentMatchEnd })=>{
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"])();
    const { tableBg, paddleColor, ballColor } = gameState.customisation || {};
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Use tournament players if provided, otherwise use game state players
    const currentPlayers = tournamentMode && tournamentPlayers.length === 2 ? tournamentPlayers : gameState.players;
    const [localGameState, setLocalGameState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ball: {
            x: 400,
            y: 300,
            dx: 3,
            dy: 2,
            radius: 8
        },
        leftPaddle: {
            y: 250,
            height: 100,
            width: 16,
            speed: 0
        },
        rightPaddle: {
            y: 250,
            height: 100,
            width: 16,
            speed: 0
        },
        score: {
            left: 0,
            right: 0
        },
        gameStarted: false,
        winner: null
    });
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showWinnerMessage, setShowWinnerMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [winnerMessageVisible, setWinnerMessageVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Set canvas size to match the table size
    const tableW = 900;
    const tableH = 340;
    const canvasWidth = tableW;
    const canvasHeight = tableH;
    const tableX = 0;
    const tableY = 0;
    const tableRadius = 16;
    // Paddle and ball constants
    const paddleWidth = 16;
    const paddleHeight = 70; // smaller paddles
    const ballRadius = 8;
    // Update gameWidth/gameHeight/gameX/gameY to match table
    const gameWidth = tableW;
    const gameHeight = tableH;
    const gameX = 0;
    const gameY = 0;
    const paddleSpeed = 8;
    const aiPaddleSpeed = 5; // Reduced from 7 to 5 to make AI slower
    const paddleRadius = 8; // Radius for rounded corners
    const keysPressed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Add horizontal padding for paddles
    const paddlePadding = 20;
    // Initialize game based on mode - but don't start automatically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const initializeGame = {
                "PingPongGame.useEffect.initializeGame": ()=>{
                    setLocalGameState({
                        "PingPongGame.useEffect.initializeGame": (prev)=>({
                                ...prev,
                                gameStarted: false
                            })
                    }["PingPongGame.useEffect.initializeGame"]);
                }
            }["PingPongGame.useEffect.initializeGame"];
            initializeGame();
        }
    }["PingPongGame.useEffect"], [
        gameState.mode
    ]);
    // Reset game state when tournament players change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            if (tournamentMode && tournamentPlayers.length === 2) {
                setLocalGameState({
                    ball: {
                        x: 400,
                        y: 300,
                        dx: 3,
                        dy: 2,
                        radius: 8
                    },
                    leftPaddle: {
                        y: 250,
                        height: 100,
                        width: 16,
                        speed: 0
                    },
                    rightPaddle: {
                        y: 250,
                        height: 100,
                        width: 16,
                        speed: 0
                    },
                    score: {
                        left: 0,
                        right: 0
                    },
                    gameStarted: false,
                    winner: null
                });
                setShowWinnerMessage(false);
                setWinnerMessageVisible(false);
            }
        }
    }["PingPongGame.useEffect"], [
        tournamentMode,
        tournamentPlayers
    ]);
    // Handle keyboard input
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const handleKeyDown = {
                "PingPongGame.useEffect.handleKeyDown": (e)=>{
                    keysPressed.current.add(e.key);
                }
            }["PingPongGame.useEffect.handleKeyDown"];
            const handleKeyUp = {
                "PingPongGame.useEffect.handleKeyUp": (e)=>{
                    keysPressed.current.delete(e.key);
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
    }["PingPongGame.useEffect"], []);
    // Keyboard shortcut for pause/unpause (P)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const handlePauseKey = {
                "PingPongGame.useEffect.handlePauseKey": (e)=>{
                    if (e.key === 'p' || e.key === 'P') {
                        setPaused({
                            "PingPongGame.useEffect.handlePauseKey": (prev)=>!prev
                        }["PingPongGame.useEffect.handlePauseKey"]);
                    }
                }
            }["PingPongGame.useEffect.handlePauseKey"];
            window.addEventListener('keydown', handlePauseKey);
            return ({
                "PingPongGame.useEffect": ()=>window.removeEventListener('keydown', handlePauseKey)
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], []);
    // Toggle winner message visibility
    const toggleWinnerMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PingPongGame.useCallback[toggleWinnerMessage]": ()=>{
            if (showWinnerMessage) {
                setWinnerMessageVisible(!winnerMessageVisible);
            }
        }
    }["PingPongGame.useCallback[toggleWinnerMessage]"], [
        showWinnerMessage,
        winnerMessageVisible
    ]);
    // Start the game
    const startGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PingPongGame.useCallback[startGame]": ()=>{
            setLocalGameState({
                "PingPongGame.useCallback[startGame]": (prev)=>({
                        ...prev,
                        gameStarted: true
                    })
            }["PingPongGame.useCallback[startGame]"]);
        }
    }["PingPongGame.useCallback[startGame]"], []);
    // Keyboard shortcut for winner message toggle (T) - disabled in tournament mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const handleToggleKey = {
                "PingPongGame.useEffect.handleToggleKey": (e)=>{
                    if ((e.key === 't' || e.key === 'T') && showWinnerMessage && !tournamentMode) {
                        toggleWinnerMessage();
                    }
                }
            }["PingPongGame.useEffect.handleToggleKey"];
            window.addEventListener('keydown', handleToggleKey);
            return ({
                "PingPongGame.useEffect": ()=>window.removeEventListener('keydown', handleToggleKey)
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], [
        showWinnerMessage,
        toggleWinnerMessage,
        tournamentMode
    ]);
    // Game loop
    const gameLoop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PingPongGame.useCallback[gameLoop]": ()=>{
            if (paused || !localGameState.gameStarted || localGameState.winner) return;
            setLocalGameState({
                "PingPongGame.useCallback[gameLoop]": (prev)=>{
                    let newState = {
                        ...prev
                    };
                    // --- Paddle movement ---
                    // Left paddle (W/S)
                    if (keysPressed.current.has('w') || keysPressed.current.has('W')) {
                        newState.leftPaddle.y = Math.max(0, newState.leftPaddle.y - paddleSpeed);
                    }
                    if (keysPressed.current.has('s') || keysPressed.current.has('S')) {
                        newState.leftPaddle.y = Math.min(gameHeight - paddleHeight, newState.leftPaddle.y + paddleSpeed);
                    }
                    // Right paddle (AI or Arrow keys)
                    if (gameState.mode === 'ai' && !tournamentMode) {
                        // AI: Make it smoother and easier to beat
                        const paddleCenter = newState.rightPaddle.y + paddleHeight / 2;
                        const target = newState.ball.y;
                        // 70% of the time, AI makes mistakes
                        if (Math.random() < 0.7) {
                            // Add prediction error and delayed reaction
                            const error = (Math.random() - 0.5) * 100; // Increased error range
                            const reactionDelay = 30; // Add delay to AI reactions
                            if (paddleCenter < target + error - reactionDelay) {
                                newState.rightPaddle.y = Math.min(gameHeight - paddleHeight, newState.rightPaddle.y + aiPaddleSpeed * 0.7 // 70% of normal speed
                                );
                            } else if (paddleCenter > target + error + reactionDelay) {
                                newState.rightPaddle.y = Math.max(0, newState.rightPaddle.y - aiPaddleSpeed * 0.7);
                            }
                        } else {
                            // 30% of the time, AI plays normally but still not perfect
                            if (paddleCenter < target - 15) {
                                newState.rightPaddle.y = Math.min(gameHeight - paddleHeight, newState.rightPaddle.y + aiPaddleSpeed);
                            } else if (paddleCenter > target + 15) {
                                newState.rightPaddle.y = Math.max(0, newState.rightPaddle.y - aiPaddleSpeed);
                            }
                        }
                        // Add slight randomness less frequently (reduced from 0.2 to 0.1)
                        if (Math.random() < 0.1) {
                            // Reduced random movement magnitude (from 16 to 8)
                            newState.rightPaddle.y += (Math.random() - 0.5) * 8;
                            newState.rightPaddle.y = Math.max(0, Math.min(gameHeight - paddleHeight, newState.rightPaddle.y));
                        }
                    } else {
                        if (keysPressed.current.has('ArrowUp')) {
                            newState.rightPaddle.y = Math.max(0, newState.rightPaddle.y - paddleSpeed);
                        }
                        if (keysPressed.current.has('ArrowDown')) {
                            newState.rightPaddle.y = Math.min(gameHeight - paddleHeight, newState.rightPaddle.y + paddleSpeed);
                        }
                    }
                    // --- Ball movement ---
                    newState.ball.x += newState.ball.dx;
                    newState.ball.y += newState.ball.dy;
                    // --- Ball collision with top/bottom walls ---
                    if (newState.ball.y - ballRadius <= 0) {
                        newState.ball.y = ballRadius;
                        newState.ball.dy = -newState.ball.dy;
                    }
                    if (newState.ball.y + ballRadius >= gameHeight) {
                        newState.ball.y = gameHeight - ballRadius;
                        newState.ball.dy = -newState.ball.dy;
                    }
                    // --- Ball collision with left paddle ---
                    if (newState.ball.x - ballRadius <= paddleWidth && newState.ball.x - ballRadius >= 0 && newState.ball.y + ballRadius >= newState.leftPaddle.y && newState.ball.y - ballRadius <= newState.leftPaddle.y + paddleHeight) {
                        newState.ball.x = paddleWidth + ballRadius;
                        newState.ball.dx = Math.abs(newState.ball.dx);
                        // Add a little angle based on where it hit the paddle
                        const hitPos = (newState.ball.y - (newState.leftPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
                        newState.ball.dy = 4 * hitPos;
                    }
                    // --- Ball collision with right paddle ---
                    if (newState.ball.x + ballRadius >= gameWidth - paddleWidth && newState.ball.x + ballRadius <= gameWidth && newState.ball.y + ballRadius >= newState.rightPaddle.y && newState.ball.y - ballRadius <= newState.rightPaddle.y + paddleHeight) {
                        newState.ball.x = gameWidth - paddleWidth - ballRadius;
                        newState.ball.dx = -Math.abs(newState.ball.dx);
                        // Add a little angle based on where it hit the paddle
                        const hitPos = (newState.ball.y - (newState.rightPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
                        newState.ball.dy = 4 * hitPos;
                    }
                    // --- Scoring ---
                    // Only score once when ball crosses the boundary
                    if (newState.ball.x < 0 && newState.ball.dx < 0) {
                        newState.score.right++;
                        // Reset ball to center
                        newState.ball = {
                            x: gameWidth / 2,
                            y: gameHeight / 2,
                            dx: Math.abs(newState.ball.dx),
                            dy: (Math.random() - 0.5) * 4,
                            radius: ballRadius
                        };
                    } else if (newState.ball.x > gameWidth && newState.ball.dx > 0) {
                        newState.score.left++;
                        // Reset ball to center
                        newState.ball = {
                            x: gameWidth / 2,
                            y: gameHeight / 2,
                            dx: -Math.abs(newState.ball.dx),
                            dy: (Math.random() - 0.5) * 4,
                            radius: ballRadius
                        };
                    }
                    // --- Win condition ---
                    const winningScore = 1; // First to score wins
                    if (newState.score.left >= winningScore) {
                        newState.score.left = winningScore; // Cap the score at 1
                        newState.winner = currentPlayers[0]?.name || 'Player 1';
                    } else if (newState.score.right >= winningScore) {
                        newState.score.right = winningScore; // Cap the score at 1
                        newState.winner = gameState.mode === 'ai' && !tournamentMode ? 'AI Opponent' : currentPlayers[1]?.name || 'Player 2';
                    }
                    // --- Sync paddle/ball state for rendering ---
                    newState.leftPaddle.width = paddleWidth;
                    newState.leftPaddle.height = paddleHeight;
                    newState.rightPaddle.width = paddleWidth;
                    newState.rightPaddle.height = paddleHeight;
                    newState.ball.radius = ballRadius;
                    return newState;
                }
            }["PingPongGame.useCallback[gameLoop]"]);
        }
    }["PingPongGame.useCallback[gameLoop]"], [
        paused,
        localGameState.gameStarted,
        localGameState.winner,
        gameState.mode,
        tournamentMode,
        currentPlayers
    ]);
    // Removed automatic tournament progression to prevent infinite loops
    // Handle winner message display - manual progression only for tournament mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            if (localGameState.winner) {
                if (tournamentMode) {
                    // For tournament mode, show winner message but require manual progression
                    setShowWinnerMessage(true);
                    setWinnerMessageVisible(true);
                // No auto-progression - user must click "Next Round" button
                } else {
                    // For non-tournament games, show the winner message
                    setShowWinnerMessage(true);
                    setWinnerMessageVisible(true);
                    const hideTimeout = setTimeout({
                        "PingPongGame.useEffect.hideTimeout": ()=>{
                            setWinnerMessageVisible(false);
                            setTimeout({
                                "PingPongGame.useEffect.hideTimeout": ()=>setShowWinnerMessage(false)
                            }["PingPongGame.useEffect.hideTimeout"], 300); // Wait for fade out animation
                        }
                    }["PingPongGame.useEffect.hideTimeout"], 5000);
                    return ({
                        "PingPongGame.useEffect": ()=>clearTimeout(hideTimeout)
                    })["PingPongGame.useEffect"];
                }
            }
        }
    }["PingPongGame.useEffect"], [
        localGameState.winner,
        tournamentMode
    ]);
    // Render game
    const renderGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PingPongGame.useCallback[renderGame]": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            // --- 1. Draw table background (custom or default) ---
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            const customBg = gameState.customisation?.tableBg;
            if (customBg) {
                if (customBg.startsWith('linear-gradient')) {
                    const match = customBg.match(/linear-gradient\(135deg,\s*([^,]+),\s*([^,]+)(?:,\s*([^,]+))?\)/);
                    if (match) {
                        const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
                        grad.addColorStop(0, match[1].trim());
                        grad.addColorStop(0.5, match[3] ? match[2].trim() : match[2].trim());
                        grad.addColorStop(1, match[3] ? match[3].trim() : match[2].trim());
                        ctx.fillStyle = grad;
                    } else {
                        ctx.fillStyle = customBg;
                    }
                } else {
                    ctx.fillStyle = customBg;
                }
            } else {
                ctx.fillStyle = 'rgba(75, 85, 99, 0.9)'; // default gray-600
            }
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            // --- 2. Draw white rounded table border only (no background fill) ---
            ctx.save();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.roundRect(tableX, tableY, tableW, tableH, tableRadius);
            ctx.stroke();
            ctx.restore();
            // --- 3. Draw thick dashed gray center line ---
            ctx.save();
            ctx.setLineDash([
                18,
                18
            ]);
            ctx.strokeStyle = '#bdbdbd';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(canvasWidth / 2, tableY + 10);
            ctx.lineTo(canvasWidth / 2, tableY + tableH - 10);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
            // --- 4. Draw 3D paddles (custom color) ---
            ctx.save();
            // Left paddle
            const leftPaddleX = gameX + paddlePadding;
            const leftPaddleY = gameY + localGameState.leftPaddle.y;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.beginPath();
            ctx.roundRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight, 8);
            ctx.fillStyle = gameState.customisation?.paddleColor || '#f87171';
            ctx.fill();
            ctx.restore();
            // Right paddle
            const rightPaddleX = gameX + gameWidth - paddleWidth - paddlePadding;
            const rightPaddleY = gameY + localGameState.rightPaddle.y;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = -4;
            ctx.shadowOffsetY = 4;
            ctx.beginPath();
            ctx.roundRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight, 8);
            ctx.fillStyle = gameState.customisation?.paddleColor || '#60a5fa';
            ctx.fill();
            ctx.restore();
            ctx.restore();
            // --- 5. Draw 3D ball (custom color) ---
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            const ballX = gameX + localGameState.ball.x;
            const ballY = gameY + localGameState.ball.y;
            const ballR = ballRadius;
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
            ctx.fillStyle = gameState.customisation?.ballColor || '#fff';
            ctx.fill();
            ctx.restore();
            // --- 6. Draw large gray score ---
            ctx.save();
            ctx.fillStyle = '#e0e0e0';
            ctx.font = 'bold 54px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(0,0,0,0.18)';
            ctx.shadowBlur = 2;
            ctx.fillText(localGameState.score.left.toString(), tableX + tableW * 0.18, tableY + 18);
            ctx.fillText(localGameState.score.right.toString(), tableX + tableW * 0.82, tableY + 18);
            // Draw player names with enhanced styling
            ctx.save();
            // Left player name
            ctx.font = tournamentMode ? 'bold 18px Arial' : 'bold 16px Arial';
            ctx.fillStyle = tournamentMode ? '#fbbf24' : '#e5e7eb'; // Gold for tournament, light gray for regular
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText(currentPlayers[0]?.name || 'Player 1', tableX + tableW * 0.18, tableY + 85);
            ctx.fillText(currentPlayers[0]?.name || 'Player 1', tableX + tableW * 0.18, tableY + 85);
            // Right player name
            ctx.fillStyle = tournamentMode ? '#fbbf24' : '#e5e7eb'; // Gold for tournament, light gray for regular
            ctx.strokeText(gameState.mode === 'ai' && !tournamentMode ? 'AI Opponent' : currentPlayers[1]?.name || 'Player 2', tableX + tableW * 0.82, tableY + 85);
            ctx.fillText(gameState.mode === 'ai' && !tournamentMode ? 'AI Opponent' : currentPlayers[1]?.name || 'Player 2', tableX + tableW * 0.82, tableY + 85);
            ctx.restore();
            // --- 7. Draw winner overlay if needed (only for non-tournament games) ---
            if (localGameState.winner && !tournamentMode) {
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(tableX, tableY, tableW, tableH);
                ctx.fillStyle = '#fff';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${localGameState.winner} Wins!`, canvasWidth / 2, canvasHeight / 2);
                // Only show restart text in non-tournament mode
                if (!tournamentMode) {
                    ctx.font = '24px Arial';
                    ctx.fillText('Press R to restart', canvasWidth / 2, canvasHeight / 2 + 40);
                }
                ctx.restore();
            }
        }
    }["PingPongGame.useCallback[renderGame]"], [
        localGameState,
        gameState.mode
    ]);
    // Game loop and rendering
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const interval = setInterval({
                "PingPongGame.useEffect.interval": ()=>{
                    gameLoop();
                }
            }["PingPongGame.useEffect.interval"], 16); // ~60 FPS
            return ({
                "PingPongGame.useEffect": ()=>clearInterval(interval)
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], [
        gameLoop
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            renderGame();
        }
    }["PingPongGame.useEffect"], [
        renderGame
    ]);
    // Handle restart (only for non-tournament games)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PingPongGame.useEffect": ()=>{
            const handleKeyPress = {
                "PingPongGame.useEffect.handleKeyPress": (e)=>{
                    if (e.key === 'r' && localGameState.winner && !tournamentMode) {
                        setLocalGameState({
                            ball: {
                                x: 400,
                                y: 300,
                                dx: 3,
                                dy: 2,
                                radius: 8
                            },
                            leftPaddle: {
                                y: 250,
                                height: 100,
                                width: 16,
                                speed: 0
                            },
                            rightPaddle: {
                                y: 250,
                                height: 100,
                                width: 16,
                                speed: 0
                            },
                            score: {
                                left: 0,
                                right: 0
                            },
                            gameStarted: false,
                            winner: null
                        });
                        setPaused(false);
                        setShowWinnerMessage(false);
                        setWinnerMessageVisible(false);
                    }
                }
            }["PingPongGame.useEffect.handleKeyPress"];
            window.addEventListener('keypress', handleKeyPress);
            return ({
                "PingPongGame.useEffect": ()=>window.removeEventListener('keypress', handleKeyPress)
            })["PingPongGame.useEffect"];
        }
    }["PingPongGame.useEffect"], [
        localGameState.winner,
        tournamentMode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-full w-full relative",
        children: [
            !paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setPaused(true),
                    className: "z-40 flex items-center justify-center fixed left-1/2 -translate-x-1/2 bottom-25 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-10 md:bottom-auto px-3 py-2 md:px-6 md:py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-base md:text-lg font-bold",
                    style: {
                        minWidth: '36px',
                        minHeight: '36px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPause"], {
                        className: "w-4 h-4 md:w-6 md:h-6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 624,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/PingPongGame.tsx",
                    lineNumber: 619,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 618,
                columnNumber: 9
            }, this),
            paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center z-30",
                style: {
                    background: "rgba(0,0,0,0.6)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-4xl text-white font-bold mb-8",
                        children: "Paused"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 634,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setPaused(false),
                        className: "px-8 py-4 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-2xl font-bold z-40 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaPlay"], {
                            className: "w-8 h-8"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 639,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 635,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 630,
                columnNumber: 9
            }, this),
            showWinnerMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 flex flex-col items-center justify-center z-40 transition-all duration-300 ${winnerMessageVisible ? 'opacity-100' : 'opacity-0'}`,
                style: {
                    background: "rgba(0,0,0,0.8)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-3xl shadow-2xl border-4 border-yellow-400 p-8 text-center relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setWinnerMessageVisible(false);
                                setTimeout(()=>setShowWinnerMessage(false), 300);
                            },
                            className: "absolute top-4 right-4 text-white hover:text-yellow-200 text-3xl font-bold leading-none transition-colors duration-200",
                            "aria-label": "Close",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 654,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTrophy"], {
                            className: "w-20 h-20 text-yellow-300 mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 665,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-4xl md:text-6xl font-bold text-white mb-4",
                            children: [
                                "🎉 ",
                                localGameState.winner,
                                " Wins! 🎉"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 666,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl md:text-2xl text-yellow-200 mb-6",
                            children: tournamentMode ? 'Match completed!' : 'Congratulations on your victory!'
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 669,
                            columnNumber: 13
                        }, this),
                        tournamentMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    // Call the tournament callback if provided
                                    if (onTournamentMatchEnd && tournamentPlayers.length === 2) {
                                        const winnerPlayer = tournamentPlayers.find((p)=>p.name === localGameState.winner);
                                        if (winnerPlayer) {
                                            onTournamentMatchEnd(winnerPlayer);
                                        }
                                    }
                                    // Close the winner message
                                    setWinnerMessageVisible(false);
                                    setShowWinnerMessage(false);
                                },
                                className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105",
                                children: "Next Round →"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 676,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 675,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row justify-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleWinnerMessage,
                                    className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105",
                                    children: winnerMessageVisible ? 'Hide Message' : 'Show Message'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PingPongGame.tsx",
                                    lineNumber: 697,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const event = new KeyboardEvent('keypress', {
                                            key: 'r'
                                        });
                                        window.dispatchEvent(event);
                                    },
                                    className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105",
                                    children: "Play Again (R)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PingPongGame.tsx",
                                    lineNumber: 703,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 696,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/PingPongGame.tsx",
                    lineNumber: 652,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 646,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 right-0 flex flex-wrap justify-between items-center px-2 md:px-10 lg:px-22",
                style: {
                    top: 0,
                    minHeight: '70px',
                    pointerEvents: 'none',
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-2 min-w-[120px]",
                        children: [
                            currentPlayers && currentPlayers[0]?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: currentPlayers[0].avatar,
                                alt: "Player 1",
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white bg-gray-700 object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 723,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUserCircle"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 725,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white text-base xs:text-lg sm:text-xl md:text-2xl pl-2 sm:pl-5 md:pl-7 font-bold drop-shadow-md truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px]",
                                children: currentPlayers && currentPlayers[0]?.name ? currentPlayers[0].name : 'PLAYER 1'
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 727,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 721,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-2 min-w-[120px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white text-base xs:text-lg sm:text-xl md:text-2xl pr-2 sm:pr-5 md:pr-7 font-bold drop-shadow-md truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px]",
                                children: gameState.mode === 'ai' && !tournamentMode ? 'THE MACHINIST (AI)' : currentPlayers && currentPlayers[1]?.name ? currentPlayers[1].name : 'PLAYER 2'
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 733,
                                columnNumber: 11
                            }, this),
                            gameState.mode === 'ai' && !tournamentMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaRobot"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-300 bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 739,
                                columnNumber: 13
                            }, this) : currentPlayers && currentPlayers[1]?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: currentPlayers[1].avatar,
                                alt: "Player 2",
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white bg-gray-700 object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 742,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUserCircle"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 744,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 732,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 719,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-[90px] w-full flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-full flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-[900px] aspect-[16/6] relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                ref: canvasRef,
                                width: canvasWidth,
                                height: canvasHeight,
                                className: "rounded-lg shadow-lg bg-transparent absolute top-0 left-0 w-full h-full min-w-[220px]",
                                style: {
                                    background: 'transparent',
                                    maxWidth: '100%'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 753,
                                columnNumber: 13
                            }, this),
                            !localGameState.gameStarted && !localGameState.winner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center z-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: startGame,
                                    className: "px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse",
                                    children: "🚀 START GAME"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PingPongGame.tsx",
                                    lineNumber: 764,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 763,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 752,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/PingPongGame.tsx",
                    lineNumber: 751,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 750,
                columnNumber: 7
            }, this),
            gameState.mode === 'remote' && !tournamentMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        // Create invitation link with room code
                        const roomCode = gameState.gameRoom?.id || gameState.roomCode;
                        const inviteLink = roomCode ? `${window.location.origin}/game/remote?room=${roomCode}` : `${window.location.origin}/game/remote`;
                        console.log('Sharing invitation link:', inviteLink); // Debug log
                        // Try to use Web Share API if available, otherwise copy to clipboard
                        if (navigator.share) {
                            navigator.share({
                                title: 'Join my Ping Pong game!',
                                text: 'Come play Ping Pong with me online!',
                                url: inviteLink
                            }).catch((error)=>{
                                console.log('Error sharing:', error);
                                // Fallback to clipboard
                                navigator.clipboard.writeText(inviteLink).then(()=>{
                                    alert('Game invitation link copied to clipboard!');
                                });
                            });
                        } else {
                            // Fallback to clipboard
                            navigator.clipboard.writeText(inviteLink).then(()=>{
                                alert('Game invitation link copied to clipboard!\nShare this link with your friend to invite them to play.');
                            }).catch(()=>{
                                // If clipboard API fails, show the link
                                prompt('Copy this invitation link to share with your friend:', inviteLink);
                            });
                        }
                    },
                    className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "📤"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 813,
                            columnNumber: 13
                        }, this),
                        "Invite Friend"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/PingPongGame.tsx",
                    lineNumber: 778,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 777,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: gameState.mode === 'ai' && !tournamentMode ? 'Use W/S to control your paddle' : 'Left Player: W/S | Right Player: ↑/↓'
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 820,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-1",
                        children: "Press P to pause / resume the game"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 824,
                        columnNumber: 9
                    }, this),
                    showWinnerMessage && !tournamentMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-1 text-yellow-300",
                        children: "Press T to toggle winner message"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 826,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-3",
                        children: "First to score wins!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 828,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 819,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PingPongGame.tsx",
        lineNumber: 615,
        columnNumber: 5
    }, this);
};
_s(PingPongGame, "JU0aBzzcCvKCexkU+dKdZDj1bdo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PingPongGame;
const __TURBOPACK__default__export__ = PingPongGame;
var _c;
__turbopack_context__.k.register(_c, "PingPongGame");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/game/local/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LocalGamePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PingPongGame.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LocalGamePage() {
    _s();
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Set page title
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocalGamePage.useEffect": ()=>{
            document.title = 'Local Multiplayer Ping Pong';
        }
    }["LocalGamePage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocalGamePage.useEffect": ()=>{
            if (!gameState.players || !gameState.players[1]?.name) {
                router.replace('/game/player2');
            }
        }
    }["LocalGamePage.useEffect"], [
        gameState.players,
        router
    ]);
    if (!gameState.players || !gameState.players[1]?.name) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-[100%] w-[100%] ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-[90%] h-[80%]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/game/local/page.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/game/local/page.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/game'),
                    className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200",
                    children: "Back to Game Modes"
                }, void 0, false, {
                    fileName: "[project]/src/app/game/local/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/game/local/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/game/local/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(LocalGamePage, "JSOnyGZuK/OkXMcDx1JDS6LdJdc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LocalGamePage;
var _c;
__turbopack_context__.k.register(_c, "LocalGamePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_9ff4efab._.js.map