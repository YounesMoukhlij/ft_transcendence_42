module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/frontend/src/store/userStore.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUserStore",
    ()=>useUserStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function getFormattedDate() {
    try {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    } catch  {
        return new Date().toISOString();
    }
}
const useUserStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        _hasHydrated: false,
        socket: null,
        friends: [],
        messages: [],
        pendingRequests: [],
        sentRequests: [],
        contactId: -1,
        connect: ()=>{
            const state = get();
            if (state.socket || state.isConnect) return;
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            const token = undefined;
            const protocol = undefined;
            const url = undefined;
        },
        initConnection: ()=>{
            const id = get().user?.id_user;
            if (id) get().connect();
        },
        setContactId: (contactId)=>set({
                contactId
            }),
        setFriends: (friends)=>set({
                friends
            }),
        updateUserSetting: (mode, status)=>set((state)=>{
                if (mode === "sound_notification") {
                    return {
                        user: {
                            ...state.user,
                            sound_notification: status
                        }
                    };
                }
                if (mode === "typing_indicator") {
                    return {
                        user: {
                            ...state.user,
                            typing_indicator: status
                        }
                    };
                }
                if (mode === "read_receipts") {
                    return {
                        user: {
                            ...state.user,
                            read_receipts: status
                        }
                    };
                }
                if (mode === "status_share") {
                    return {
                        user: {
                            ...state.user,
                            status_share: status
                        }
                    };
                }
                return state;
            }),
        addFriend: (friend)=>set((state)=>({
                    friends: [
                        ...state.friends,
                        friend
                    ]
                })),
        removeFriend: (id_user)=>set((state)=>({
                    friends: state.friends.filter((u)=>u.id_user !== id_user)
                })),
        updateFriendStatus: (status, friendId)=>set((state)=>{
                const now = new Date();
                const currentTime = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0") + " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
                return {
                    friends: state.friends.map((f)=>f.id_user == friendId ? {
                            ...f,
                            status,
                            last_seen: status === 0 ? currentTime : f.last_seen
                        } : f)
                };
            }),
        updateTypingStatus: (status, friendId)=>set((state)=>({
                    friends: state.friends.map((f)=>f.id_user == friendId ? {
                            ...f,
                            isTyping: status
                        } : f)
                })),
        updatePinStatus: (attribute, friendId, value)=>{
            const isPinned = value !== -1;
            if (attribute === "user1") {
                set((state)=>({
                        friends: state.friends.map((f)=>f.id_user === friendId ? {
                                ...f,
                                pinnedUser1: value,
                                pinnedDateUser1: getFormattedDate(),
                                isPinned: isPinned
                            } : f)
                    }));
            } else if (attribute === "user2") {
                set((state)=>({
                        friends: state.friends.map((f)=>f.id_user === friendId ? {
                                ...f,
                                pinnedUser2: value,
                                pinnedDateUser2: getFormattedDate(),
                                isPinned: isPinned
                            } : f)
                    }));
            }
        },
        updateBlockState: (mode, id, friendId)=>{
            if (mode == 1) {
                set((state)=>({
                        friends: state.friends.map((f)=>f.id_user === friendId ? {
                                ...f,
                                blockedByUser1: id
                            } : f)
                    }));
            } else if (mode == 2) {
                set((state)=>({
                        friends: state.friends.map((f)=>f.id_user === friendId ? {
                                ...f,
                                blockedByUser2: id
                            } : f)
                    }));
            }
        },
        updateDeBlockState: (mode, friendId)=>{
            if (mode == 1) {
                set((state)=>({
                        friends: state.friends.map((f)=>f.id_user === friendId ? {
                                ...f,
                                blockedByUser1: -1
                            } : f)
                    }));
            } else if (mode == 2) {
                set((state)=>({
                        friends: state.friends.map((f)=>f.id_user === friendId ? {
                                ...f,
                                blockedByUser2: -1
                            } : f)
                    }));
            }
        },
        socketBlockState: (blockedByUser1, blockedByUser2, friendId)=>{
            set((state)=>({
                    friends: state.friends.map((f)=>f.id_user === friendId ? {
                            ...f,
                            blockedByUser1: blockedByUser1,
                            blockedByUser2: blockedByUser2
                        } : f)
                }));
        },
        // ----------------------
        //   FRIEND REQUESTS
        // ----------------------
        addPendingRequests: (friend)=>set((state)=>({
                    pendingRequests: [
                        ...state.pendingRequests,
                        friend
                    ]
                })),
        addPendingRequestsArray: (friendsArray)=>set(()=>({
                    pendingRequests: [
                        ...friendsArray
                    ]
                })),
        removePendingRequests: (id)=>set((state)=>({
                    pendingRequests: state.pendingRequests.filter((u)=>u.sender_user !== id)
                })),
        addSentRequests: (friend)=>set((state)=>({
                    sentRequests: [
                        ...state.sentRequests,
                        friend
                    ]
                })),
        addSentRequestsArray: (friendsArray)=>set(()=>({
                    sentRequests: [
                        ...friendsArray
                    ]
                })),
        removeSentRequests: (id)=>set((state)=>({
                    sentRequests: state.sentRequests.filter((u)=>u.getter_user !== id)
                })),
        // ----------------------
        //   MESSAGES
        // ----------------------
        setMessages: (messagesArray)=>set({
                messages: messagesArray
            }),
        addMessage: (data)=>set((state)=>{
                const time = getFormattedDate();
                return {
                    messages: [
                        ...state.messages,
                        {
                            sender: data.sender_user_id,
                            conv_id: data.conv_id,
                            message: data.message,
                            created_at: time,
                            isSeen: data.isSeen
                        }
                    ]
                };
            }),
        updateSeenMessage: (conv_id)=>set((state)=>({
                    messages: state.messages.map((f)=>f.conv_id == conv_id ? {
                            ...f,
                            isSeen: 1
                        } : f)
                })),
        updateLastMessage: (item, friendId)=>set((state)=>({
                    friends: state.friends.map((f)=>f.id_user == friendId ? {
                            ...f,
                            lastMessage: item.lastMessage,
                            lastMessageSender: item.sender,
                            lastMessageTime: item.lastMessageTime
                        } : f)
                })),
        // ----------------------
        //   OTHER
        // ----------------------
        setRoom: (room)=>set({
                room
            }),
        setImg: (img)=>set({
                profile_img: img
            }),
        // User auth
        setUser: (userObj)=>set({
                user: userObj
            }),
        getUser: ()=>get().user,
        clearUser: ()=>set({
                user: null
            }),
        logout: ()=>{
            set({
                user: null
            }); // Clears state
        },
        // Hydration flag
        setHasHydrated: (state)=>set({
                _hasHydrated: state
            })
    }), {
    name: "user-storage",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    getStorage: ()=>localStorage,
    // what to persist
    partialize: (state)=>({
            user: state.user,
            friends: state.friends,
            profile_img: state.profile_img
        }),
    onRehydrateStorage: (state)=>{
        return (state, error)=>{
            state.setHasHydrated(true);
            if (!error) state.initConnection();
        };
    }
}));
}),
"[project]/frontend/src/components/Logo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
// import lgo from public/Logo_pong-1.png
const Logo = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-20 h-15 flex  absolute items-center p-0 m-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            className: "w-64  ",
            src: "/Logo2.png",
            alt: "Logo"
        }, void 0, false, {
            fileName: "[project]/frontend/src/components/Logo.tsx",
            lineNumber: 8,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/Logo.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Logo;
}),
"[project]/frontend/src/components/Navbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/react-icons/io5/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/store/userStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$Logo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/Logo.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notificationIndex, setNotificationIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notificatiion, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unseenCount, SetunseenCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const notificationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hamburgerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { connect } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"])();
    const setUsername = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"].setState;
    const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"])((state)=>state.socket);
    const { addFriend, removeFriend, friends, addPendingRequests, addPendingRequestsArray, removePendingRequests, removeSentRequests } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"])((state)=>state.user);
    function isTimeValid(item) {
        const targetTimeString = item.expired;
        const [datePart, timePart] = targetTimeString.split(' ');
        const [yy, mm, dd] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        const fullYear = 2000 + yy;
        const targetTime = new Date(fullYear, mm - 1, dd, hours, minutes, seconds);
        const now = new Date();
        const diffSeconds = (now - targetTime) / 1000;
        if (diffSeconds <= 15) {
            setTimeout(()=>{
                const newExpired = ((d)=>(d.setFullYear(d.getFullYear() - 1), `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`))(new Date(item.expired.replace(/(\d+)-(\d+)-(\d+)/, "20$3-$2-$1")));
                setNotification((prev)=>prev.map((it)=>it.id === item.id ? {
                            ...it,
                            expired: newExpired
                        } : it));
                return false;
            }, diffSeconds * 10000);
        }
        return diffSeconds <= 15;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setUsername({
            username: user?.username
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            const target = event.target;
            if (notificationRef.current && !notificationRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
                setNotificationIndex(false);
            }
            if (hamburgerRef.current && !hamburgerRef.current.contains(target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    async function DelteFriendRequest(notify_id) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Deleted');
        const sender_id = notificatiion.filter((item)=>item.notify_id == notify_id)[0].sender_user;
        setNotification((notificatiion)=>notificatiion.filter((item)=>item.notify_id !== notify_id));
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`http://${("TURBOPACK compile-time value", "localhost")}:${("TURBOPACK compile-time value", "4444")}/DeleteFriendRequest`, {
            params: {
                id: notify_id
            },
            headers: {
                Authorization: `Bearer ${user.access_token}`
            }
        });
        if (res.status == 200) {
            removePendingRequests(sender_id);
        }
    }
    async function AcceptFriendRequest(item) {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "localhost")}:${("TURBOPACK compile-time value", "4444")}/AddFriend`, {
            id: item.sender_user
        }, {
            headers: {
                Authorization: `Bearer ${user.access_token}`
            }
        });
        if (res.status === 200) {
            const object = {
                profile_img: item.sender_profile_img,
                username: item.sender_username,
                id_user: item.sender_user,
                conversation_id: res.data.lastInsertRowid,
                status: 0
            };
            removePendingRequests(item.sender_user);
            addFriend(object);
        }
        setNotification((notificatiion)=>notificatiion.filter((items)=>items.notify_id !== item.notify_id));
    }
    function showNotification() {
        setNotificationIndex(!notificationIndex);
        SetunseenCount(0);
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "localhost")}:${("TURBOPACK compile-time value", "4444")}/NotificationSeen`, {}, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    const toggleMobileMenu = ()=>{
        setMobileMenuOpen(!mobileMenuOpen);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user) return;
        async function get_notify() {
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`http://${("TURBOPACK compile-time value", "localhost")}:${("TURBOPACK compile-time value", "4444")}/GetNotification`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`
                    }
                });
                setNotification(result.data.reverse());
                addPendingRequestsArray(result.data.filter((object)=>object.title == "request friend"));
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        }
        get_notify();
    }, [
        user,
        friends
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        connect();
    }, [
        user?.id_user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        SetunseenCount(notificatiion.filter((n)=>!n.is_seen).length);
    }, [
        notificatiion
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket) return;
        const handleNotify = (event)=>{
            const { type, data } = JSON.parse(event.data);
            if (type === "notify") {
                if (data.title == "request friend") {
                    addPendingRequests({
                        sender_user: data.sender_user,
                        sender_username: data.sender_username,
                        notify_id: data.notify_id
                    });
                } else if (data.title == "friend request accepted") {
                    removeSentRequests(data.sender_user);
                    addFriend({
                        id_user: data.sender_user
                    });
                }
                setNotification((prev)=>[
                        {
                            sender_user: data.sender_user,
                            title: data.title,
                            sender_username: data.sender_username,
                            sender_profile_img: data.sender_profile_img,
                            notify_id: data.notify_id,
                            expired: data.expired
                        },
                        ...prev
                    ]);
            } else if (type == "unfriend") {
                removeFriend(data.id_user);
            } else if (type == "rejected") {
                removeSentRequests(data.getter_user);
            } else if (type == "canceled request") {
                removePendingRequests(data.sender_user);
            }
        };
        socket.addEventListener("message", handleNotify);
        return ()=>{
            socket.removeEventListener("message", handleNotify);
        };
    }, [
        socket
    ]);
    async function AcceptGameChallenge(item) {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`http://${("TURBOPACK compile-time value", "localhost")}:${("TURBOPACK compile-time value", "4444")}/DeleteNotification`, {
            params: {
                id: item.notify_id
            },
            headers: {
                Authorization: `Bearer ${user.access_token}`
            }
        });
        if (res.status == 200) setNotification(notificatiion.filter((object)=>object.notify_id !== item.notify_id));
    }
    function RejectGameChallenge(item) {
        setNotification(notificatiion.filter((object)=>object.notify_id !== item.notify_id));
    }
    const sidebarItems = [
        {
            path: '/game',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoGameControllerOutline"], {
                className: "text-xl"
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/Navbar.tsx",
                lineNumber: 221,
                columnNumber: 28
            }, this),
            alt: 'Game'
        },
        {
            path: '/chat',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoChatbubbleOutline"], {
                className: "text-xl"
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/Navbar.tsx",
                lineNumber: 222,
                columnNumber: 28
            }, this),
            alt: 'Chat'
        },
        {
            path: '/profile',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoPersonOutline"], {
                className: "text-xl"
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/Navbar.tsx",
                lineNumber: 223,
                columnNumber: 31
            }, this),
            alt: 'Profile'
        },
        {
            path: '/settings',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoSettingsOutline"], {
                className: "text-xl"
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/Navbar.tsx",
                lineNumber: 224,
                columnNumber: 32
            }, this),
            alt: 'Settings'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 px-2 h-24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[98%] md:max-w-[96%] h-full border border-gray-800 bg-black rounded-3xl px-6 flex justify-between items-center shadow-2xl relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$Logo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                            lineNumber: 236,
                            columnNumber: 14
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoSearchOutline"], {
                                    className: "text-gray-400 w-5 h-5 group-hover:text-black transition-colors"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                lineNumber: 242,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                ref: buttonRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: showNotification,
                                        className: "border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300 relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoNotificationsOutline"], {
                                                className: "text-gray-400 w-5 h-5 group-hover:text-black transition-colors"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 253,
                                                columnNumber: 15
                                            }, this),
                                            notificatiion.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border border-black transform translate-x-1/4 -translate-y-1/4 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 255,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this),
                                    notificationIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: notificationRef,
                                        className: "absolute right-0 top-full mt-4 w-96 max-h-[500px] bg-black border-2 border-gray-500 rounded-2xl overflow-hidden shadow-2xl z-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 border-b border-gray-700 font-semibold text-white bg-gray-900/50",
                                                children: "Notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 265,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "max-h-[450px] overflow-y-auto custom-scrollbar",
                                                children: notificatiion.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center text-gray-400 py-8 text-sm",
                                                    children: "No notifications"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 23
                                                }, this) : notificatiion.map((item, index)=>{
                                                    if (item.title === "game challenge") {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: item.sender_profile_img,
                                                                    alt: "profile",
                                                                    className: "w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 281,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-white font-semibold",
                                                                            children: item.sender_username
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 287,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-400",
                                                                            children: [
                                                                                "invited you to a ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-blue-400 font-medium",
                                                                                    children: "1 vs 1 game"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                                    lineNumber: 291,
                                                                                    columnNumber: 52
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 286,
                                                                    columnNumber: 31
                                                                }, this),
                                                                isTimeValid(item) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>AcceptGameChallenge(item),
                                                                            className: "bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition",
                                                                            children: "Accept"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 296,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>RejectGameChallenge(item),
                                                                            className: "bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition",
                                                                            children: "Decline"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 302,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 295,
                                                                    columnNumber: 33
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-gray-500 text-sm",
                                                                    children: "expired"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 310,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 29
                                                        }, this);
                                                    }
                                                    if (item.title === "friend request accepted") {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 p-4 border-b border-gray-800 bg-green-900/20 hover:bg-green-800/30 transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: item.sender_profile_img,
                                                                    alt: "profile",
                                                                    className: "w-12 h-12 rounded-full border-2 border-green-500 object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 322,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-white font-semibold",
                                                                            children: item.sender_username
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 328,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-green-400 text-sm",
                                                                            children: "accepted your friend request"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 331,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 327,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 29
                                                        }, this);
                                                    }
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col p-4 border-b border-gray-800 hover:bg-gray-900/50 transition",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                            src: item.sender_profile_img,
                                                                            alt: "profile",
                                                                            className: "w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 346,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-white font-semibold",
                                                                            children: item.sender_username
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                            lineNumber: 351,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                    lineNumber: 345,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                lineNumber: 344,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>AcceptFriendRequest(item),
                                                                        className: "flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition",
                                                                        children: "Confirm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                        lineNumber: 357,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>DelteFriendRequest(item.notify_id),
                                                                        className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition",
                                                                        children: "Delete"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                        lineNumber: 363,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 268,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoPersonCircleOutline"], {
                                        className: "text-gray-400 w-5 h-5 group-hover:text-black transition-colors"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                        lineNumber: 382,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                    lineNumber: 381,
                                    columnNumber: 14
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                lineNumber: 380,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                        lineNumber: 240,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden relative",
                        ref: hamburgerRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleMobileMenu,
                                className: "p-2 text-white hover:bg-gray-800 rounded-full transition-colors",
                                children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoCloseOutline"], {
                                    className: "w-7 h-7"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                    lineNumber: 390,
                                    columnNumber: 31
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoMenuOutline"], {
                                    className: "w-7 h-7"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                    lineNumber: 390,
                                    columnNumber: 72
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this),
                            mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-full mt-4 w-64 bg-black border border-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 z-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-gray-500 text-xs uppercase font-bold mb-2 px-2",
                                                children: "Menu"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 397,
                                                columnNumber: 17
                                            }, this),
                                            sidebarItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.path,
                                                    onClick: ()=>setMobileMenuOpen(false),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white hover:text-black transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xl",
                                                                children: item.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: item.alt
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                        lineNumber: 400,
                                                        columnNumber: 21
                                                    }, this)
                                                }, item.path, false, {
                                                    fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                        lineNumber: 396,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-px bg-gray-800 w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                        lineNumber: 407,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoLogOutOutline"], {
                                                className: "text-xl"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 409,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Logout"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                                lineNumber: 410,
                                                columnNumber: 18
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/Navbar.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/Navbar.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/components/Navbar.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/src/components/Navbar.tsx",
            lineNumber: 230,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
}),
"[project]/frontend/src/components/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/react-icons/io5/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Sidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const navItems = [
        {
            path: '/profile',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoPersonOutline"], {}, void 0, false, {
                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                lineNumber: 18,
                columnNumber: 31
            }, this),
            alt: 'Profile'
        },
        {
            path: '/chat',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoChatbubbleOutline"], {}, void 0, false, {
                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                lineNumber: 19,
                columnNumber: 28
            }, this),
            alt: 'Chat'
        },
        {
            path: '/game',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoGameControllerOutline"], {}, void 0, false, {
                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                lineNumber: 20,
                columnNumber: 28
            }, this),
            alt: 'Game'
        },
        {
            path: '/leaderboard',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoTrophyOutline"], {}, void 0, false, {
                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                lineNumber: 21,
                columnNumber: 35
            }, this),
            alt: 'Leaderboard'
        },
        {
            path: '/settings',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoSettingsOutline"], {}, void 0, false, {
                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                lineNumber: 22,
                columnNumber: 32
            }, this),
            alt: 'Settings'
        }
    ];
    const isActive = (path)=>pathname === path;
    const handleLogout = ()=>{
        localStorage.clear();
        //  clear cookies
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = '/signIn';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden md:flex flex-col w-20 lg:w-24 sticky top-28 h-[calc(100vh-8rem)] items-center justify-center z-40",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full border border-gray-800 bg-black rounded-3xl py-6 flex flex-col justify-between shadow-2xl relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center space-y-4 w-full px-4",
                    children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.path,
                            className: "relative group w-full flex justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `
                p-3 rounded-xl transition-all duration-300 w-full flex justify-center
                ${isActive(item.path) ? 'bg-white text-black shadow-lg shadow-gray-900/50 scale-105' : 'text-gray-500 hover:text-white hover:bg-gray-900'}
              `,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl lg:text-3xl",
                                        children: item.icon
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: " absolute left-[80%] ml-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-gray-400 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap border border-gray-400 shadow-xl ",
                                    children: item.alt
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, item.path, true, {
                            fileName: "[project]/frontend/src/components/Sidebar.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/Sidebar.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full px-4 pt-4 border-t border-gray-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleLogout,
                        className: "relative group w-full flex justify-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: " p-3 rounded-xl transition-all duration-300 w-full flex justify-center text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-700 ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl lg:text-3xl hover:cursor-pointer",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IoLogOutOutline"], {}, void 0, false, {
                                        fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                        lineNumber: 88,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                    lineNumber: 87,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                lineNumber: 83,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: " absolute left-[80%] ml-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-gray-400 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap border border-gray-400 shadow-xl ",
                                children: "Logout"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/Sidebar.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/Sidebar.tsx",
                        lineNumber: 79,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/Sidebar.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/components/Sidebar.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/Sidebar.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/frontend/src/app/(protected)/ProtectedClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProtectedClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/store/userStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/react-toastify/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ProtectedClient({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, friends, updateSeenMessage, contactId, socket, addMessage, updateLastMessage, removeFriend, updateFriendStatus, Set_Display_game_invite, socketBlockState, setInviterData, addFriend, updateTypingStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$store$2f$userStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"])();
    const [audio, setAudio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const playSound = ()=>{
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(()=>{});
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const a = new Audio("/sound/message.mp3");
        setAudio(a);
        const unlock = ()=>{
            a.play().catch(()=>{});
            a.pause();
            a.currentTime = 0;
            window.removeEventListener("click", unlock);
        };
        window.addEventListener("click", unlock);
        return ()=>window.removeEventListener("click", unlock);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket) return;
        socket.onmessage = (event)=>{
            const { type, data } = JSON.parse(event.data);
            if (type === "message") {
                if (user.sound_notification) playSound();
                addMessage(data);
                updateLastMessage({
                    lastMessage: data.message,
                    sender: data.sender_user_id,
                    lastMessageTime: new Date().toISOString()
                }, data.sender_user_id);
            }
            if (type === "start_game") router.push("/game");
            if (type === "block") socketBlockState(data.blockedByUser1, data.blockedByUser2, data.id);
            if (type === "unfriend") removeFriend(data.id_user);
            if (type === "status") updateFriendStatus(data.status, data.friend);
            if (type === "game_invite") {
                Set_Display_game_invite(true);
                setInviterData(data);
                setTimeout(()=>Set_Display_game_invite(false), 5000);
            }
            if (type === "test") addFriend(data);
            if (type === "isTyping") {
                updateTypingStatus(1, data.friendId);
                setTimeout(()=>updateTypingStatus(0, data.friendId), 2000);
            }
            if (type === "seen") updateSeenMessage(data.conv_id);
        };
    }, [
        socket,
        user?.sound_notification,
        contactId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastContainer"], {
                position: "top-right",
                autoClose: 3000,
                theme: "dark"
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/(protected)/ProtectedClient.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1e2611b8._.js.map