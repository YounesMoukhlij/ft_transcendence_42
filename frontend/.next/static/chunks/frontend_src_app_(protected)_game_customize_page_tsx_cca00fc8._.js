(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/app/(protected)/game/customize/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomizePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../../components/GameContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../components/GameCustomization'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function CustomizePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { gameState } = useGameContext();
    // Set page title based on game mode
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomizePage.useEffect": ()=>{
            const title = gameState.mode === 'ai' ? 'AI Game Customization' : gameState.mode === 'local' ? 'Local Game Customization' : gameState.mode === 'tournament' ? 'Online Game Customization' : 'Game Customization';
            document.title = title;
        }
    }["CustomizePage.useEffect"], [
        gameState.mode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-full  flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GameCustomization, {
            onBack: handleBack,
            onStartGame: handleStartGame
        }, void 0, false, {
            fileName: "[project]/frontend/src/app/(protected)/game/customize/page.tsx",
            lineNumber: 53,
            columnNumber: 11
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/(protected)/game/customize/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(CustomizePage, "L5/lhTOuMK+4MJt78Cx9rvtShzU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        useGameContext
    ];
});
_c = CustomizePage;
var _c;
__turbopack_context__.k.register(_c, "CustomizePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_app_%28protected%29_game_customize_page_tsx_cca00fc8._.js.map