(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/store/userStore.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/frontend/src/store/userStore.js'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/frontend/src/app/(protected)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/store/userStore.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const DEFAULT_PROFILE_IMAGE = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg';
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"])({
        "Home.useUserStore[user]": (state)=>state.user
    }["Home.useUserStore[user]"]);
    const clearUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"])({
        "Home.useUserStore[clearUser]": (state)=>state.clearUser
    }["Home.useUserStore[clearUser]"]);
    const hasHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"])({
        "Home.useUserStore[hasHydrated]": (state)=>state._hasHydrated
    }["Home.useUserStore[hasHydrated]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!hasHydrated) return;
            if (!user) {
                router.replace('/signIn');
            }
        }
    }["Home.useEffect"], [
        user,
        hasHydrated,
        router
    ]);
    if (!hasHydrated || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen w-full flex items-center justify-center bg-black text-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Loading user session..."
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this);
    }
    const handleLogout = ()=>{
        clearUser();
        localStorage.removeItem('jwt_token');
        router.replace('/signIn');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 p-8 text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "border border-gray-700 bg-gray-800 p-8 rounded-2xl shadow-xl max-w-lg w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-4xl font-extrabold text-center mb-6 text-blue-400",
                    children: "Welcome to the Dashboard!"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: user.profile_img || DEFAULT_PROFILE_IMAGE,
                            alt: "Profile",
                            width: 150,
                            height: 150,
                            className: "rounded-full mx-auto mb-6 border-4 border-white object-cover"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-bold mb-4",
                            children: user.username
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full space-y-2 text-left text-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Full Name:"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                            lineNumber: 51,
                                            columnNumber: 16
                                        }, this),
                                        " ",
                                        user.fullname
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Email:"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                            lineNumber: 52,
                                            columnNumber: 16
                                        }, this),
                                        " ",
                                        user.email
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "ID:"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                            lineNumber: 53,
                                            columnNumber: 16
                                        }, this),
                                        " ",
                                        user.id_user
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Languages:"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                            lineNumber: 54,
                                            columnNumber: 16
                                        }, this),
                                        " ",
                                        user.languages || 'N/A'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Bio:"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                            lineNumber: 55,
                                            columnNumber: 16
                                        }, this),
                                        " ",
                                        user.bio || 'Not set.'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold ".concat(user.is2FAEnabled ? 'text-green-400' : 'text-yellow-400'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "2FA Enabled:"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        user.is2FAEnabled ? 'Yes ✅' : 'No ⚠️'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap pt-2",
                                    children: [
                                        "**Token:** ",
                                        user.access_token ? user.access_token.substring(0, 30) + '...' : 'N/A'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLogout,
                            className: "mt-8 w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition duration-300 shadow-md",
                            children: "Logout"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/app/(protected)/page.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/app/(protected)/page.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/(protected)/page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(Home, "ngV9tHusgFtdyjB/cCuGCSNg1v4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_97af311b._.js.map