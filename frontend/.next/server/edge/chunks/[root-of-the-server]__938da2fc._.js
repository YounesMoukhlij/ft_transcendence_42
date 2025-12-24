(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__938da2fc._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/frontend/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
const PROTECTED_PATHS = [
    '/',
    '/chat',
    '/profile',
    '/dashboard',
    '/settings',
    '/leaderboard'
];
const PUBLIC_PATHS = [
    '/signIn',
    '/signUp'
];
function middleware(request) {
    const isAuthenticated = request.cookies.has('auth_token');
    const currentPath = request.nextUrl.pathname;
    const isPublicPath = PUBLIC_PATHS.some((path)=>currentPath === path || currentPath.startsWith(path));
    const isProtectedPath = PROTECTED_PATHS.some((path)=>currentPath === path || currentPath.startsWith(path + '/'));
    // 1️⃣ Not logged in → block protected routes
    if (isProtectedPath && !isPublicPath && !isAuthenticated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/signIn', request.url));
    }
    // 2️⃣ Logged in → block auth pages
    if (isPublicPath && isAuthenticated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/profile', request.url));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__938da2fc._.js.map