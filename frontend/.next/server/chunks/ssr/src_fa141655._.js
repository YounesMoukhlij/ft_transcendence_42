module.exports = [
"[project]/src/components/PingPongGame.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const PingPongGame = ()=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameContext"])();
    const { tableBg, paddleColor, ballColor } = gameState.customisation || {};
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
    // Initialize game based on mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeGame = ()=>{
            setLocalGameState((prev)=>({
                    ...prev,
                    gameStarted: true
                }));
        };
        initializeGame();
    }, [
        gameState.mode
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
            if (gameState.mode === 'ai') {
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
            if (newState.ball.x + ballRadius < 0) {
                newState.score.right++;
                newState.ball = {
                    x: gameWidth / 2,
                    y: gameHeight / 2,
                    dx: -3 * (Math.random() > 0.5 ? 1 : -1),
                    dy: (Math.random() - 0.5) * 4,
                    radius: ballRadius
                };
            } else if (newState.ball.x - ballRadius > gameWidth) {
                newState.score.left++;
                newState.ball = {
                    x: gameWidth / 2,
                    y: gameHeight / 2,
                    dx: 3 * (Math.random() > 0.5 ? 1 : -1),
                    dy: (Math.random() - 0.5) * 4,
                    radius: ballRadius
                };
            }
            // --- Win condition ---
            if (newState.score.left >= 20) {
                newState.winner = gameState.players[0]?.name || 'Player 1';
            } else if (newState.score.right >= 20) {
                newState.winner = gameState.mode === 'ai' ? 'AI Opponent' : gameState.players[1]?.name || 'Player 2';
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
        gameState.players
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
        ctx.restore();
        // --- 7. Draw winner overlay if needed ---
        if (localGameState.winner) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(tableX, tableY, tableW, tableH);
            ctx.fillStyle = '#fff';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${localGameState.winner} Wins!`, canvasWidth / 2, canvasHeight / 2);
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvasWidth / 2, canvasHeight / 2 + 40);
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
    // Handle restart
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyPress = (e)=>{
            if (e.key === 'r' && localGameState.winner) {
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
                    gameStarted: true,
                    winner: null
                });
                setPaused(false);
            }
        };
        window.addEventListener('keypress', handleKeyPress);
        return ()=>window.removeEventListener('keypress', handleKeyPress);
    }, [
        localGameState.winner
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
                        lineNumber: 476,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/PingPongGame.tsx",
                    lineNumber: 471,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 470,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
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
                        lineNumber: 486,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setPaused(false),
                        className: "px-8 py-4 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-2xl font-bold z-40 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaPlay"], {
                            className: "w-8 h-8"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PingPongGame.tsx",
                            lineNumber: 491,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 487,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 482,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
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
                            gameState.players && gameState.players[0]?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: gameState.players[0].avatar,
                                alt: "Player 1",
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white bg-gray-700 object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 500,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUserCircle"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 502,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white text-base xs:text-lg sm:text-xl md:text-2xl pl-2 sm:pl-5 md:pl-7 font-bold drop-shadow-md truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px]",
                                children: gameState.players && gameState.players[0]?.name ? gameState.players[0].name : 'PLAYER 1'
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 504,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 498,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-2 min-w-[120px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white text-base xs:text-lg sm:text-xl md:text-2xl pr-2 sm:pr-5 md:pr-7 font-bold drop-shadow-md truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px]",
                                children: gameState.mode === 'ai' ? 'THE MACHINIST (AI)' : gameState.players && gameState.players[1]?.name ? gameState.players[1].name : 'PLAYER 2'
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            gameState.mode === 'ai' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaRobot"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-300 bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : gameState.players && gameState.players[1]?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: gameState.players[1].avatar,
                                alt: "Player 2",
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-white bg-gray-700 object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 519,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUserCircle"], {
                                className: "w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white bg-gray-700 rounded-full border-2 border-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PingPongGame.tsx",
                                lineNumber: 521,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 496,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-[90px] w-full flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-full flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-[900px] aspect-[16/6] relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
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
                            lineNumber: 530,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 529,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/PingPongGame.tsx",
                    lineNumber: 528,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 527,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: gameState.mode === 'ai' ? 'Use W/S to control your paddle' : 'Left: W/S | Right: ↑/↓'
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 541,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-1",
                        children: "Click on P to pause / resume the game"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 545,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mt-3",
                        children: "First to 20 points wins!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PingPongGame.tsx",
                        lineNumber: 546,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PingPongGame.tsx",
                lineNumber: 540,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PingPongGame.tsx",
        lineNumber: 467,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = PingPongGame;
}),
"[project]/src/app/(protected)/game/remote/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RemoteGamePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/globalStore'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/globalSocket'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PingPongGame.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function RemoteGamePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { gameState, setGameRoom, setPlayers, setCustomisation, setIsHost, setGameMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameContext"])();
    // Component state
    const [gameStatus, setGameStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('menu');
    const [socket, setSocket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFriendsDropdown, setShowFriendsDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Mock friends list - replace with actual data from your API
    const friendsList = [
        {
            id: '1',
            name: 'Alice Johnson',
            avatar: '/api/placeholder/32/32',
            isOnline: true
        },
        {
            id: '2',
            name: 'Bob Smith',
            avatar: '/api/placeholder/32/32',
            isOnline: false
        },
        {
            id: '3',
            name: 'Carol Williams',
            avatar: '/api/placeholder/32/32',
            isOnline: true
        },
        {
            id: '4',
            name: 'David Brown',
            avatar: '/api/placeholder/32/32',
            isOnline: true
        },
        {
            id: '5',
            name: 'Emma Wilson',
            avatar: '/api/placeholder/32/32',
            isOnline: false
        }
    ];
    // Handle automatic matchmaking
    const findMatch = ()=>{
        const username = globalStore.getState().username || '';
        if (!socket || !username.trim()) {
            setError('No username found. Please log in.');
            return;
        }
        if (socket.readyState !== WebSocket.OPEN) {
            setError('Connection not ready. Please wait a moment and try again.');
            return;
        }
        setIsSearching(true);
        socket.send(JSON.stringify({
            type: 'game',
            action: 'findMatch',
            payload: {
                playerName: username.trim(),
                avatar: '',
                color: '#3B82F6'
            }
        }));
    };
    // Send direct invitation to a friend (without room codes)
    const sendInvitationToFriend = (friend)=>{
        const username = globalStore.getState().username || '';
        if (!socket || !username.trim()) {
            setError('No username found. Please log in.');
            return;
        }
        if (socket.readyState !== WebSocket.OPEN) {
            setError('Connection not ready. Please wait a moment and try again.');
            return;
        }
        socket.send(JSON.stringify({
            type: 'game',
            action: 'inviteFriend',
            payload: {
                playerName: username.trim(),
                friendId: friend.id,
                friendName: friend.name
            }
        }));
        console.log(`Invitation sent to ${friend.name}`);
    };
    // Set page title and game mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.title = 'Online Multiplayer Ping Pong';
        setGameMode('remote'); // Ensure remote mode is set
    }, []); // Empty dependency array - only run once on mount
    // Initialize WebSocket connection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const ws = getWebSocket();
        setSocket(ws);
        // Register user using username from globalStore
        const username = globalStore.getState().username || '';
        const sendUsername = ()=>{
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(username);
            }
        };
        const handleGameMessage = (message)=>{
            // Handle matchmaking result
            if (message.type === 'matchFound') {
                setIsSearching(false);
                setGameRoom({
                    id: message.data.roomId,
                    status: 'waiting',
                    playerId: message.data.playerId
                });
                setPlayers(message.data.players);
                setGameStatus('waiting');
                setError('');
                setIsHost(message.data.isHost);
                return;
            }
            if (message.type === 'matchNotFound') {
                setIsSearching(false);
                setError('No match found. Please try again.');
                return;
            }
            switch(message.type){
                case 'roomCreated':
                    setGameRoom({
                        id: message.data.roomId,
                        status: 'waiting',
                        playerId: message.data.gameState.players[0].id
                    });
                    setPlayers(message.data.gameState.players);
                    setGameStatus('waiting');
                    setError('');
                    // Set host flag
                    setIsHost(true);
                    // Check if there's a friend to auto-invite
                    const friendToInviteStr = sessionStorage.getItem('friendToInvite');
                    if (friendToInviteStr) {
                        try {
                            const friendToInvite = JSON.parse(friendToInviteStr);
                            sessionStorage.removeItem('friendToInvite');
                            // Send invitation automatically
                            setTimeout(()=>{
                                const roomCode = message.data.roomId;
                                const inviteLink = `${window.location.origin}/game/remote?room=${roomCode}`;
                                const inviteMessage = `Hey ${friendToInvite.name}! Come play Ping Pong with me! Join my game room: ${roomCode}\n\nClick here to join: ${inviteLink}`;
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Ping Pong Game Invitation`,
                                        text: `Join my Ping Pong game! Room: ${roomCode}`,
                                        url: inviteLink
                                    }).catch(()=>{
                                        navigator.clipboard.writeText(inviteMessage).then(()=>{
                                            alert(`Room created! Invitation copied to clipboard for ${friendToInvite.name}.`);
                                        });
                                    });
                                } else {
                                    navigator.clipboard.writeText(inviteMessage).then(()=>{
                                        alert(`Room created! Invitation copied to clipboard for ${friendToInvite.name}.`);
                                    });
                                }
                            }, 500); // Small delay to ensure UI is updated
                        } catch (e) {
                            console.error('Error parsing friend to invite:', e);
                        }
                    }
                    break;
                case 'roomJoined':
                    setGameRoom({
                        id: message.data.roomId,
                        status: 'waiting',
                        playerId: message.data.gameState.players.find((p)=>p.id !== gameState.gameRoom?.playerId)?.id
                    });
                    setPlayers(message.data.gameState.players);
                    setGameStatus('waiting');
                    setError('');
                    // Set guest flag
                    setIsHost(false);
                    break;
                case 'playerJoined':
                    setPlayers(message.data.players);
                    if (message.data.players.length === 2) {
                        setGameStatus('playing');
                    }
                    break;
                case 'roomJoinFailed':
                    setError(message.data.message);
                    break;
                case 'gameUpdate':
                    break;
                case 'gameSettingsUpdated':
                    setCustomisation(message.data.settings);
                    break;
                default:
                    console.log('Unhandled game message:', message);
            }
        };
        if (ws.readyState === WebSocket.OPEN) {
            sendUsername();
        } else {
            ws.addEventListener('open', sendUsername);
        }
        const handleMessage = (event)=>{
            try {
                const message = JSON.parse(event.data);
                handleGameMessage(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
        ws.addEventListener('message', handleMessage);
        return ()=>{
            ws.removeEventListener('message', handleMessage);
            ws.removeEventListener('open', sendUsername);
        };
    }, []); // Keep empty dependency array since we want this to run only once
    const leaveRoom = ()=>{
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'game',
                action: 'leaveRoom',
                payload: {}
            }));
        }
        setGameStatus('menu');
        setGameRoom(undefined);
        setPlayers([]);
        setError('');
    };
    const updateGameSetting = (settingKey, value)=>{
        if (!gameState.isHost || !socket) return;
        const newCustomisation = {
            ...gameState.customisation,
            [settingKey]: value || null
        };
        // Update local state immediately
        setCustomisation(newCustomisation);
        // Send to server
        socket.send(JSON.stringify({
            type: 'game',
            action: 'updateGameSettings',
            payload: {
                settings: {
                    [settingKey]: value || null
                }
            }
        }));
    };
    // Handle redirect if mode is not remote
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (gameState.mode && gameState.mode !== 'remote') {
            router.push('/game');
        }
    }, [
        gameState.mode,
        router
    ]);
    // Handle click outside dropdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowFriendsDropdown(false);
            }
        };
        if (showFriendsDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [
        showFriendsDropdown
    ]);
    // Don't render anything if mode is not set yet or not remote
    if (!gameState.mode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-[100%] w-[100%]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
            lineNumber: 301,
            columnNumber: 7
        }, this);
    }
    if (gameState.mode !== 'remote') {
        return null; // Will redirect via useEffect
    }
    if (gameStatus === 'playing') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-2",
                            children: "Online Game"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                            lineNumber: 315,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300",
                            children: [
                                "Room: ",
                                gameState.gameRoom?.id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center gap-4 mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: leaveRoom,
                                    className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
                                    children: "Leave Game"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/game'),
                                    className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors",
                                    children: "Back to Game Modes"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                            lineNumber: 317,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                    lineNumber: 314,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PingPongGame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                    lineNumber: 332,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
            lineNumber: 313,
            columnNumber: 7
        }, this);
    }
    if (gameStatus === 'waiting') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center max-w-md mx-auto p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-white mb-6",
                        children: "Waiting for Player"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                        lineNumber: 341,
                        columnNumber: 11
                    }, this),
                    gameState.isHost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800 rounded-lg p-6 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-semibold text-white mb-4",
                                children: "Customize Game"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                lineNumber: 346,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: findMatch,
                                        className: `w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold ${isSearching ? 'opacity-60 cursor-not-allowed' : ''}`,
                                        disabled: isSearching,
                                        children: isSearching ? 'Searching for Opponent...' : 'Find Match (Auto)'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 349,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-white text-sm font-bold mb-2",
                                                children: "Table Background"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 357,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: gameState.customisation.tableBg || '',
                                                onChange: (e)=>updateGameSetting('tableBg', e.target.value),
                                                className: "w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Default"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "space",
                                                        children: "Space"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "neon",
                                                        children: "Neon"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 367,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "retro",
                                                        children: "Retro"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 368,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 360,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-white text-sm font-bold mb-2",
                                                children: "Ball Color"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 373,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: gameState.customisation.ballColor || '',
                                                onChange: (e)=>updateGameSetting('ballColor', e.target.value),
                                                className: "w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Default"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#FF0000",
                                                        children: "Red"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#00FF00",
                                                        children: "Green"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#0000FF",
                                                        children: "Blue"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#FFFF00",
                                                        children: "Yellow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#FF00FF",
                                                        children: "Purple"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 372,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-white text-sm font-bold mb-2",
                                                children: "Paddle Color"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 391,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: gameState.customisation.paddleColor || '',
                                                onChange: (e)=>updateGameSetting('paddleColor', e.target.value),
                                                className: "w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Default"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#FF0000",
                                                        children: "Red"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 400,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#00FF00",
                                                        children: "Green"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#0000FF",
                                                        children: "Blue"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#FFFF00",
                                                        children: "Yellow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "#FF00FF",
                                                        children: "Purple"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 394,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 390,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                lineNumber: 348,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                        lineNumber: 345,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800 rounded-lg p-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-2",
                                children: [
                                    "Players (",
                                    gameState.players.length,
                                    "/2)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                lineNumber: 412,
                                columnNumber: 13
                            }, this),
                            gameState.players.map((player, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-300 py-1",
                                    children: [
                                        index + 1,
                                        ". ",
                                        player.name
                                    ]
                                }, player.id, true, {
                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                    lineNumber: 414,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                        lineNumber: 411,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: leaveRoom,
                        className: "px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",
                        children: "Cancel Game"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                        lineNumber: 420,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                lineNumber: 340,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
            lineNumber: 339,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center max-w-lg mx-auto p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-4xl font-bold text-white mb-6",
                    children: "Online Multiplayer"
                }, void 0, false, {
                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                    lineNumber: 434,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-600 text-white p-3 rounded-lg mb-4",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                    lineNumber: 437,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 rounded-lg p-6 mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: findMatch,
                                className: `w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold ${isSearching ? 'opacity-60 cursor-not-allowed' : ''}`,
                                disabled: isSearching,
                                children: isSearching ? 'Searching for Opponent...' : 'Find Match (Auto)'
                            }, void 0, false, {
                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                lineNumber: 444,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center my-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                        className: "flex-grow border-gray-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 453,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-4 text-gray-400 text-sm",
                                        children: "OR"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                        className: "flex-grow border-gray-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                lineNumber: 452,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                ref: dropdownRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowFriendsDropdown(!showFriendsDropdown),
                                        className: "w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg",
                                        disabled: isSearching,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "👥"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 465,
                                                columnNumber: 17
                                            }, this),
                                            "Invite Friends",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `ml-2 transform transition-transform ${showFriendsDropdown ? 'rotate-180' : ''}`,
                                                children: "▼"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 467,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 15
                                    }, this),
                                    showFriendsDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 border-b border-gray-600",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 text-sm",
                                                    children: "Select a friend to invite:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 475,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "py-2",
                                                children: [
                                                    friendsList.map((friend)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between px-3 py-2 hover:bg-gray-600 transition-colors cursor-pointer",
                                                            onClick: ()=>{
                                                                sendInvitationToFriend(friend);
                                                                setShowFriendsDropdown(false);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                    src: friend.avatar,
                                                                                    alt: friend.name,
                                                                                    className: "w-8 h-8 rounded-full bg-gray-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                                    lineNumber: 490,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-gray-700 ${friend.isOnline ? 'bg-green-500' : 'bg-gray-500'}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                                    lineNumber: 495,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                            lineNumber: 489,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-white text-sm font-medium",
                                                                                    children: friend.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                                    lineNumber: 502,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: `text-xs ${friend.isOnline ? 'text-green-400' : 'text-gray-400'}`,
                                                                                    children: friend.isOnline ? 'Online' : 'Offline'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                                    lineNumber: 503,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                            lineNumber: 501,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                    lineNumber: 488,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-blue-400 text-xs",
                                                                    children: "Invite"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, friend.id, true, {
                                                            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                            lineNumber: 480,
                                                            columnNumber: 23
                                                        }, this)),
                                                    friendsList.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-center py-4 text-sm",
                                                        children: "No friends found"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                                lineNumber: 478,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                        lineNumber: 474,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                                lineNumber: 459,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                        lineNumber: 443,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                    lineNumber: 442,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/game'),
                    className: "px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors",
                    children: "Back to Game Modes"
                }, void 0, false, {
                    fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
                    lineNumber: 521,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
            lineNumber: 433,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(protected)/game/remote/page.tsx",
        lineNumber: 432,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_fa141655._.js.map