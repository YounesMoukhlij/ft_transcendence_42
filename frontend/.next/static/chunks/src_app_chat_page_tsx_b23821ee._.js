(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/chat/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>chatPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$sl$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/sl/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$emoji$2d$picker$2d$react$2f$dist$2f$emoji$2d$picker$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/emoji-picker-react/dist/emoji-picker-react.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/bs/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/io5/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/globalStore.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$chat$2f$tools$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/chat/tools.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
;
;
;
;
function handle_Emojis(setShow, show) {
    setShow(!show);
}
async function fetchData(title, setDboubleBlock, Setuser_block) {
    try {
        const user = localStorage.getItem('name');
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/getConversationId`, {
            user,
            friend: title
        });
        localStorage.setItem('conversationId', result.data.conversation_id);
        setDboubleBlock(result.data.is_double_block);
        Setuser_block(result.data.block_user);
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/getMsgs`, {
            id: result.data.conversation_id
        });
        return res.data;
    } catch (err) {
        console.error(err);
    }
}
const FreindsList = ({ photo, title, message, status, setConversation, setRoom, setimg, SetSelectContact })=>{
    const { setDboubleBlock, double_block, Setuser_block, user_block } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"])();
    const Get_Conversation = async ()=>{
        localStorage.setItem('room_select', title);
        setRoom(title);
        setimg(photo);
        SetSelectContact(true);
        const conversation = await fetchData(title, setDboubleBlock, Setuser_block);
        setConversation(conversation);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: Get_Conversation,
        className: "flex w-full h-full hover:flex hover:cursor-pointer hover:bg-[#515151] hover:backdrop-blur-[10px] hover:rounded-[20px]x",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-col pl-2 pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex w-15 h-15 2xl:w-20 2xl:h-20 ",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            className: "w-15 h-15 2xl:h-20 2xl:w-20 rounded-[50%]",
                            src: photo
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: status ? "test w-5 h-5 bg-[green] rounded-[50%] " : "test w-5 h-5 bg-[red] rounded-[50%] "
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col justify-center gap-2 pl-[10%]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-3xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 89,
                            columnNumber: 35
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "last-message",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: message.length > 30 ? message.substr(0, 26) + "..." : message
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/chat/page.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
};
_c = FreindsList;
function Test1({ friends, setMessages, setRoom, setImg, SetSelectContact }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "italic text-[70px] p-[5px]",
                    children: "Chats"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-around self-center w-[90%] rounded-[2rem] border-2 border-solid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "text-[25px] w-4/5 h-[4.5rem] pl-4 outline-none",
                        placeholder: "Search for a friend"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"], {
                            className: "text-[rgb(179,173,173)]",
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "body-of-chat flex flex-col overflow-scroll bg-black rounded-[40px] scrollbar-hide h-[48vh]",
                children: friends.map((friend, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FreindsList, {
                            photo: friend.profile_img,
                            title: friend.username,
                            message: friend.fullname,
                            status: friend.status,
                            setConversation: setMessages,
                            setRoom: setRoom,
                            setimg: setImg,
                            SetSelectContact: SetSelectContact
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this)
                    }, index, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/chat/page.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_c1 = Test1;
function chatPage() {
    _s();
    const { friends, addFriend, removeFriend, setFriends, updateFriendStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"])();
    const { messages, setMessages, addMessage, room, setRoom, profile_img, setImg } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"])();
    const { setDboubleBlock, double_block, Setuser_block, user_block } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"])();
    const { connect, username, socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"])();
    const [show, setShow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [input, setEmoji] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [dropmenu, setdropmenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirm_invite, setConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [display_chats, set_chats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [SelectContact, SetSelectContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function MessageDateComponent({ date }) {
        const currentDate = date?.split(' ')[0];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center my-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-grow border-t border-gray-300"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 168,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "mx-3 text-xs text-gray-500",
                    children: currentDate
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 169,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-grow border-t border-gray-300"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 170,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 167,
            columnNumber: 7
        }, this);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "chatPage.useEffect": ()=>{
            connect();
        }
    }["chatPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "chatPage.useEffect": ()=>{
            if (!socket) return;
            socket.onmessage = ({
                "chatPage.useEffect": (event)=>{
                    const { type, data } = JSON.parse(event.data);
                    if (type === "message") {
                        addMessage(data);
                    } else if (type === "block") {
                        setDboubleBlock(data.is_double_block);
                        Setuser_block(data.block_user);
                    } else if (type === "unfriend") {
                        removeFriend(data.username);
                    } else if (type === "status") {
                        updateFriendStatus(data.status, data.friend);
                    }
                }
            })["chatPage.useEffect"];
        }
    }["chatPage.useEffect"], [
        socket
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "chatPage.useEffect": ()=>{
            const fetchData = {
                "chatPage.useEffect.fetchData": async ()=>{
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/GetFriends`, {
                            params: {
                                username
                            }
                        });
                        console.log("data. ", res.data);
                        setFriends(res.data);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }["chatPage.useEffect.fetchData"];
            fetchData();
        }
    }["chatPage.useEffect"], [
        username
    ]);
    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            handleSend();
        }
    }
    async function handleBlock(friend, setDboubleBlock, double_block, Setuser_block, user_block) {
        const username = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"].getState().username;
        const id = localStorage.getItem('conversationId');
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/block`, {
            user: username,
            conv_id: id,
            friend: friend
        });
        Setuser_block(username);
        if (double_block < 2) setDboubleBlock(double_block + 1);
    }
    async function Deblock(friend, setDboubleBlock, double_block, Setuser_block, user_block) {
        const username = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"].getState().username;
        const id = localStorage.getItem('conversationId');
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/Deblock`, {
            user: username,
            conv_id: id,
            friend: friend
        });
        if (double_block > 0) {
            if (double_block === 2) {
                setDboubleBlock(1);
                Setuser_block(friend);
            } else if (double_block === 1) {
                setDboubleBlock(0);
                Setuser_block('');
            }
        }
    }
    async function handleUnfriend(friend, removeFriend) {
        const id = localStorage.getItem('conversationId');
        const username = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globalStore$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalStore"].getState().username;
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/unfriend`, {
            user: username,
            conv_id: id,
            friend: friend
        });
        removeFriend(friend);
    }
    const handleSend = async ()=>{
        if (input.length == 0) return;
        const user = localStorage.getItem('name');
        const friend = localStorage.getItem('room_select');
        const id = localStorage.getItem('conversationId');
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/IsOnline`, {
                params: {
                    username: friend
                }
            });
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`http://${("TURBOPACK compile-time value", "127.0.0.1")}:${("TURBOPACK compile-time value", "4444")}/sendMsg`, {
                user,
                input,
                id,
                friend
            });
            const object = {
                sender: user,
                message: input,
                conv_id: id,
                created_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$chat$2f$tools$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(),
                isSeen: data.data
            };
            addMessage(object);
        } catch (err) {
            console.error(err);
        }
        setEmoji('');
    };
    function handle_chats_display() {
        set_chats(!display_chats);
    }
    function handle_confirm_button() {
        setConfirm(false);
    }
    function handle_cancel_invite() {
        setConfirm(false);
    }
    function handle_dropmenu() {
        setdropmenu(!dropmenu);
    }
    function handle_confirm_invite() {
        setConfirm(true);
    }
    function move_emoji_to_input(object) {
        setShow(false);
        setEmoji((prevValue)=>prevValue + object.emoji);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "chatPage.useEffect": ()=>{
            const chatContainer = document.querySelector('.chat-body');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }["chatPage.useEffect"], [
        messages
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-center items-center h-full text-white ",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: " flex w-5/5 h-5/5 md:w-4/5 md:h-4/5 gap-[5%] ",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-1.5/5 h-full hidden  lg:flex flex-col border bg-[black] p-2 rounded-[35px] border-solid ",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Test1, {
                        friends: friends,
                        setMessages: setMessages,
                        setRoom: setRoom,
                        setImg: setImg,
                        SetSelectContact: SetSelectContact
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 354,
                        columnNumber: 14
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 353,
                    columnNumber: 12
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex self-start lg:hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaArrowRight"], {
                            onClick: handle_chats_display
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 364,
                            columnNumber: 62
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 364,
                        columnNumber: 54
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 364,
                    columnNumber: 11
                }, this),
                display_chats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: " ml-[7%] absolute h-[70%]   flex-col border bg-[black] p-2 rounded-[35px] border-solid  ",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Test1, {
                        friends: friends,
                        setMessages: setMessages,
                        setRoom: setRoom,
                        setImg: setImg,
                        SetSelectContact: SetSelectContact
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 366,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 365,
                    columnNumber: 30
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex w-[full] lg:w-9/12  flex-col border rounded-[35px] border-solid bg-black ",
                    children: [
                        "    ",
                        SelectContact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center h-[9%] rounded-[40px] ml-0.5 bg-[#3a3638] justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-3/5 sm:h-3/5 self-center sm:pl-[2%] ml-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            className: "rounded-[50%]",
                                            src: profile_img || null,
                                            alt: "image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 379,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "self-center   text-[1rem]  sm:text-[1.5rem] pl-[1rem]",
                                            children: room
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 380,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 378,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: " mr-[2rem] w-21 h-5 sm:h-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "flex pr-[4%]",
                                            onClick: handle_dropmenu,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$sl$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlOptions"], {
                                                className: "sm:w-10 sm:h-10  w-5 h-5 "
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 383,
                                                columnNumber: 76
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 383,
                                            columnNumber: 17
                                        }, this),
                                        dropmenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fixed flex flex-col w-28 self-",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-[70%] h-[50%] sm:w-full sm:h-full border p-[0.7rem]  border-solid sm:text-center bg-black hover:bg-amber-400",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "",
                                                        onClick: ()=>handleBlock(room, setDboubleBlock, double_block, Setuser_block, user_block),
                                                        children: "Block"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 149
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-[70%] h-[50%] sm:w-full sm:h-full border p-[0.7rem]  border-solid sm:text-center bg-black hover:bg-amber-400",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "",
                                                        onClick: ()=>handleUnfriend(room, removeFriend),
                                                        children: "Unfriend"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 149
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 387,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 385,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 382,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 377,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `chat-body flex flex-col overflow-scroll bg-[black] rounded-[40px] h-[85%] px-4 ${confirm_invite ? "blur-[15px]" : ""}`,
                            children: [
                                !SelectContact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex  flex-col items-center justify-center w-full h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: " Please select an item to see your conversations. "
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            className: "",
                                            src: "/animation.gif"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 398,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 36
                                }, this),
                                messages?.length > 0 && SelectContact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex w-[80%] sm:w-[25rem] bg-[rgb(168,147,104)] self-center mt-8 p-4 rounded-[10px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "The messages are end to end encrypted. Only people in this chat can read this conversation,so enjoy with your friend."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 403,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 402,
                                    columnNumber: 15
                                }, this),
                                SelectContact && messages.map((item, index)=>{
                                    if (item.conv_id == localStorage.getItem('conversationId')) {
                                        const currentDate = item.created_at.split(' ')[0];
                                        const prevDate = index > 0 ? messages[index - 1].created_at.split(' ')[0] : null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col",
                                            children: [
                                                currentDate !== prevDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageDateComponent, {
                                                    date: item.created_at
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 52
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex ${item.sender === localStorage.getItem('name') ? 'justify-end' : 'justify-start'} mb-2`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `p-3 rounded-lg flex flex-col ${item.sender === localStorage.getItem('name') ? 'bg-[#2E372E] text-white rounded-br-none' : 'bg-[#B0C4DE] text-black rounded-bl-none'}`,
                                                        style: {
                                                            maxWidth: '80%',
                                                            minWidth: '120px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "break-words",
                                                                children: item.message
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center mt-2 text-xs",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "whitespace-nowrap",
                                                                        children: new Date(item.created_at).toTimeString().slice(0, 5)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 424,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    item.sender === localStorage.getItem('name') && (item.isSeen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheckDouble"], {}, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 429,
                                                                        columnNumber: 45
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaCheck"], {}, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 429,
                                                                        columnNumber: 65
                                                                    }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 423,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 417,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 413,
                                            columnNumber: 21
                                        }, this);
                                    }
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 394,
                            columnNumber: 14
                        }, this),
                        SelectContact && (double_block === 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-4 rounded-[40px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-around w-full h-full items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "You can't send to this contact. Please deblock first."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 445,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>Deblock(room, setDboubleBlock, double_block, Setuser_block, user_block),
                                        className: "h-[2rem] w-[7rem] bg-white text-black rounded-[8px]",
                                        children: "Deblock"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 446,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 444,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 443,
                            columnNumber: 28
                        }, this) : double_block === 1 && user_block === localStorage.getItem("name") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-4 rounded-[40px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-around w-full h-full items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "You can't send to this contact. Please deblock first."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>Deblock(room, setDboubleBlock, double_block, Setuser_block, user_block),
                                        className: "h-[2rem] w-[7rem] bg-white text-black rounded-[8px]",
                                        children: "Deblock"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 455,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 453,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 452,
                            columnNumber: 29
                        }, this) : double_block === 1 && localStorage.getItem("name") !== user_block ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-4 rounded-[40px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-around w-full h-full items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: " Sorry You can't send message to this contact "
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 464,
                                    columnNumber: 31
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 463,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 462,
                            columnNumber: 27
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center h-[10%] justify-between bg-[#1B1B1B] mt-4 pl-4 rounded-[40px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pl-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handle_Emojis(setShow, show),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bs$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BsEmojiSmile"], {
                                                className: "sm:w-10 sm:h-10 w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 471,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 470,
                                            columnNumber: 31
                                        }, this),
                                        show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-[34%] top-[60%]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$emoji$2d$picker$2d$react$2f$dist$2f$emoji$2d$picker$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                onEmojiClick: move_emoji_to_input
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 475,
                                                columnNumber: 35
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 474,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 469,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-[90%] h-10 sm:h-16 px-4 py-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "w-full h-full bg-black p-4 rounded-[50px] outline-none",
                                        placeholder: "Message",
                                        onKeyDown: handleEnterKey,
                                        value: input,
                                        onChange: (e)=>setEmoji(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 480,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 479,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pr-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handle_confirm_invite,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoGameController"], {
                                            className: "sm:w-10 sm:h-10 w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 490,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 489,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 488,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex px-6 py-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoSend"], {
                                        onClick: handleSend,
                                        className: "sm:w-10 sm:h-10 w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 493,
                                    columnNumber: 29
                                }, this),
                                confirm_invite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col justify-between absolute w-[22rem] h-36 bg-gray-500 text-center border p-2 rounded-2xl border-solid left-[calc(50%)] top-[calc(50%)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "You are about to request a game session with zalaksya"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 498,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-end justify-between h-3/6 px-2 py-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center w-[48%] h-[70%] border bg-[rgb(201,49,38)] p-2 rounded-2xl border-solid",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handle_cancel_invite,
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 501,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center border h-[70%] w-[48%] bg-[rgb(14,154,54)] p-2 rounded-2xl border-solid",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/game",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            children: "Confirm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 39
                                                        }, this)
                                                    }, "/game", false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 35
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 499,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 497,
                                    columnNumber: 31
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 468,
                            columnNumber: 29
                        }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 375,
                    columnNumber: 12
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 352,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/chat/page.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
_s(chatPage, "DzPZxnUENJ6fe2lTzBtdEcUnf3A=");
var _c, _c1;
__turbopack_context__.k.register(_c, "FreindsList");
__turbopack_context__.k.register(_c1, "Test1");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_chat_page_tsx_b23821ee._.js.map