module.exports = {

"[project]/src/components/PingPongGame.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const PingPongGame = ({ tournamentMode = false, tournamentPlayers = [], onTournamentMatchEnd })=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameContext"])();
    const { tableBg, paddleColor, ballColor } = gameState.customisation || {};
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Use tournament players if provided, otherwise use game state players
    const currentPlayers = tournamentMode && tournamentPlayers.length === 2 ? tournamentPlayers : gameState.players;
    const [localGameState, setLocalGameState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
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
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showWinnerMessage, setShowWinnerMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [winnerMessageVisible, setWinnerMessageVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
    const keysPressed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Add horizontal padding for paddles
    const paddlePadding = 20;
    // Initialize game based on mode - but don't start automatically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeGame = ()=>{
            setLocalGameState((prev)=>({
                    ...prev,
                    gameStarted: false
                }));
        };
        initializeGame();
    }, [
        gameState.mode
    ]);
    // Reset game state when tournament players change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        tournamentMode,
        tournamentPlayers
    ]);
    // Handle keyboard input
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            keysPressed.current.add(e.key);
        };
        const handleKeyUp = (e)=>{
            keysPressed.current.delete(e.key);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return ()=>{
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    // Keyboard shortcut for pause/unpause (P)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handlePauseKey = (e)=>{
            if (e.key === 'p' || e.key === 'P') {
                setPaused((prev)=>!prev);
            }
        };
        window.addEventListener('keydown', handlePauseKey);
        return ()=>window.removeEventListener('keydown', handlePauseKey);
    }, []);
    // Toggle winner message visibility
    const toggleWinnerMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (showWinnerMessage) {
            setWinnerMessageVisible(!winnerMessageVisible);
        }
    }, [
        showWinnerMessage,
        winnerMessageVisible
    ]);
    // Start the game
    const startGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setLocalGameState((prev)=>({
                ...prev,
                gameStarted: true
            }));
    }, []);
    // Keyboard shortcut for winner message toggle (T) - disabled in tournament mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleToggleKey = (e)=>{
            if ((e.key === 't' || e.key === 'T') && showWinnerMessage && !tournamentMode) {
                toggleWinnerMessage();
            }
        };
        window.addEventListener('keydown', handleToggleKey);
        return ()=>window.removeEventListener('keydown', handleToggleKey);
    }, [
        showWinnerMessage,
        toggleWinnerMessage,
        tournamentMode
    ]);
    // Game loop
    const gameLoop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (paused || !localGameState.gameStarted || localGameState.winner) return;
        setLocalGameState((prev)=>{
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
        });
    }, [
        paused,
        localGameState.gameStarted,
        localGameState.winner,
        gameState.mode,
        tournamentMode,
        currentPlayers
    ]);
    // Removed automatic tournament progression to prevent infinite loops
    // Handle winner message display - manual progression only for tournament mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
                const hideTimeout = setTimeout(()=>{
                    setWinnerMessageVisible(false);
                    setTimeout(()=>setShowWinnerMessage(false), 300); // Wait for fade out animation
                }, 5000);
                return ()=>clearTimeout(hideTimeout);
            }
        }
    }, [
        localGameState.winner,
        tournamentMode
    ]);
    // Render game
    const renderGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
    }, [
        localGameState,
        gameState.mode
    ]);
    // Game loop and rendering
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            gameLoop();
        }, 16); // ~60 FPS
        return ()=>clearInterval(interval);
    }, [
        gameLoop
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        renderGame();
    }, [
        renderGame
    ]);
    // Handle restart (only for non-tournament games)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyPress = (e)=>{
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
        };
        window.addEventListener('keypress', handleKeyPress);
        return ()=>window.removeEventListener('keypress', handleKeyPress);
    }, [
        localGameState.winner,
        tournamentMode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-full w-full relative",
        children: [
            !paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setPaused(true),
                    className: "z-40 flex items-center justify-center fixed left-1/2 -translate-x-1/2 bottom-25 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-10 md:bottom-auto px-3 py-2 md:px-6 md:py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-base md:text-lg font-bold",
                    style: {
                        minWidth: '36px',
                        minHeight: '36px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPause"], {
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
            paused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center z-30",
                style: {
                    background: "rgba(0,0,0,0.6)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-4xl text-white font-bold mb-8",
                        children: "Paused"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 634,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setPaused(false),
                        className: "px-8 py-4 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-2xl font-bold z-40 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlay"], {
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
            showWinnerMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 flex flex-col items-center justify-center z-40 transition-all duration-300 ${winnerMessageVisible ? 'opacity-100' : 'opacity-0'}`,
                style: {
                    background: "rgba(0,0,0,0.8)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-3xl shadow-2xl border-4 border-yellow-400 p-8 text-center relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrophy"], {
                            className: "w-20 h-20 text-yellow-300 mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 665,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl md:text-2xl text-yellow-200 mb-6",
                            children: tournamentMode ? 'Match completed!' : 'Congratulations on your victory!'
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 669,
                            columnNumber: 13
                        }, this),
                        tournamentMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row justify-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleWinnerMessage,
                                    className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105",
                                    children: winnerMessageVisible ? 'Hide Message' : 'Show Message'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PingPongGame.tsx",
                                    lineNumber: 697,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 right-0 flex flex-wrap justify-between items-center px-2 md:px-10 lg:px-22",
                style: {
                    top: 0,
                    minHeight: '70px',
                    pointerEvents: 'none',
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-2 min-w-[120px]",
                        children: [
                            currentPlayers && currentPlayers[0]?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: currentPlayers[0].avatar,
                                alt: "Player 1",
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white bg-gray-700 object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 723,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUserCircle"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 725,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-2 min-w-[120px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white text-base xs:text-lg sm:text-xl md:text-2xl pr-2 sm:pr-5 md:pr-7 font-bold drop-shadow-md truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px]",
                                children: gameState.mode === 'ai' && !tournamentMode ? 'THE MACHINIST (AI)' : currentPlayers && currentPlayers[1]?.name ? currentPlayers[1].name : 'PLAYER 2'
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 733,
                                columnNumber: 11
                            }, this),
                            gameState.mode === 'ai' && !tournamentMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaRobot"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-300 bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 739,
                                columnNumber: 13
                            }, this) : currentPlayers && currentPlayers[1]?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: currentPlayers[1].avatar,
                                alt: "Player 2",
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white bg-gray-700 object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 742,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUserCircle"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-[90px] w-full flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-full flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-[900px] aspect-[16/6] relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
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
                            !localGameState.gameStarted && !localGameState.winner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center z-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            gameState.mode === 'remote' && !tournamentMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: gameState.mode === 'ai' && !tournamentMode ? 'Use W/S to control your paddle' : 'Left Player: W/S | Right Player: ↑/↓'
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 820,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-1",
                        children: "Press P to pause / resume the game"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 824,
                        columnNumber: 9
                    }, this),
                    showWinnerMessage && !tournamentMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-1 text-yellow-300",
                        children: "Press T to toggle winner message"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 826,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
const __TURBOPACK__default__export__ = PingPongGame;
}}),
"[project]/src/components/globalSocket.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getWebSocket": (()=>getWebSocket)
});
let s = null;
function getWebSocket() {
    if (!s || s.readyState === WebSocket.CLOSED || s.readyState === WebSocket.CLOSING) {
        s = new WebSocket('ws://localhost:4444/ws');
        s.onopen = ()=>{
            console.log('WebSocket connected');
        };
        s.onclose = ()=>{
            console.warn('WebSocket closed');
            s = null;
        };
        s.onerror = (error)=>{
            console.error('WebSocket error:', error);
        };
    }
    return s;
}
}}),
"[project]/src/app/game/tournament/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TournamentPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PingPongGame.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalSocket$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/globalSocket.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const PlayerRegistration = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ tempPlayers, defaultAvatars, playerCount, updatePlayer, onComplete, onBack })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-6xl mx-auto h-full bg-gray-900 bg-opacity-90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-3 sm:p-6 lg:p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-4 sm:mb-6 text-center",
                children: "Register Players"
            }, void 0, false, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2",
                children: tempPlayers.map((player, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 sm:gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: player.avatar,
                                                alt: `Player ${index + 1}`,
                                                className: "w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-purple-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 57,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1 hover:bg-purple-700",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUpload"], {
                                                    className: "w-2 h-2 sm:w-3 sm:h-3 text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 63,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 sm:gap-2 mb-2 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                                                        className: "text-purple-400 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 68,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-semibold text-sm sm:text-base break-words",
                                                        children: index === 0 ? 'Host Player' : `Player ${index + 1}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 69,
                                                        columnNumber: 19
                                                    }, this),
                                                    index === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCrown"], {
                                                        className: "text-yellow-400 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 72,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: player.name,
                                                onChange: (e)=>updatePlayer(index, 'name', e.target.value),
                                                placeholder: `Enter name for Player ${index + 1}`,
                                                className: "w-full px-2 py-2 sm:px-3 text-sm sm:text-base bg-gray-700 text-white rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                                                disabled: index === 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs sm:text-sm text-gray-300 mb-2",
                                        children: "Choose Avatar:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1 sm:gap-2 flex-wrap",
                                        children: defaultAvatars.slice(0, 6).map((avatar, avatarIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>updatePlayer(index, 'avatar', avatar),
                                                className: `w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 overflow-hidden flex-shrink-0 ${player.avatar === avatar ? 'border-purple-400' : 'border-gray-600'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: avatar,
                                                    alt: "",
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 21
                                                }, this)
                                            }, avatarIndex, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 88,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, player.id, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                        children: "Back"
                    }, void 0, false, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onComplete,
                        disabled: tempPlayers.filter((p)=>p.name.trim() !== '').length !== playerCount,
                        className: "px-6 py-2 sm:px-8 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm sm:text-base",
                        children: "Start Tournament"
                    }, void 0, false, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/game/tournament/page.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
});
PlayerRegistration.displayName = 'PlayerRegistration';
function TournamentPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { gameState, setGameMode, setPlayers, setTournament, updateTournamentMatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameContext"])();
    const [tournamentStep, setTournamentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('setup');
    const [tournamentType, setTournamentType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('local');
    const [playerCount, setPlayerCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(4);
    const [registeredPlayers, setRegisteredPlayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentMatchIndex, setCurrentMatchIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [remoteTournament, setRemoteTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [socket, setSocket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHost, setIsHost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tournamentId, setTournamentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [joinTournamentId, setJoinTournamentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [tempPlayers, setTempPlayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [matchWinner, setMatchWinner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showTournamentWinnerMessage, setShowTournamentWinnerMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // New state for tournament search and join requests
    const [availableTournaments, setAvailableTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [joinRequests, setJoinRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendingJoinRequest, setPendingJoinRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Default avatars - moved outside to prevent recreation
    const defaultAvatars = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>[
            'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCMDKvDLrPdTJtG5O4y3W61Wdqg20GwOOpUA&s',
            'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg',
            'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            'https://cdn-icons-png.flaticon.com/512/149/149452.png',
            'https://cdn-icons-png.flaticon.com/512/149/149995.png'
        ], []);
    // Initialize tempPlayers only when needed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (tournamentType === 'local') {
            setTempPlayers([
                {
                    name: 'Host Player',
                    avatar: defaultAvatars[0],
                    color: '#3B82F6',
                    id: '1'
                },
                ...Array(playerCount - 1).fill(null).map((_, i)=>({
                        name: '',
                        avatar: defaultAvatars[i + 1],
                        color: [
                            '#EF4444',
                            '#10B981',
                            '#F59E0B',
                            '#8B5CF6',
                            '#EC4899',
                            '#06B6D4',
                            '#84CC16'
                        ][i],
                        id: (i + 2).toString()
                    }))
            ]);
        }
    }, [
        playerCount,
        tournamentType,
        defaultAvatars
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGameMode('tournament');
    }, []); // Empty dependency array since we only want this to run once
    // Effect to handle invalid match states
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (tournamentStep === 'playing') {
            const currentMatch = gameState.tournament?.bracket[currentMatchIndex];
            if (!currentMatch || !currentMatch.player1 || !currentMatch.player2) {
                // If no valid match, go back to bracket view
                setTournamentStep('bracket');
            }
        }
    }, [
        tournamentStep,
        currentMatchIndex,
        gameState.tournament?.bracket?.length
    ]);
    // Separate useEffect for WebSocket management
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (tournamentType === 'remote') {
            const ws = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalSocket$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWebSocket"])();
            setSocket(ws);
            const handleMessage = (event)=>{
                const message = JSON.parse(event.data);
                switch(message.type){
                    case 'tournamentCreated':
                        setRemoteTournament(message.data.tournament);
                        setIsHost(true);
                        setTournamentId(message.data.tournamentId);
                        setTournamentStep('registration');
                        break;
                    case 'tournamentJoined':
                        setRemoteTournament(message.data.tournament);
                        setIsHost(false);
                        setTournamentId(message.data.tournamentId);
                        setTournamentStep('registration');
                        break;
                    case 'tournamentUpdated':
                        setRemoteTournament(message.data);
                        if (message.data.status === 'playing') {
                            setTournamentStep('bracket');
                        }
                        break;
                    case 'tournamentMatchReady':
                        break;
                    case 'tournamentJoinFailed':
                        alert(message.data.message);
                        break;
                    // New handlers for tournament search and join requests
                    case 'tournamentsFound':
                        setAvailableTournaments(message.data);
                        setIsSearching(false);
                        break;
                    case 'tournamentJoinRequestSent':
                        setPendingJoinRequest(message.data.tournamentId);
                        alert(message.data.message);
                        break;
                    case 'tournamentJoinRequestFailed':
                        alert(message.data.message);
                        break;
                    case 'tournamentJoinRequest':
                        // Host receives a join request
                        if (isHost && remoteTournament?.id === message.data.tournamentId) {
                            setJoinRequests((prev)=>[
                                    ...prev,
                                    message.data.request
                                ]);
                        }
                        break;
                    case 'tournamentJoinApproved':
                        // Player's join request was approved
                        setRemoteTournament(message.data.tournament);
                        setIsHost(false);
                        setTournamentId(message.data.tournamentId);
                        setTournamentStep('registration');
                        setPendingJoinRequest(null);
                        break;
                    case 'tournamentJoinDeclined':
                        // Player's join request was declined
                        alert(message.data.message);
                        setPendingJoinRequest(null);
                        break;
                    case 'joinRequestApproved':
                        // Host feedback when they approve a request
                        setJoinRequests((prev)=>prev.filter((req)=>req.id !== message.data.player.id));
                        break;
                    case 'joinRequestDeclined':
                        // Host feedback when they decline a request
                        setJoinRequests((prev)=>prev.filter((req)=>req.id !== message.data.player.id));
                        break;
                    case 'joinRequestError':
                        alert(message.data.message);
                        break;
                }
            };
            ws.addEventListener('message', handleMessage);
            // Send username for authentication
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('tournament_user'); // You might want to use actual username
            }
            return ()=>{
                ws.removeEventListener('message', handleMessage);
            };
        }
    }, [
        tournamentType
    ]);
    // Memoize frequently calculated values for performance
    const currentMatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return gameState.tournament?.bracket[currentMatchIndex];
    }, [
        gameState.tournament?.bracket,
        currentMatchIndex
    ]);
    const nextMatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const bracket = gameState.tournament?.bracket || [];
        // Find the next pending match that's not the current match
        return bracket.find((m, index)=>m.status === 'pending' && m.player1 && m.player2 && index !== currentMatchIndex);
    }, [
        gameState.tournament?.bracket,
        currentMatchIndex
    ]);
    const isLastMatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const bracket = gameState.tournament?.bracket || [];
        const currentMatch = bracket[currentMatchIndex];
        if (!currentMatch) return false;
        // Final match is the one with the highest round number
        const maxRound = Math.max(...bracket.map((m)=>m.round));
        return currentMatch.round === maxRound;
    }, [
        gameState.tournament?.bracket,
        currentMatchIndex
    ]);
    // Function to proceed to next match after modal - improved with stable dependencies
    const proceedToNextMatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        try {
            // Hide tournament winner message first
            setShowTournamentWinnerMessage(false);
            setMatchWinner(null);
            // Use a timeout to allow state updates to complete before finding next match
            setTimeout(()=>{
                // Get current bracket state after timeout
                const bracket = gameState.tournament?.bracket || [];
                // Find next available match (match that has both players and is pending, excluding current match)
                const nextMatch = bracket.find((m, index)=>m.status === 'pending' && m.player1 && m.player2 && index !== currentMatchIndex);
                if (nextMatch) {
                    const nextIndex = bracket.findIndex((m)=>m.id === nextMatch.id);
                    setCurrentMatchIndex(nextIndex);
                    setTournamentStep('playing');
                } else {
                    setTournamentStep('bracket');
                }
            }, 100);
        } catch (error) {
            console.error('Error in proceedToNextMatch:', error);
        }
    }, []); // Empty dependencies to prevent infinite loops
    // Auto-close tournament winner message after 3 seconds and proceed to next match
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (showTournamentWinnerMessage && matchWinner) {
            const timer = setTimeout(()=>{
                // Inline the proceedToNextMatch logic to avoid dependency issues
                setShowTournamentWinnerMessage(false);
                setMatchWinner(null);
                // Use another timeout to allow state updates
                setTimeout(()=>{
                    const bracket = gameState.tournament?.bracket || [];
                    const nextMatch = bracket.find((m, index)=>m.status === 'pending' && m.player1 && m.player2 && index !== currentMatchIndex);
                    if (nextMatch) {
                        const nextIndex = bracket.findIndex((m)=>m.id === nextMatch.id);
                        setCurrentMatchIndex(nextIndex);
                        setTournamentStep('playing');
                    } else {
                        setTournamentStep('bracket');
                    }
                }, 100);
            }, 3000);
            return ()=>clearTimeout(timer);
        }
    }, [
        showTournamentWinnerMessage,
        matchWinner
    ]); // Keep minimal dependencies
    const startTournament = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((players)=>{
        if (tournamentType === 'local') {
            // Local tournament logic - use provided players or registeredPlayers
            const playersToUse = players || registeredPlayers;
            if (playersToUse.length !== playerCount) return;
            const bracket = createTournamentBracket(playersToUse, playerCount);
            setTournament({
                type: tournamentType,
                playerCount,
                status: 'playing',
                currentMatch: 0,
                bracket
            });
            setPlayers(playersToUse);
            setTournamentStep('playing');
            setCurrentMatchIndex(0);
        } else {
            // Remote tournament logic
            createRemoteTournament();
        }
    }, [
        tournamentType,
        registeredPlayers,
        playerCount,
        setTournament,
        setPlayers
    ]);
    // Use useCallback to prevent function recreation
    const updatePlayer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((index, field, value)=>{
        setTempPlayers((prev)=>{
            const updated = [
                ...prev
            ];
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    }, []);
    const handlePlayerRegistrationComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const validPlayers = tempPlayers.filter((p)=>p.name.trim() !== '');
        if (validPlayers.length === playerCount) {
            setRegisteredPlayers(validPlayers);
            startTournament(validPlayers); // Pass players directly
        }
    }, [
        tempPlayers,
        playerCount,
        startTournament
    ]);
    const handleBackToSetup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setTournamentStep('setup');
    }, []);
    // Handle game completion - improved with better guards to prevent infinite loops
    const handleGameComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((winner)=>{
        const currentMatch = gameState.tournament?.bracket[currentMatchIndex];
        if (!currentMatch) {
            return;
        }
        // Guard against multiple calls for the same match
        if (currentMatch.status === 'finished') {
            return;
        }
        // Guard against invalid winner
        if (!winner || !winner.id || !winner.name) {
            return;
        }
        // Update the match with the winner
        updateTournamentMatch(currentMatch.id, {
            winner,
            status: 'finished'
        });
        // Advance winner to next round
        const bracket = [
            ...gameState.tournament?.bracket || []
        ];
        const maxRounds = playerCount === 4 ? 2 : 3;
        if (currentMatch.round < maxRounds) {
            const nextRound = currentMatch.round + 1;
            const nextRoundMatches = bracket.filter((m)=>m.round === nextRound);
            if (currentMatch.round === 1) {
                // First round to semi-finals (or final for 4-player)
                const matchInRound = currentMatchIndex;
                const nextMatchIndex = Math.floor(matchInRound / 2);
                const nextMatch = nextRoundMatches[nextMatchIndex];
                if (nextMatch) {
                    const positionInNext = matchInRound % 2;
                    if (positionInNext === 0) {
                        updateTournamentMatch(nextMatch.id, {
                            player1: winner
                        });
                    } else {
                        updateTournamentMatch(nextMatch.id, {
                            player2: winner
                        });
                    }
                }
            } else if (currentMatch.round === 2 && maxRounds === 3) {
                // Semi-finals to final (only for 8-player tournaments)
                const finalMatch = nextRoundMatches[0];
                if (finalMatch) {
                    if (!finalMatch.player1) {
                        updateTournamentMatch(finalMatch.id, {
                            player1: winner
                        });
                    } else if (!finalMatch.player2) {
                        updateTournamentMatch(finalMatch.id, {
                            player2: winner
                        });
                    }
                }
            }
        }
        // Show winner announcement
        setMatchWinner(winner);
        setShowTournamentWinnerMessage(true);
    }, [
        currentMatchIndex,
        playerCount,
        updateTournamentMatch,
        gameState.tournament?.bracket?.length
    ]); // Use bracket length instead of bracket object
    // Calculate match players for the current tournament match - stable version
    // const matchPlayers = useMemo(() => {
    //   if (tournamentStep !== 'playing') return [];
    //   const bracket = gameState.tournament?.bracket;
    //   if (!bracket || currentMatchIndex >= bracket.length) return [];
    //   const currentMatch = bracket[currentMatchIndex];
    //   if (!currentMatch?.player1 || !currentMatch?.player2) return [];
    //   return [currentMatch.player1, currentMatch.player2];
    // }, [tournamentStep, currentMatchIndex, gameState.tournament?.bracket?.length]); // Use bracket length instead of bracket object
    // Memoize tournament bracket creation to avoid recreating on every render
    const createTournamentBracket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((players, count)=>{
        const bracket = [];
        let matchId = 1;
        if (count === 4) {
            // Semi-finals
            bracket.push({
                id: matchId++,
                round: 1,
                player1: players[0],
                player2: players[1],
                status: 'pending'
            });
            bracket.push({
                id: matchId++,
                round: 1,
                player1: players[2],
                player2: players[3],
                status: 'pending'
            });
            // Final
            bracket.push({
                id: matchId++,
                round: 2,
                status: 'pending'
            });
        } else {
            // Quarter-finals
            for(let i = 0; i < 8; i += 2){
                bracket.push({
                    id: matchId++,
                    round: 1,
                    player1: players[i],
                    player2: players[i + 1],
                    status: 'pending'
                });
            }
            // Semi-finals
            bracket.push({
                id: matchId++,
                round: 2,
                status: 'pending'
            });
            bracket.push({
                id: matchId++,
                round: 2,
                status: 'pending'
            });
            // Final
            bracket.push({
                id: matchId++,
                round: 3,
                status: 'pending'
            });
        }
        return bracket;
    }, []);
    const createRemoteTournament = ()=>{
        if (!socket) return;
        socket.send(JSON.stringify({
            type: 'game',
            action: 'createTournament',
            payload: {
                type: tournamentType,
                playerCount,
                playerName: 'Host Player',
                avatar: defaultAvatars[0],
                color: '#3B82F6'
            }
        }));
    };
    const joinRemoteTournament = ()=>{
        if (!socket || !joinTournamentId.trim()) return;
        socket.send(JSON.stringify({
            type: 'game',
            action: 'joinTournament',
            payload: {
                tournamentId: joinTournamentId.trim(),
                playerName: 'Player',
                avatar: defaultAvatars[1],
                color: '#10B981'
            }
        }));
    };
    // New tournament search functions
    const searchTournaments = ()=>{
        if (!socket) return;
        setIsSearching(true);
        socket.send(JSON.stringify({
            type: 'game',
            action: 'searchTournaments',
            payload: {}
        }));
    };
    const requestJoinTournament = (tournamentId)=>{
        if (!socket) return;
        socket.send(JSON.stringify({
            type: 'game',
            action: 'requestJoinTournament',
            payload: {
                tournamentId: tournamentId,
                playerName: 'Player',
                avatar: defaultAvatars[1],
                color: '#10B981'
            }
        }));
    };
    const approveJoinRequest = (requestId)=>{
        if (!socket || !tournamentId) return;
        socket.send(JSON.stringify({
            type: 'game',
            action: 'approveJoinRequest',
            payload: {
                tournamentId: tournamentId,
                requestId: requestId
            }
        }));
    };
    const declineJoinRequest = (requestId)=>{
        if (!socket || !tournamentId) return;
        socket.send(JSON.stringify({
            type: 'game',
            action: 'declineJoinRequest',
            payload: {
                tournamentId: tournamentId,
                requestId: requestId
            }
        }));
    };
    // const handleMatchEnd = useCallback((winner: Player) => {
    //   const bracket = gameState.tournament?.bracket || [];
    //   const currentMatch = bracket[currentMatchIndex];
    //   if (!currentMatch || !winner) return;
    //   // Prevent multiple calls for the same match
    //   if (currentMatch.status === 'finished') {
    //     console.log('Match already finished, ignoring duplicate call');
    //     return;
    //   }
    //   console.log('handleMatchEnd called for match:', currentMatch.id, 'winner:', winner.name);
    //   // Update current match with winner
    //   updateTournamentMatch(currentMatch.id, {
    //     winner,
    //     status: 'finished'
    //   });
    //   // Advance winner to next round immediately
    //   const maxRounds = playerCount === 4 ? 2 : 3;
    //   // Advance winner to next round if applicable
    //   if (currentMatch.round < maxRounds) {
    //     const nextRound = currentMatch.round + 1;
    //     const nextRoundMatches = bracket.filter(m => m.round === nextRound);
    //     if (currentMatch.round === 1) {
    //       // First round to semi-finals (or final for 4-player)
    //       const matchInRound = currentMatchIndex; // 0, 1 for 4-player
    //       const nextMatchIndex = Math.floor(matchInRound / 2);
    //       const nextMatch = nextRoundMatches[nextMatchIndex];
    //       if (nextMatch) {
    //         const positionInNext = matchInRound % 2; // 0 for player1, 1 for player2
    //         if (positionInNext === 0) {
    //           updateTournamentMatch(nextMatch.id, { player1: winner });
    //         } else {
    //           updateTournamentMatch(nextMatch.id, { player2: winner });
    //         }
    //       }
    //     } else if (currentMatch.round === 2 && maxRounds === 3) {
    //       // Semi-finals to final (only for 8-player tournaments)
    //       const finalMatch = nextRoundMatches[0];
    //       if (finalMatch) {
    //         if (!finalMatch.player1) {
    //           updateTournamentMatch(finalMatch.id, { player1: winner });
    //         } else if (!finalMatch.player2) {
    //           updateTournamentMatch(finalMatch.id, { player2: winner });
    //         }
    //       }
    //     }
    //   }
    //   // Show tournament winner message
    //   setMatchWinner(winner);
    //   setShowTournamentWinnerMessage(true);
    // }, [currentMatchIndex, playerCount, updateTournamentMatch, gameState.tournament?.bracket?.length]); // Use bracket length instead of bracket object
    // Improved match end and progress function with stable dependencies
    // const handleMatchEndAndProgress = useCallback((winner: Player) => {
    //   const bracket = gameState.tournament?.bracket || [];
    //   const currentMatch = bracket[currentMatchIndex];
    //   if (!currentMatch || !winner) return;
    //   // Update current match with winner
    //   updateTournamentMatch(currentMatch.id, {
    //     winner,
    //     status: 'finished'
    //   });
    //   // Advance winner to next round immediately
    //   const maxRounds = playerCount === 4 ? 2 : 3;
    //   // Advance winner to next round if applicable
    //   if (currentMatch.round < maxRounds) {
    //     const nextRound = currentMatch.round + 1;
    //     const nextRoundMatches = bracket.filter(m => m.round === nextRound);
    //     if (currentMatch.round === 1) {
    //       // First round to semi-finals (or final for 4-player)
    //       const matchInRound = currentMatchIndex; // 0, 1 for 4-player
    //       const nextMatchIndex = Math.floor(matchInRound / 2);
    //       const nextMatch = nextRoundMatches[nextMatchIndex];
    //       if (nextMatch) {
    //         const positionInNext = matchInRound % 2; // 0 for player1, 1 for player2
    //         if (positionInNext === 0) {
    //           updateTournamentMatch(nextMatch.id, { player1: winner });
    //         } else {
    //           updateTournamentMatch(nextMatch.id, { player2: winner });
    //         }
    //       }
    //     } else if (currentMatch.round === 2 && maxRounds === 3) {
    //       // Semi-finals to final (only for 8-player tournaments)
    //       const finalMatch = nextRoundMatches[0];
    //       if (finalMatch) {
    //         if (!finalMatch.player1) {
    //           updateTournamentMatch(finalMatch.id, { player1: winner });
    //         } else if (!finalMatch.player2) {
    //           updateTournamentMatch(finalMatch.id, { player2: winner });
    //         }
    //       }
    //     }
    //   }
    //   // Find and move to next available match after a short delay
    //   setTimeout(() => {
    //     const updatedBracket = gameState.tournament?.bracket || [];
    //     const nextMatch = updatedBracket.find((m, index) =>
    //       m.status === 'pending' &&
    //       m.player1 &&
    //       m.player2 &&
    //       index !== currentMatchIndex
    //     );
    //     if (nextMatch) {
    //       const nextIndex = updatedBracket.findIndex(m => m.id === nextMatch.id);
    //       setCurrentMatchIndex(nextIndex);
    //       // Stay in playing mode to continue with next match
    //     } else {
    //       setTournamentStep('bracket');
    //     }
    //   }, 500); // Give time for state updates
    // }, [currentMatchIndex, playerCount, updateTournamentMatch]); // Keep stable dependencies
    // Function to play next match - improved with stable dependencies
    // const playNextMatch = useCallback(() => {
    //   console.log('playNextMatch called');
    //   // First, advance the current match winner to the next round if there is one
    //   if (matchWinner) {
    //     const bracket = gameState.tournament?.bracket || [];
    //     const currentMatch = bracket[currentMatchIndex];
    //     if (currentMatch && currentMatch.status === 'finished') {
    //       const maxRounds = playerCount === 4 ? 2 : 3;
    //       // Advance winner to next round if applicable
    //       if (currentMatch.round < maxRounds) {
    //         const nextRound = currentMatch.round + 1;
    //         const nextRoundMatches = bracket.filter(m => m.round === nextRound);
    //         if (currentMatch.round === 1) {
    //           // First round to semi-finals (or final for 4-player)
    //           const matchInRound = currentMatchIndex;
    //           const nextMatchIndex = Math.floor(matchInRound / 2);
    //           const nextMatch = nextRoundMatches[nextMatchIndex];
    //           if (nextMatch) {
    //             const positionInNext = matchInRound % 2; // 0 for player1, 1 for player2
    //             if (positionInNext === 0) {
    //               updateTournamentMatch(nextMatch.id, { player1: matchWinner });
    //               console.log(`${matchWinner.name} advanced to match ${nextMatch.id} as player1`);
    //             } else {
    //               updateTournamentMatch(nextMatch.id, { player2: matchWinner });
    //               console.log(`${matchWinner.name} advanced to match ${nextMatch.id} as player2`);
    //             }
    //           }
    //         } else if (currentMatch.round === 2 && maxRounds === 3) {
    //           // Semi-finals to final (only for 8-player tournaments)
    //           const finalMatch = nextRoundMatches[0];
    //           if (finalMatch) {
    //             if (!finalMatch.player1) {
    //               updateTournamentMatch(finalMatch.id, { player1: matchWinner });
    //               console.log(`${matchWinner.name} advanced to final as player1`);
    //             } else if (!finalMatch.player2) {
    //               updateTournamentMatch(finalMatch.id, { player2: matchWinner });
    //               console.log(`${matchWinner.name} advanced to final as player2`);
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   // Now find the next match after a short delay to allow state updates
    //   setTimeout(() => {
    //     const bracket = gameState.tournament?.bracket || [];
    //     const nextMatch = bracket.find((m, index) =>
    //       m.status === 'pending' &&
    //       m.player1 &&
    //       m.player2 &&
    //       index !== currentMatchIndex
    //     );
    //     console.log('Looking for next match:', nextMatch);
    //     if (nextMatch) {
    //       const nextIndex = bracket.findIndex(m => m.id === nextMatch.id);
    //       setCurrentMatchIndex(nextIndex);
    //       setTournamentStep('playing');
    //       console.log('Moving to next match at index:', nextIndex);
    //     } else {
    //       // No more matches, go to bracket view
    //       console.log('No more matches, going to bracket view');
    //       setTournamentStep('bracket');
    //     }
    //     // Hide tournament winner message
    //     setShowTournamentWinnerMessage(false);
    //     setMatchWinner(null);
    //   }, 100);
    // }, [matchWinner, currentMatchIndex, playerCount, updateTournamentMatch]); // Keep stable dependencies
    const TournamentBracket = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(()=>{
        const bracket = gameState.tournament?.bracket || [];
        const rounds = Math.max(...bracket.map((m)=>m.round));
        const getRoundMatches = (round)=>bracket.filter((m)=>m.round === round);
        const getNextMatch = ()=>{
            return bracket.find((m, index)=>m.status === 'pending' && m.player1 && m.player2 && index !== currentMatchIndex);
        };
        const playNextMatch = ()=>{
            const nextMatch = getNextMatch();
            if (nextMatch) {
                const nextIndex = bracket.findIndex((m)=>m.id === nextMatch.id);
                setCurrentMatchIndex(nextIndex);
                setTournamentStep('playing');
            }
        };
        const isComplete = bracket.every((m)=>m.status === 'finished');
        const winner = isComplete ? bracket[bracket.length - 1]?.winner : null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full bg-gray-800 bg-opacity-90 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-purple-400 p-3 sm:p-4 lg:p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 text-center",
                    children: "Tournament Bracket"
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 879,
                    columnNumber: 9
                }, this),
                winner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrophy"], {
                            className: "w-8 h-8 sm:w-12 sm:h-12 text-yellow-300 mx-auto mb-2 sm:mb-3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 885,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "text-base sm:text-lg font-bold text-white mb-1 sm:mb-2",
                            children: "Tournament Champion!"
                        }, void 0, false, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 886,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-2 sm:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: winner.avatar,
                                    alt: winner.name,
                                    className: "w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 888,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm sm:text-base lg:text-lg font-semibold text-white",
                                    children: winner.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 889,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 887,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 884,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-2",
                    children: Array.from({
                        length: rounds
                    }, (_, roundIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2 sm:gap-3 min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-xs sm:text-sm lg:text-md font-semibold text-purple-300 text-center",
                                    children: roundIndex === rounds - 1 ? 'Final' : roundIndex === rounds - 2 ? 'Semi-Final' : 'Quarter-Final'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 897,
                                    columnNumber: 15
                                }, this),
                                getRoundMatches(roundIndex + 1).map((match)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `bg-gray-700 rounded-md sm:rounded-lg p-2 sm:p-3 border ${match.status === 'finished' ? 'border-green-400' : match.status === 'playing' ? 'border-blue-400' : 'border-gray-500'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex items-center gap-1 sm:gap-2 p-1 rounded text-xs ${match.winner?.id === match.player1?.id ? 'bg-green-600' : 'bg-gray-600'}`,
                                                    children: match.player1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: match.player1.avatar,
                                                                alt: "",
                                                                className: "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 913,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white truncate text-xs",
                                                                children: match.player1.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 914,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400 text-xs",
                                                        children: "TBD"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 917,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 908,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex items-center gap-1 sm:gap-2 p-1 rounded text-xs ${match.winner?.id === match.player2?.id ? 'bg-green-600' : 'bg-gray-600'}`,
                                                    children: match.player2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: match.player2.avatar,
                                                                alt: "",
                                                                className: "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 925,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white truncate text-xs",
                                                                children: match.player2.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 926,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400 text-xs",
                                                        children: "TBD"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 929,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 920,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                            lineNumber: 907,
                                            columnNumber: 19
                                        }, this)
                                    }, match.id, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 903,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, roundIndex, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 896,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 894,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4",
                    children: !isComplete && getNextMatch() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: playNextMatch,
                        className: "flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs sm:text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaGamepad"], {}, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 945,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: "Play Next Match"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 946,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sm:hidden",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 947,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 941,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 939,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/game/tournament/page.tsx",
            lineNumber: 878,
            columnNumber: 7
        }, this);
    });
    TournamentBracket.displayName = 'TournamentBracket';
    // Setup phase
    if (tournamentStep === 'setup') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl h-full bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-700 via-purple-900 to-black border-2 border-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center",
                        children: "Tournament Setup"
                    }, void 0, false, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 962,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 xs:space-y-3 sm:space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-white text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-4",
                                        children: "Tournament Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 966,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setTournamentType('local'),
                                                className: `p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${tournamentType === 'local' ? 'border-purple-400 bg-purple-600 bg-opacity-20' : 'border-gray-600 bg-gray-800'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-semibold mb-1 text-xs xs:text-sm md:text-base",
                                                        children: "Local Tournament"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 976,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-xs xs:text-sm",
                                                        children: "All players on the same device"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 977,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 968,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setTournamentType('remote'),
                                                className: `p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${tournamentType === 'remote' ? 'border-purple-400 bg-purple-600 bg-opacity-20' : 'border-gray-600 bg-gray-800'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-semibold mb-1 text-xs xs:text-sm md:text-base",
                                                        children: "Remote Tournament"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 987,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-xs xs:text-sm",
                                                        children: "Players join from different devices"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 988,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 979,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 967,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 965,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-white text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-4",
                                        children: "Player Count"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 994,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setPlayerCount(4),
                                                className: `p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${playerCount === 4 ? 'border-purple-400 bg-purple-600 bg-opacity-20' : 'border-gray-600 bg-gray-800'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-semibold mb-1 text-xs xs:text-sm md:text-base",
                                                        children: "4 Players"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1004,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-xs xs:text-sm",
                                                        children: "Semi-finals → Final"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1005,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 996,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setPlayerCount(8),
                                                className: `p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${playerCount === 8 ? 'border-purple-400 bg-purple-600 bg-opacity-20' : 'border-gray-600 bg-gray-800'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-semibold mb-1 text-xs xs:text-sm md:text-base",
                                                        children: "8 Players"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1015,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-300 text-xs xs:text-sm",
                                                        children: "Quarter-finals → Semi-finals → Final"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1016,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 995,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 993,
                                columnNumber: 13
                            }, this),
                            tournamentType === 'remote' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 sm:space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-white text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3",
                                                children: "Tournament Options"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1025,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setIsHost(true);
                                                            createRemoteTournament();
                                                        },
                                                        className: "p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-green-600 bg-green-600 bg-opacity-20 hover:bg-opacity-30 transition-all",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-white font-semibold mb-1 text-xs sm:text-sm",
                                                                children: "Create Tournament"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1034,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-300 text-xs",
                                                                children: "Host a new tournament"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1035,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1027,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setTournamentStep('search');
                                                            searchTournaments();
                                                        },
                                                        className: "p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-yellow-600 bg-yellow-600 bg-opacity-20 hover:bg-opacity-30 transition-all",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-white font-semibold mb-1 text-xs sm:text-sm",
                                                                children: "Search Tournaments"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1045,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-300 text-xs",
                                                                children: "Find and join open tournaments"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1046,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1038,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-blue-600 bg-blue-600 bg-opacity-20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-white font-semibold mb-2 text-xs sm:text-sm",
                                                                children: "Join by ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1050,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: joinTournamentId,
                                                                        onChange: (e)=>setJoinTournamentId(e.target.value),
                                                                        placeholder: "Enter Tournament ID",
                                                                        className: "w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-700 text-white rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1052,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: joinRemoteTournament,
                                                                        disabled: !joinTournamentId.trim(),
                                                                        className: "w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold",
                                                                        children: "Join"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1059,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1051,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1049,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1026,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1024,
                                        columnNumber: 17
                                    }, this),
                                    isHost && tournamentId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-900 bg-opacity-50 rounded-lg p-2 sm:p-3 border border-green-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-green-300 font-semibold mb-1 text-xs sm:text-sm",
                                                children: "Tournament Created!"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1074,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white mb-2 text-xs",
                                                children: "Share this ID with other players:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1075,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row items-start sm:items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                        className: "bg-gray-800 px-2 py-1 sm:px-3 sm:py-2 rounded text-green-300 font-mono text-xs sm:text-sm break-all",
                                                        children: tournamentId
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1077,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>navigator.clipboard.writeText(tournamentId),
                                                        className: "px-2 py-1 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm whitespace-nowrap",
                                                        children: "Copy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1080,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1076,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1073,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1023,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 964,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/game'),
                                className: "w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-2 xs:order-1",
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1094,
                                columnNumber: 15
                            }, this),
                            tournamentType === 'local' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setTournamentStep('registration'),
                                className: "w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2",
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1101,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1093,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 961,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/game/tournament/page.tsx",
            lineNumber: 960,
            columnNumber: 7
        }, this);
    }
    // Registration phase
    if (tournamentStep === 'registration') {
        if (tournamentType === 'remote') {
            // Remote tournament registration waiting screen
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-3 xs:mb-4 sm:mb-6 text-center",
                            children: "Remote Tournament Registration"
                        }, void 0, false, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1121,
                            columnNumber: 13
                        }, this),
                        isHost && tournamentId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-green-900 bg-opacity-50 rounded-lg p-2 xs:p-3 sm:p-4 border border-green-500 mb-3 xs:mb-4 sm:mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-green-300 font-semibold mb-2 text-xs xs:text-sm sm:text-base",
                                    children: "Tournament ID:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1127,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col xs:flex-row items-start xs:items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            className: "bg-gray-800 px-2 py-1 xs:px-3 xs:py-2 rounded text-green-300 font-mono text-xs xs:text-sm md:text-base lg:text-lg break-all w-full xs:w-auto",
                                            children: tournamentId
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                            lineNumber: 1129,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>navigator.clipboard.writeText(tournamentId),
                                            className: "w-full xs:w-auto px-2 py-1 xs:px-3 xs:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs xs:text-sm whitespace-nowrap",
                                            children: "Copy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                            lineNumber: 1132,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1128,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-300 text-xs xs:text-sm mt-2",
                                    children: "Share this ID with other players"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1139,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1126,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-3 xs:mb-4 sm:mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm xs:text-base sm:text-lg lg:text-xl text-white mb-2 xs:mb-3 sm:mb-4",
                                    children: [
                                        "Waiting for players... (",
                                        remoteTournament?.registeredPlayers?.length || 0,
                                        "/",
                                        playerCount,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1144,
                                    columnNumber: 15
                                }, this),
                                remoteTournament?.registeredPlayers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-2 xs:gap-3 grid-cols-1 xs:grid-cols-2",
                                    children: [
                                        remoteTournament.registeredPlayers.map((player, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gray-800 rounded-lg p-2 xs:p-3 border border-purple-400",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 xs:gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: player.avatar || defaultAvatars[index],
                                                            alt: player.name,
                                                            className: "w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-400 flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                                            lineNumber: 1153,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0 flex-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1 xs:gap-2 flex-wrap",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-white font-semibold text-xs xs:text-sm sm:text-base truncate",
                                                                        children: player.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1160,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    player.id === remoteTournament.host.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCrown"], {
                                                                        className: "text-yellow-400 text-sm flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1162,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1159,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                                            lineNumber: 1158,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 1152,
                                                    columnNumber: 23
                                                }, this)
                                            }, index, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1151,
                                                columnNumber: 21
                                            }, this)),
                                        Array.from({
                                            length: playerCount - (remoteTournament.registeredPlayers?.length || 0)
                                        }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-gray-700 rounded-lg p-2 xs:p-3 border-2 border-dashed border-gray-500",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 xs:gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600 border-2 border-gray-500 flex items-center justify-center flex-shrink-0",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                                                                className: "text-gray-400 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1175,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                                            lineNumber: 1174,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-400 text-xs xs:text-sm sm:text-base",
                                                            children: "Waiting for player..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                                            lineNumber: 1177,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 1173,
                                                    columnNumber: 23
                                                }, this)
                                            }, `empty-${index}`, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1172,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1149,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1143,
                            columnNumber: 13
                        }, this),
                        isHost && joinRequests.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 sm:mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-base sm:text-lg lg:text-xl font-bold text-yellow-300 mb-3 sm:mb-4 text-center",
                                    children: [
                                        "Pending Join Requests (",
                                        joinRequests.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1188,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 sm:space-y-3",
                                    children: joinRequests.map((request)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-yellow-900 bg-opacity-30 rounded-lg p-2 sm:p-3 lg:p-4 border border-yellow-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 sm:gap-3 min-w-0 flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: request.player.avatar,
                                                                alt: request.player.name,
                                                                className: "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1196,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-white font-semibold text-xs sm:text-sm lg:text-base truncate",
                                                                        children: request.player.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1202,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-300 text-xs sm:text-sm",
                                                                        children: [
                                                                            "Requested ",
                                                                            request.timestamp ? new Date(request.timestamp).toLocaleTimeString() : 'Recently'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1205,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1201,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1195,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1 sm:gap-2 w-full xs:w-auto",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>approveJoinRequest(request.id),
                                                                className: "flex-1 xs:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaCheck"], {
                                                                        className: "w-3 h-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1215,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "hidden xs:inline",
                                                                        children: "Accept"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1216,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "xs:hidden",
                                                                        children: "✓"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1217,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1211,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>declineJoinRequest(request.id),
                                                                className: "flex-1 xs:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTimes"], {
                                                                        className: "w-3 h-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1223,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "hidden xs:inline",
                                                                        children: "Decline"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1224,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "xs:hidden",
                                                                        children: "✗"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1225,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1219,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1210,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1194,
                                                columnNumber: 23
                                            }, this)
                                        }, request.id, false, {
                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                            lineNumber: 1193,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1191,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1187,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTournamentStep('setup'),
                                    className: "w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-2 xs:order-1",
                                    children: "Back to Setup"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1236,
                                    columnNumber: 15
                                }, this),
                                remoteTournament?.status === 'playing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTournamentStep('bracket'),
                                    className: "w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2",
                                    children: "View Bracket"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1243,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1235,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1120,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 1119,
                columnNumber: 9
            }, this);
        } else {
            // Local tournament registration
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlayerRegistration, {
                    tempPlayers: tempPlayers,
                    defaultAvatars: defaultAvatars,
                    playerCount: playerCount,
                    updatePlayer: updatePlayer,
                    onComplete: handlePlayerRegistrationComplete,
                    onBack: handleBackToSetup
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1258,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 1257,
                columnNumber: 9
            }, this);
        }
    }
    // Playing phase - show the actual game
    if (tournamentStep === 'playing') {
        // Use memoized current match
        if (!currentMatch || !currentMatch.player1 || !currentMatch.player2) {
            // Return loading state while useEffect handles the redirect
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white",
                    children: "Loading next match..."
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1278,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 1277,
                columnNumber: 9
            }, this);
        }
        // Set current players for the game
        const currentPlayers = [
            currentMatch.player1,
            currentMatch.player2
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col h-full bg-black opacity-90",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 border-b border-purple-500 p-2 sm:p-4 ",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center sm:text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg sm:text-xl font-bold text-purple-300",
                                        children: "Tournament Match"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1292,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-300",
                                        children: [
                                            "Round ",
                                            currentMatch.round,
                                            " - Match ",
                                            currentMatchIndex + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1293,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1291,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 sm:gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 bg-gray-800 rounded-lg px-2 sm:px-3 py-1 sm:py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: currentMatch.player1.avatar,
                                                alt: currentMatch.player1.name,
                                                className: "w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1299,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-semibold text-sm sm:text-base",
                                                children: currentMatch.player1.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1304,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1298,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-purple-300 font-bold text-sm sm:text-base",
                                        children: "VS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1306,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 bg-gray-800 rounded-lg px-2 sm:px-3 py-1 sm:py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: currentMatch.player2.avatar,
                                                alt: currentMatch.player2.name,
                                                className: "w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1308,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-semibold text-sm sm:text-base",
                                                children: currentMatch.player2.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1313,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1307,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1297,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1290,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1289,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            tournamentMode: true,
                            tournamentPlayers: currentPlayers,
                            onTournamentMatchEnd: handleGameComplete
                        }, void 0, false, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1321,
                            columnNumber: 11
                        }, this),
                        showTournamentWinnerMessage && matchWinner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTrophy"], {
                                        className: "w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-3 sm:mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1331,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl sm:text-2xl font-bold text-white mb-2",
                                        children: "Match Winner!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1332,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: matchWinner.avatar,
                                                alt: matchWinner.name,
                                                className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1334,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg sm:text-xl font-semibold text-white",
                                                children: matchWinner.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1339,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1333,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300 text-sm sm:text-base",
                                        children: isLastMatch ? 'Tournament Complete!' : 'Advancing to next round...'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1341,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4",
                                        children: [
                                            !isLastMatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: proceedToNextMatch,
                                                className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                                children: "Continue to Next Match"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1348,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setTournamentStep('bracket'),
                                                className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                                children: "View Tournament Bracket"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1355,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>router.push('/game'),
                                                className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                                children: "Back to Game Modes"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1361,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1346,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1330,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1329,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1320,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-900 border-t border-purple-500 p-2 sm:p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 sm:gap-4 order-2 sm:order-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/game'),
                                        className: "px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                        children: "Back to Game Modes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1377,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTournamentStep('bracket'),
                                        className: "px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                        children: "View Bracket"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1383,
                                        columnNumber: 15
                                    }, this),
                                    currentMatch?.status === 'finished' && nextMatch && !isLastMatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: proceedToNextMatch,
                                        className: "px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                        children: "Next Match"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1392,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1376,
                                columnNumber: 13
                            }, this),
                            nextMatch && !showTournamentWinnerMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center order-1 sm:order-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300 text-xs sm:text-sm",
                                        children: "Next Match:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1404,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 sm:gap-2 text-white text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate max-w-16 sm:max-w-none",
                                                children: nextMatch.player1?.name || 'TBD'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1406,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-purple-300",
                                                children: "vs"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1407,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate max-w-16 sm:max-w-none",
                                                children: nextMatch.player2?.name || 'TBD'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1408,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1405,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1403,
                                columnNumber: 15
                            }, this),
                            isLastMatch && !showTournamentWinnerMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center order-1 sm:order-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-green-300 font-semibold text-sm sm:text-base",
                                        children: "Final Match!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1416,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-300 text-xs sm:text-sm",
                                        children: "Winner takes the tournament"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1417,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1415,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1375,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1374,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/game/tournament/page.tsx",
            lineNumber: 1287,
            columnNumber: 7
        }, this);
    }
    // Bracket phase - show tournament results and allow navigation
    if (tournamentStep === 'bracket') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4 sm:mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 mb-2 sm:mb-4",
                                children: "Tournament Bracket"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1432,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300 text-sm sm:text-base",
                                children: gameState.tournament?.bracket?.every((m)=>m.status === 'finished') ? 'Tournament Complete!' : 'Tournament Progress'
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1433,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1431,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TournamentBracket, {}, void 0, false, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1440,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/game'),
                                className: "px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                children: "Back to Game Modes"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1443,
                                columnNumber: 13
                            }, this),
                            (()=>{
                                const bracket = gameState.tournament?.bracket || [];
                                const currentMatch = bracket[currentMatchIndex];
                                // If current match is pending (in progress), show return to game button
                                if (currentMatch && currentMatch.status === 'pending' && currentMatch.player1 && currentMatch.player2) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTournamentStep('playing'),
                                        className: "px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                        children: "Return to Game"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1458,
                                        columnNumber: 19
                                    }, this);
                                }
                                // Otherwise, show continue tournament for next match if available
                                const nextMatch = bracket.find((m, index)=>m.status === 'pending' && m.player1 && m.player2 && index !== currentMatchIndex);
                                return nextMatch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const nextIndex = bracket.findIndex((m)=>m.id === nextMatch.id);
                                        setCurrentMatchIndex(nextIndex);
                                        setTournamentStep('playing');
                                    },
                                    className: "px-4 py-2 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                    children: "Continue Tournament"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1475,
                                    columnNumber: 17
                                }, this) : null;
                            })(),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setTournamentStep('setup'),
                                className: "px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                                children: "New Tournament"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1488,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1442,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 1430,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/game/tournament/page.tsx",
            lineNumber: 1429,
            columnNumber: 7
        }, this);
    }
    // Tournament search phase
    if (tournamentStep === 'search') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-700 via-purple-900 to-black border-2 border-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center flex items-center justify-center gap-1 xs:gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {
                                className: "text-yellow-400 text-sm xs:text-base sm:text-lg"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1506,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "break-words",
                                children: "Available Tournaments"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1507,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1505,
                        columnNumber: 11
                    }, this),
                    isSearching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-6 xs:py-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-purple-400 mx-auto mb-3 xs:mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1512,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white text-sm xs:text-base",
                                children: "Searching for tournaments..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1513,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1511,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: availableTournaments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-6 xs:py-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-300 mb-3 xs:mb-4 text-sm xs:text-base",
                                    children: "No open tournaments found"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1519,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: searchTournaments,
                                    className: "px-3 py-2 xs:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm xs:text-base",
                                    children: "Refresh Search"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1520,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1518,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 xs:space-y-3 sm:space-y-4",
                            children: availableTournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 rounded-lg p-2 xs:p-3 sm:p-4 border border-gray-600 hover:border-purple-400 transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2 xs:gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 xs:gap-3 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: tournament.host.avatar,
                                                                alt: tournament.host.name,
                                                                className: "w-6 h-6 xs:w-8 xs:h-8 rounded-full flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1537,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0 flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-white font-semibold text-xs xs:text-sm sm:text-base truncate",
                                                                        children: tournament.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1543,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-400 text-xs sm:text-sm truncate",
                                                                        children: [
                                                                            "Hosted by ",
                                                                            tournament.host.name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                        lineNumber: 1546,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1542,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1536,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-1 xs:gap-2 text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-purple-600 bg-opacity-30 text-purple-300 px-2 py-1 rounded text-xs",
                                                                children: [
                                                                    tournament.playerCount || tournament.maxPlayers,
                                                                    " Players"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1552,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-blue-600 bg-opacity-30 text-blue-300 px-2 py-1 rounded text-xs",
                                                                children: [
                                                                    tournament.registeredPlayers?.length || tournament.currentPlayers,
                                                                    "/",
                                                                    tournament.playerCount || tournament.maxPlayers,
                                                                    " Joined"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1555,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-green-600 bg-opacity-30 text-green-300 px-2 py-1 rounded text-xs",
                                                                children: tournament.type ? tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1) : 'Tournament'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                lineNumber: 1558,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                                        lineNumber: 1551,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1535,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center xs:justify-end",
                                                children: pendingJoinRequest === tournament.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg px-2 xs:px-3 py-2 w-full xs:w-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center gap-1 xs:gap-2 mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaClock"], {
                                                                    className: "text-yellow-400 text-xs xs:text-sm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                    lineNumber: 1567,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-yellow-400 text-xs xs:text-sm font-semibold",
                                                                    children: "Request Pending"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                                    lineNumber: 1568,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                                            lineNumber: 1566,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-400 text-xs",
                                                            children: "Waiting for host approval"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/game/tournament/page.tsx",
                                                            lineNumber: 1570,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 1565,
                                                    columnNumber: 29
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>requestJoinTournament(tournament.id),
                                                    disabled: (tournament.registeredPlayers?.length || tournament.currentPlayers) >= (tournament.playerCount || tournament.maxPlayers),
                                                    className: "w-full xs:w-auto px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs xs:text-sm",
                                                    children: (tournament.registeredPlayers?.length || tournament.currentPlayers) >= (tournament.playerCount || tournament.maxPlayers) ? 'Full' : 'Request to Join'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                                    lineNumber: 1573,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                                lineNumber: 1563,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/game/tournament/page.tsx",
                                        lineNumber: 1534,
                                        columnNumber: 23
                                    }, this)
                                }, tournament.id, false, {
                                    fileName: "[project]/src/app/game/tournament/page.tsx",
                                    lineNumber: 1530,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/game/tournament/page.tsx",
                            lineNumber: 1528,
                            columnNumber: 17
                        }, this)
                    }, void 0, false),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setTournamentStep('setup'),
                                className: "w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base",
                                children: "Back to Setup"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1591,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: searchTournaments,
                                className: "w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base",
                                children: "Refresh Search"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/tournament/page.tsx",
                                lineNumber: 1597,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/tournament/page.tsx",
                        lineNumber: 1590,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/game/tournament/page.tsx",
                lineNumber: 1504,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/game/tournament/page.tsx",
            lineNumber: 1503,
            columnNumber: 7
        }, this);
    }
    // Return to setup for any other tournament steps
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4",
                    children: "Tournament Feature"
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1613,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base",
                    children: "Tournament setup and registration only"
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1614,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/game'),
                    className: "px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base",
                    children: "Back to Game Modes"
                }, void 0, false, {
                    fileName: "[project]/src/app/game/tournament/page.tsx",
                    lineNumber: 1615,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/game/tournament/page.tsx",
            lineNumber: 1612,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/game/tournament/page.tsx",
        lineNumber: 1611,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_026bb8c5._.js.map