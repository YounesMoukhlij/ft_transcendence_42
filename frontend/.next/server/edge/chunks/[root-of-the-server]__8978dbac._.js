(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__8978dbac._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// middleware.ts
__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// Define your protected and public paths
const PROTECTED_PATHS = [
    '/chat',
    '/profile',
    '/dashboard',
    '/settings',
    '/test'
];
const PUBLIC_PATHS = [
    '/signIn',
    '/signUp'
];
function middleware(request) {
    // const { user } = useUserStore.getState();
    // const token = user?.token;
    // request.cookies.set('auth_token', "testtttttttttttttttttttttttttttttttttttttttttttttttttttttt");
    // if (token) {
    //   request.cookies.set('auth_token', token);
    // }
    // console.log('middleware - user:', token);
    // ⚠️ IMPORTANT: Replace 'auth_token' with the actual name of your authentication cookie.
    const isAuthenticated = request.cookies.has('auth_token');
    const currentPath = request.nextUrl.pathname;
    const isProtectedPath = PROTECTED_PATHS.some((path)=>currentPath.startsWith(path));
    const isPublicPath = PUBLIC_PATHS.some((path)=>currentPath.startsWith(path));
    // 1. If trying to access a PROTECTED route without a token, redirect to signIn
    if (isProtectedPath && !isAuthenticated) {
        const signInUrl = new URL('/signIn', request.url);
        // Optional: Add a redirect query parameter to return the user after login
        // signInUrl.searchParams.set('redirect', currentPath) 
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(signInUrl);
    }
    // 2. If trying to access a PUBLIC route while ALREADY logged in, redirect to dashboard
    // if (isPublicPath && isAuthenticated) {
    //   return NextResponse.redirect(new URL('/', request.url))
    // }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    // Use a regex to match all paths except for static files, API calls, etc.
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__8978dbac._.js.map