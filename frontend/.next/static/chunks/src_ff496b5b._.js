(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/GameCustomization.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const tableBackgrounds = [
    {
        name: 'Classic Green',
        value: '#15803d',
        type: 'color'
    },
    {
        name: 'Blue Gradient',
        value: 'linear-gradient(135deg, #3b82f6, #1e3a8a)',
        type: 'gradient'
    },
    {
        name: 'Sunset',
        value: 'linear-gradient(135deg, #ec4899, #f59e0b, #ea580c)',
        type: 'gradient'
    },
    {
        name: 'Dark Blue',
        value: '#1e40af',
        type: 'color'
    }
];
const ballColors = [
    '#ffffff',
    '#f87171',
    '#60a5fa',
    '#fbbf24',
    '#34d399',
    '#a78bfa'
];
const paddleColors = [
    '#f87171',
    '#60a5fa',
    '#fbbf24',
    '#34d399',
    '#a78bfa',
    '#f3f4f6'
];
const GameCustomization = ({ onBack, onStartGame })=>{
    _s();
    const { setCustomisation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"])();
    const [tableBg, setTableBg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ballColor, setBallColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paddleColor, setPaddleColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isReady = tableBg && ballColor && paddleColor;
    const handleStartGame = ()=>{
        if (isReady) {
            setCustomisation({
                tableBg,
                ballColor,
                paddleColor
            });
            onStartGame();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-[100%] h-[100%]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: 'linear-gradient(145deg, #374151, #1f2937)',
                boxShadow: `
               inset 0 1px 0 rgba(255,255,255,0.1),
               inset 0 -1px 0 rgba(0,0,0,0.3),
               0 20px 40px rgba(0,0,0,0.4),
               0 0 0 1px rgba(255,255,255,0.05)
             `
            },
            className: "jsx-ccf1a1c21fe1cd5e" + " " + 'text-white opacity-98 w-[100%] h-[100%] rounded-2xl p-6 flex flex-col relative border-2 border-white',
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    },
                    className: "jsx-ccf1a1c21fe1cd5e" + " " + 'text-2xl font-bold text-center mb-3',
                    children: "Customize Your Playground"
                }, void 0, false, {
                    fileName: "[project]/src/components/GameCustomization.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex-1 flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    },
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "text-base font-semibold",
                                    children: "Table Background"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex gap-3 justify-center",
                                    children: tableBackgrounds.map((bg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                boxShadow: tableBg === bg.value ? `
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 0 rgba(0,0,0,0.2),
                        0 6px 12px rgba(59,130,246,0.4),
                        0 0 0 2px rgba(59,130,246,0.6)
                      ` : `
                        inset 0 1px 0 rgba(255,255,255,0.2),
                        inset 0 -1px 0 rgba(0,0,0,0.3),
                        0 3px 6px rgba(0,0,0,0.3),
                        0 0 0 1px rgba(255,255,255,0.1)
                      `
                                            },
                                            onClick: ()=>setTableBg(bg.value),
                                            "aria-label": bg.name,
                                            className: "jsx-ccf1a1c21fe1cd5e" + " " + `w-12 h-12 rounded-lg border-2 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer
                    ${tableBg === bg.value ? 'scale-110' : 'hover:scale-105'}
                  `,
                                            children: bg.type === 'gradient' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    background: bg.value
                                                },
                                                className: "jsx-ccf1a1c21fe1cd5e" + " " + "w-full h-full rounded-md"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GameCustomization.tsx",
                                                lineNumber: 112,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: bg.value
                                                },
                                                className: "jsx-ccf1a1c21fe1cd5e" + " " + "w-full h-full rounded-md"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/GameCustomization.tsx",
                                                lineNumber: 117,
                                                columnNumber: 21
                                            }, this)
                                        }, bg.name, false, {
                                            fileName: "[project]/src/components/GameCustomization.tsx",
                                            lineNumber: 88,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    },
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "text-base font-semibold",
                                    children: "Ball Color"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex gap-3 flex-wrap justify-center",
                                    children: ballColors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, ${color}aa)`,
                                                boxShadow: ballColor === color ? `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 4px 8px rgba(59,130,246,0.4),
                        0 0 0 2px rgba(59,130,246,0.6)
                      ` : `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 2px 4px rgba(0,0,0,0.3)
                      `
                                            },
                                            onClick: ()=>setBallColor(color),
                                            "aria-label": color,
                                            className: "jsx-ccf1a1c21fe1cd5e" + " " + `w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer
                    ${ballColor === color ? 'scale-110' : 'hover:scale-105'}
                  `
                                        }, color, false, {
                                            fileName: "[project]/src/components/GameCustomization.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    },
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "text-base font-semibold",
                                    children: "Paddle Color"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex gap-3 flex-wrap justify-center",
                                    children: paddleColors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, ${color}aa)`,
                                                boxShadow: paddleColor === color ? `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 4px 8px rgba(59,130,246,0.4),
                        0 0 0 2px rgba(59,130,246,0.6)
                      ` : `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 2px 4px rgba(0,0,0,0.3)
                      `
                                            },
                                            onClick: ()=>setPaddleColor(color),
                                            "aria-label": color,
                                            className: "jsx-ccf1a1c21fe1cd5e" + " " + `w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer
                    ${paddleColor === color ? 'scale-110' : 'hover:scale-105'}
                  `
                                        }, color, false, {
                                            fileName: "[project]/src/components/GameCustomization.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    },
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "text-base font-semibold",
                                    children: "Preview"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: tableBg || 'linear-gradient(145deg, #374151, #1f2937)',
                                        boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.3),
                  0 6px 12px rgba(0,0,0,0.4),
                  0 0 0 1px rgba(255,255,255,0.1)
                `,
                                        border: '2px solid rgba(255,255,255,0.2)'
                                    },
                                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "w-[40%] h-32 self-center rounded-xl border-2 border-gray-700 flex items-center justify-center relative overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: `linear-gradient(180deg, ${paddleColor || '#fff'}, ${paddleColor || '#fff'}dd)`,
                                                boxShadow: `
                       inset 0 1px 0 rgba(255,255,255,0.3),
                       inset 0 -1px 0 rgba(0,0,0,0.3),
                       0 2px 4px rgba(0,0,0,0.3)
                     `,
                                                animation: 'paddleLeft 3s infinite ease-in-out'
                                            },
                                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "absolute left-1 top-1/2 -translate-y-1/2 w-2 h-12 rounded-full animate-paddle-left"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GameCustomization.tsx",
                                            lineNumber: 231,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: `linear-gradient(180deg, ${paddleColor || '#fff'}, ${paddleColor || '#fff'}dd)`,
                                                boxShadow: `
                       inset 0 1px 0 rgba(255,255,255,0.3),
                       inset 0 -1px 0 rgba(0,0,0,0.3),
                       0 2px 4px rgba(0,0,0,0.3)
                     `,
                                                animation: 'paddleRight 3s infinite ease-in-out'
                                            },
                                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "absolute right-1 top-1/2 -translate-y-1/2 w-2 h-12 rounded-full animate-paddle-right"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GameCustomization.tsx",
                                            lineNumber: 241,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: `radial-gradient(circle at 30% 30%, ${ballColor || '#fff'}, ${ballColor || '#fff'}dd, ${ballColor || '#fff'}aa)`,
                                                boxShadow: `
                    inset -1px -1px 2px rgba(0,0,0,0.3),
                    inset 1px 1px 2px rgba(255,255,255,0.3),
                    0 3px 6px rgba(0,0,0,0.4)
                  `,
                                                animation: 'bounceBall 4s infinite ease-in-out'
                                            },
                                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "absolute w-5 h-5 rounded-full animate-bounce-ball"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/GameCustomization.tsx",
                                            lineNumber: 252,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/GameCustomization.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        !isReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-ccf1a1c21fe1cd5e" + " " + "text-yellow-500 text-xs",
                                children: "All customization options must be selected to start the game"
                            }, void 0, false, {
                                fileName: "[project]/src/components/GameCustomization.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 268,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/GameCustomization.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-ccf1a1c21fe1cd5e" + " " + "flex justify-center space-x-4 pt-3 border-t border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onBack,
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm",
                            children: "Back to Player Setup"
                        }, void 0, false, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleStartGame,
                            disabled: !isReady,
                            style: {
                                boxShadow: isReady ? `
                  inset 0 1px 0 rgba(255,255,255,0.3),
                  inset 0 -1px 0 rgba(0,0,0,0.3),
                  0 4px 8px rgba(59,130,246,0.3),
                  0 0 0 1px rgba(59,130,246,0.2)
                ` : `
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -1px 0 rgba(0,0,0,0.3),
                  0 2px 4px rgba(0,0,0,0.2)
                `,
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            },
                            className: "jsx-ccf1a1c21fe1cd5e" + " " + `pb-2 cursor-pointer bg-black border-2 border-white hover:bg-white hover:text-black px-6 py-2 rounded-xl text-base font-bold transition-all duration-300
              ${isReady ? 'hover:scale-105' : 'cursor-not-allowed'}`,
                            children: "Start Game"
                        }, void 0, false, {
                            fileName: "[project]/src/components/GameCustomization.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/GameCustomization.tsx",
                    lineNumber: 277,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "ccf1a1c21fe1cd5e",
                    children: "@keyframes bounceBall{0%{transform:translate(60px,80%)}50%{transform:translate(calc(100% - 60px),90%)}to{transform:translate(60px,80%)}}@keyframes paddleLeft{0%{transform:translateY(-50%)}50%{transform:translateY(calc(100% - 48px))}to{transform:translateY(-50%)}}@keyframes paddleRight{0%{transform:translateY(calc(100% - 48px))}50%{transform:translateY(-50%)}to{transform:translateY(calc(100% - 48px))}}"
                }, void 0, false, void 0, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/GameCustomization.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/GameCustomization.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
};
_s(GameCustomization, "8wGU6tSlpq3o0YR/ANB08b3cXeI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"]
    ];
});
_c = GameCustomization;
const __TURBOPACK__default__export__ = GameCustomization;
var _c;
__turbopack_context__.k.register(_c, "GameCustomization");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/(protected)/game/customize/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CustomizePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameCustomization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GameCustomization.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function CustomizePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { gameState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"])();
    // Set page title based on game mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomizePage.useEffect": ()=>{
            const title = gameState.mode === 'ai' ? 'AI Game Customization' : gameState.mode === 'local' ? 'Local Game Customization' : gameState.mode === 'tournament' ? 'Online Game Customization' : 'Game Customization';
            document.title = title;
        }
    }["CustomizePage.useEffect"], [
        gameState.mode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomizePage.useEffect": ()=>{
            if (!gameState.mode) {
                router.push('/game');
            }
        }
    }["CustomizePage.useEffect"], [
        gameState.mode,
        router
    ]);
    if (!gameState.mode) {
        return null;
    }
    const handleBack = ()=>{
        if (gameState.mode === 'local' || gameState.mode === 'tournament') {
            router.push('/game/versus-selection');
        } else {
            router.push('/game');
        }
    };
    const handleStartGame = ()=>{
        if (gameState.mode === 'ai') {
            router.push('/game/ai');
        } else if (gameState.mode === 'local') {
            router.push('/game/local');
        } else if (gameState.mode === 'tournament') {
            router.push('/game/tournament');
        } else {
            router.push('/game/play');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-full  flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameCustomization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            onBack: handleBack,
            onStartGame: handleStartGame
        }, void 0, false, {
            fileName: "[project]/src/app/(protected)/game/customize/page.tsx",
            lineNumber: 53,
            columnNumber: 11
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(protected)/game/customize/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(CustomizePage, "L5/lhTOuMK+4MJt78Cx9rvtShzU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GameContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameContext"]
    ];
});
_c = CustomizePage;
var _c;
__turbopack_context__.k.register(_c, "CustomizePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_ff496b5b._.js.map