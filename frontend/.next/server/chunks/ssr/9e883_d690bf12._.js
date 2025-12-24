module.exports = [
"[project]/frontend/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp,
    "mergeClasses",
    ()=>mergeClasses,
    "toCamelCase",
    ()=>toCamelCase,
    "toKebabCase",
    ()=>toKebabCase,
    "toPascalCase",
    ()=>toPascalCase
]);
const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
const toPascalCase = (string)=>{
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
};
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
 //# sourceMappingURL=defaultAttributes.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/Icon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-ssr] (ecmascript)");
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]));
;
 //# sourceMappingURL=Icon.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/Icon.js [app-ssr] (ecmascript)");
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
 //# sourceMappingURL=createLucideIcon.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>User
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
            key: "975kel"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "7",
            r: "4",
            key: "17ys0d"
        }
    ]
];
const User = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("user", __iconNode);
;
 //# sourceMappingURL=user.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript)");
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Shield
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }
    ]
];
const Shield = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("shield", __iconNode);
;
 //# sourceMappingURL=shield.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shield",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript)");
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CircleQuestionMark
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
            key: "1u773s"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];
const CircleQuestionMark = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("circle-question-mark", __iconNode);
;
 //# sourceMappingURL=circle-question-mark.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as HelpCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HelpCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript)");
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronDown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }
    ]
];
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("chevron-down", __iconNode);
;
 //# sourceMappingURL=chevron-down.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript)");
}),
"[project]/frontend/node_modules/qrcode.react/lib/esm/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRCodeCanvas",
    ()=>QRCodeCanvas,
    "QRCodeSVG",
    ()=>QRCodeSVG
]);
// src/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __spreadValues = (a, b)=>{
    for(var prop in b || (b = {}))if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)){
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
};
var __objRest = (source, exclude)=>{
    var target = {};
    for(var prop in source)if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols) for (var prop of __getOwnPropSymbols(source)){
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
    }
    return target;
};
;
// src/third-party/qrcodegen/index.ts
/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */ var qrcodegen;
((qrcodegen2)=>{
    const _QrCode = class _QrCode {
        /*-- Constructor (low level) and fields --*/ // Creates a new QR Code with the given version number,
        // error correction level, data codeword bytes, and mask number.
        // This is a low-level API that most users should not use directly.
        // A mid-level API is the encodeSegments() function.
        constructor(version, errorCorrectionLevel, dataCodewords, msk){
            this.version = version;
            this.errorCorrectionLevel = errorCorrectionLevel;
            // The modules of this QR Code (false = light, true = dark).
            // Immutable after constructor finishes. Accessed through getModule().
            this.modules = [];
            // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
            this.isFunction = [];
            if (version < _QrCode.MIN_VERSION || version > _QrCode.MAX_VERSION) throw new RangeError("Version value out of range");
            if (msk < -1 || msk > 7) throw new RangeError("Mask value out of range");
            this.size = version * 4 + 17;
            let row = [];
            for(let i = 0; i < this.size; i++)row.push(false);
            for(let i = 0; i < this.size; i++){
                this.modules.push(row.slice());
                this.isFunction.push(row.slice());
            }
            this.drawFunctionPatterns();
            const allCodewords = this.addEccAndInterleave(dataCodewords);
            this.drawCodewords(allCodewords);
            if (msk == -1) {
                let minPenalty = 1e9;
                for(let i = 0; i < 8; i++){
                    this.applyMask(i);
                    this.drawFormatBits(i);
                    const penalty = this.getPenaltyScore();
                    if (penalty < minPenalty) {
                        msk = i;
                        minPenalty = penalty;
                    }
                    this.applyMask(i);
                }
            }
            assert(0 <= msk && msk <= 7);
            this.mask = msk;
            this.applyMask(msk);
            this.drawFormatBits(msk);
            this.isFunction = [];
        }
        /*-- Static factory functions (high level) --*/ // Returns a QR Code representing the given Unicode text string at the given error correction level.
        // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
        // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
        // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
        // ecl argument if it can be done without increasing the version.
        static encodeText(text, ecl) {
            const segs = qrcodegen2.QrSegment.makeSegments(text);
            return _QrCode.encodeSegments(segs, ecl);
        }
        // Returns a QR Code representing the given binary data at the given error correction level.
        // This function always encodes using the binary segment mode, not any text mode. The maximum number of
        // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
        // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
        static encodeBinary(data, ecl) {
            const seg = qrcodegen2.QrSegment.makeBytes(data);
            return _QrCode.encodeSegments([
                seg
            ], ecl);
        }
        /*-- Static factory functions (mid level) --*/ // Returns a QR Code representing the given segments with the given encoding parameters.
        // The smallest possible QR Code version within the given range is automatically
        // chosen for the output. Iff boostEcl is true, then the ECC level of the result
        // may be higher than the ecl argument if it can be done without increasing the
        // version. The mask number is either between 0 to 7 (inclusive) to force that
        // mask, or -1 to automatically choose an appropriate mask (which may be slow).
        // This function allows the user to create a custom sequence of segments that switches
        // between modes (such as alphanumeric and byte) to encode text in less space.
        // This is a mid-level API; the high-level API is encodeText() and encodeBinary().
        static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
            if (!(_QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode.MAX_VERSION) || mask < -1 || mask > 7) throw new RangeError("Invalid value");
            let version;
            let dataUsedBits;
            for(version = minVersion;; version++){
                const dataCapacityBits2 = _QrCode.getNumDataCodewords(version, ecl) * 8;
                const usedBits = QrSegment.getTotalBits(segs, version);
                if (usedBits <= dataCapacityBits2) {
                    dataUsedBits = usedBits;
                    break;
                }
                if (version >= maxVersion) throw new RangeError("Data too long");
            }
            for (const newEcl of [
                _QrCode.Ecc.MEDIUM,
                _QrCode.Ecc.QUARTILE,
                _QrCode.Ecc.HIGH
            ]){
                if (boostEcl && dataUsedBits <= _QrCode.getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
            }
            let bb = [];
            for (const seg of segs){
                appendBits(seg.mode.modeBits, 4, bb);
                appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
                for (const b of seg.getData())bb.push(b);
            }
            assert(bb.length == dataUsedBits);
            const dataCapacityBits = _QrCode.getNumDataCodewords(version, ecl) * 8;
            assert(bb.length <= dataCapacityBits);
            appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
            appendBits(0, (8 - bb.length % 8) % 8, bb);
            assert(bb.length % 8 == 0);
            for(let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17)appendBits(padByte, 8, bb);
            let dataCodewords = [];
            while(dataCodewords.length * 8 < bb.length)dataCodewords.push(0);
            bb.forEach((b, i)=>dataCodewords[i >>> 3] |= b << 7 - (i & 7));
            return new _QrCode(version, ecl, dataCodewords, mask);
        }
        /*-- Accessor methods --*/ // Returns the color of the module (pixel) at the given coordinates, which is false
        // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
        // If the given coordinates are out of bounds, then false (light) is returned.
        getModule(x, y) {
            return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
        }
        // Modified to expose modules for easy access
        getModules() {
            return this.modules;
        }
        /*-- Private helper methods for constructor: Drawing function modules --*/ // Reads this object's version field, and draws and marks all function modules.
        drawFunctionPatterns() {
            for(let i = 0; i < this.size; i++){
                this.setFunctionModule(6, i, i % 2 == 0);
                this.setFunctionModule(i, 6, i % 2 == 0);
            }
            this.drawFinderPattern(3, 3);
            this.drawFinderPattern(this.size - 4, 3);
            this.drawFinderPattern(3, this.size - 4);
            const alignPatPos = this.getAlignmentPatternPositions();
            const numAlign = alignPatPos.length;
            for(let i = 0; i < numAlign; i++){
                for(let j = 0; j < numAlign; j++){
                    if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0)) this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
                }
            }
            this.drawFormatBits(0);
            this.drawVersion();
        }
        // Draws two copies of the format bits (with its own error correction code)
        // based on the given mask and this object's error correction level field.
        drawFormatBits(mask) {
            const data = this.errorCorrectionLevel.formatBits << 3 | mask;
            let rem = data;
            for(let i = 0; i < 10; i++)rem = rem << 1 ^ (rem >>> 9) * 1335;
            const bits = (data << 10 | rem) ^ 21522;
            assert(bits >>> 15 == 0);
            for(let i = 0; i <= 5; i++)this.setFunctionModule(8, i, getBit(bits, i));
            this.setFunctionModule(8, 7, getBit(bits, 6));
            this.setFunctionModule(8, 8, getBit(bits, 7));
            this.setFunctionModule(7, 8, getBit(bits, 8));
            for(let i = 9; i < 15; i++)this.setFunctionModule(14 - i, 8, getBit(bits, i));
            for(let i = 0; i < 8; i++)this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
            for(let i = 8; i < 15; i++)this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
            this.setFunctionModule(8, this.size - 8, true);
        }
        // Draws two copies of the version bits (with its own error correction code),
        // based on this object's version field, iff 7 <= version <= 40.
        drawVersion() {
            if (this.version < 7) return;
            let rem = this.version;
            for(let i = 0; i < 12; i++)rem = rem << 1 ^ (rem >>> 11) * 7973;
            const bits = this.version << 12 | rem;
            assert(bits >>> 18 == 0);
            for(let i = 0; i < 18; i++){
                const color = getBit(bits, i);
                const a = this.size - 11 + i % 3;
                const b = Math.floor(i / 3);
                this.setFunctionModule(a, b, color);
                this.setFunctionModule(b, a, color);
            }
        }
        // Draws a 9*9 finder pattern including the border separator,
        // with the center module at (x, y). Modules can be out of bounds.
        drawFinderPattern(x, y) {
            for(let dy = -4; dy <= 4; dy++){
                for(let dx = -4; dx <= 4; dx++){
                    const dist = Math.max(Math.abs(dx), Math.abs(dy));
                    const xx = x + dx;
                    const yy = y + dy;
                    if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size) this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
                }
            }
        }
        // Draws a 5*5 alignment pattern, with the center module
        // at (x, y). All modules must be in bounds.
        drawAlignmentPattern(x, y) {
            for(let dy = -2; dy <= 2; dy++){
                for(let dx = -2; dx <= 2; dx++)this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
            }
        }
        // Sets the color of a module and marks it as a function module.
        // Only used by the constructor. Coordinates must be in bounds.
        setFunctionModule(x, y, isDark) {
            this.modules[y][x] = isDark;
            this.isFunction[y][x] = true;
        }
        /*-- Private helper methods for constructor: Codewords and masking --*/ // Returns a new byte string representing the given data with the appropriate error correction
        // codewords appended to it, based on this object's version and error correction level.
        addEccAndInterleave(data) {
            const ver = this.version;
            const ecl = this.errorCorrectionLevel;
            if (data.length != _QrCode.getNumDataCodewords(ver, ecl)) throw new RangeError("Invalid argument");
            const numBlocks = _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
            const blockEccLen = _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
            const rawCodewords = Math.floor(_QrCode.getNumRawDataModules(ver) / 8);
            const numShortBlocks = numBlocks - rawCodewords % numBlocks;
            const shortBlockLen = Math.floor(rawCodewords / numBlocks);
            let blocks = [];
            const rsDiv = _QrCode.reedSolomonComputeDivisor(blockEccLen);
            for(let i = 0, k = 0; i < numBlocks; i++){
                let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
                k += dat.length;
                const ecc = _QrCode.reedSolomonComputeRemainder(dat, rsDiv);
                if (i < numShortBlocks) dat.push(0);
                blocks.push(dat.concat(ecc));
            }
            let result = [];
            for(let i = 0; i < blocks[0].length; i++){
                blocks.forEach((block, j)=>{
                    if (i != shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]);
                });
            }
            assert(result.length == rawCodewords);
            return result;
        }
        // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
        // data area of this QR Code. Function modules need to be marked off before this is called.
        drawCodewords(data) {
            if (data.length != Math.floor(_QrCode.getNumRawDataModules(this.version) / 8)) throw new RangeError("Invalid argument");
            let i = 0;
            for(let right = this.size - 1; right >= 1; right -= 2){
                if (right == 6) right = 5;
                for(let vert = 0; vert < this.size; vert++){
                    for(let j = 0; j < 2; j++){
                        const x = right - j;
                        const upward = (right + 1 & 2) == 0;
                        const y = upward ? this.size - 1 - vert : vert;
                        if (!this.isFunction[y][x] && i < data.length * 8) {
                            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
                            i++;
                        }
                    }
                }
            }
            assert(i == data.length * 8);
        }
        // XORs the codeword modules in this QR Code with the given mask pattern.
        // The function modules must be marked and the codeword bits must be drawn
        // before masking. Due to the arithmetic of XOR, calling applyMask() with
        // the same mask value a second time will undo the mask. A final well-formed
        // QR Code needs exactly one (not zero, two, etc.) mask applied.
        applyMask(mask) {
            if (mask < 0 || mask > 7) throw new RangeError("Mask value out of range");
            for(let y = 0; y < this.size; y++){
                for(let x = 0; x < this.size; x++){
                    let invert;
                    switch(mask){
                        case 0:
                            invert = (x + y) % 2 == 0;
                            break;
                        case 1:
                            invert = y % 2 == 0;
                            break;
                        case 2:
                            invert = x % 3 == 0;
                            break;
                        case 3:
                            invert = (x + y) % 3 == 0;
                            break;
                        case 4:
                            invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
                            break;
                        case 5:
                            invert = x * y % 2 + x * y % 3 == 0;
                            break;
                        case 6:
                            invert = (x * y % 2 + x * y % 3) % 2 == 0;
                            break;
                        case 7:
                            invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
                            break;
                        default:
                            throw new Error("Unreachable");
                    }
                    if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
                }
            }
        }
        // Calculates and returns the penalty score based on state of this QR Code's current modules.
        // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
        getPenaltyScore() {
            let result = 0;
            for(let y = 0; y < this.size; y++){
                let runColor = false;
                let runX = 0;
                let runHistory = [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ];
                for(let x = 0; x < this.size; x++){
                    if (this.modules[y][x] == runColor) {
                        runX++;
                        if (runX == 5) result += _QrCode.PENALTY_N1;
                        else if (runX > 5) result++;
                    } else {
                        this.finderPenaltyAddHistory(runX, runHistory);
                        if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
                        runColor = this.modules[y][x];
                        runX = 1;
                    }
                }
                result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode.PENALTY_N3;
            }
            for(let x = 0; x < this.size; x++){
                let runColor = false;
                let runY = 0;
                let runHistory = [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ];
                for(let y = 0; y < this.size; y++){
                    if (this.modules[y][x] == runColor) {
                        runY++;
                        if (runY == 5) result += _QrCode.PENALTY_N1;
                        else if (runY > 5) result++;
                    } else {
                        this.finderPenaltyAddHistory(runY, runHistory);
                        if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
                        runColor = this.modules[y][x];
                        runY = 1;
                    }
                }
                result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode.PENALTY_N3;
            }
            for(let y = 0; y < this.size - 1; y++){
                for(let x = 0; x < this.size - 1; x++){
                    const color = this.modules[y][x];
                    if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1]) result += _QrCode.PENALTY_N2;
                }
            }
            let dark = 0;
            for (const row of this.modules)dark = row.reduce((sum, color)=>sum + (color ? 1 : 0), dark);
            const total = this.size * this.size;
            const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
            assert(0 <= k && k <= 9);
            result += k * _QrCode.PENALTY_N4;
            assert(0 <= result && result <= 2568888);
            return result;
        }
        /*-- Private helper functions --*/ // Returns an ascending list of positions of alignment patterns for this version number.
        // Each position is in the range [0,177), and are used on both the x and y axes.
        // This could be implemented as lookup table of 40 variable-length lists of integers.
        getAlignmentPatternPositions() {
            if (this.version == 1) return [];
            else {
                const numAlign = Math.floor(this.version / 7) + 2;
                const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
                let result = [
                    6
                ];
                for(let pos = this.size - 7; result.length < numAlign; pos -= step)result.splice(1, 0, pos);
                return result;
            }
        }
        // Returns the number of data bits that can be stored in a QR Code of the given version number, after
        // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
        // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
        static getNumRawDataModules(ver) {
            if (ver < _QrCode.MIN_VERSION || ver > _QrCode.MAX_VERSION) throw new RangeError("Version number out of range");
            let result = (16 * ver + 128) * ver + 64;
            if (ver >= 2) {
                const numAlign = Math.floor(ver / 7) + 2;
                result -= (25 * numAlign - 10) * numAlign - 55;
                if (ver >= 7) result -= 36;
            }
            assert(208 <= result && result <= 29648);
            return result;
        }
        // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
        // QR Code of the given version number and error correction level, with remainder bits discarded.
        // This stateless pure function could be implemented as a (40*4)-cell lookup table.
        static getNumDataCodewords(ver, ecl) {
            return Math.floor(_QrCode.getNumRawDataModules(ver) / 8) - _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
        }
        // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
        // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
        static reedSolomonComputeDivisor(degree) {
            if (degree < 1 || degree > 255) throw new RangeError("Degree out of range");
            let result = [];
            for(let i = 0; i < degree - 1; i++)result.push(0);
            result.push(1);
            let root = 1;
            for(let i = 0; i < degree; i++){
                for(let j = 0; j < result.length; j++){
                    result[j] = _QrCode.reedSolomonMultiply(result[j], root);
                    if (j + 1 < result.length) result[j] ^= result[j + 1];
                }
                root = _QrCode.reedSolomonMultiply(root, 2);
            }
            return result;
        }
        // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
        static reedSolomonComputeRemainder(data, divisor) {
            let result = divisor.map((_)=>0);
            for (const b of data){
                const factor = b ^ result.shift();
                result.push(0);
                divisor.forEach((coef, i)=>result[i] ^= _QrCode.reedSolomonMultiply(coef, factor));
            }
            return result;
        }
        // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
        // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
        static reedSolomonMultiply(x, y) {
            if (x >>> 8 != 0 || y >>> 8 != 0) throw new RangeError("Byte out of range");
            let z = 0;
            for(let i = 7; i >= 0; i--){
                z = z << 1 ^ (z >>> 7) * 285;
                z ^= (y >>> i & 1) * x;
            }
            assert(z >>> 8 == 0);
            return z;
        }
        // Can only be called immediately after a light run is added, and
        // returns either 0, 1, or 2. A helper function for getPenaltyScore().
        finderPenaltyCountPatterns(runHistory) {
            const n = runHistory[1];
            assert(n <= this.size * 3);
            const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
            return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
        }
        // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
        finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
            if (currentRunColor) {
                this.finderPenaltyAddHistory(currentRunLength, runHistory);
                currentRunLength = 0;
            }
            currentRunLength += this.size;
            this.finderPenaltyAddHistory(currentRunLength, runHistory);
            return this.finderPenaltyCountPatterns(runHistory);
        }
        // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
        finderPenaltyAddHistory(currentRunLength, runHistory) {
            if (runHistory[0] == 0) currentRunLength += this.size;
            runHistory.pop();
            runHistory.unshift(currentRunLength);
        }
    };
    /*-- Constants and tables --*/ // The minimum version number supported in the QR Code Model 2 standard.
    _QrCode.MIN_VERSION = 1;
    // The maximum version number supported in the QR Code Model 2 standard.
    _QrCode.MAX_VERSION = 40;
    // For use in getPenaltyScore(), when evaluating which mask is best.
    _QrCode.PENALTY_N1 = 3;
    _QrCode.PENALTY_N2 = 3;
    _QrCode.PENALTY_N3 = 40;
    _QrCode.PENALTY_N4 = 10;
    _QrCode.ECC_CODEWORDS_PER_BLOCK = [
        // Version: (note that index 0 is for padding, and is set to an illegal value)
        //0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
        [
            -1,
            7,
            10,
            15,
            20,
            26,
            18,
            20,
            24,
            30,
            18,
            20,
            24,
            26,
            30,
            22,
            24,
            28,
            30,
            28,
            28,
            28,
            28,
            30,
            30,
            26,
            28,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30
        ],
        // Low
        [
            -1,
            10,
            16,
            26,
            18,
            24,
            16,
            18,
            22,
            22,
            26,
            30,
            22,
            22,
            24,
            24,
            28,
            28,
            26,
            26,
            26,
            26,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28
        ],
        // Medium
        [
            -1,
            13,
            22,
            18,
            26,
            18,
            24,
            18,
            22,
            20,
            24,
            28,
            26,
            24,
            20,
            30,
            24,
            28,
            28,
            26,
            30,
            28,
            30,
            30,
            30,
            30,
            28,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30
        ],
        // Quartile
        [
            -1,
            17,
            28,
            22,
            16,
            22,
            28,
            26,
            26,
            24,
            28,
            24,
            28,
            22,
            24,
            24,
            30,
            28,
            28,
            26,
            28,
            30,
            24,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30
        ]
    ];
    _QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
        // Version: (note that index 0 is for padding, and is set to an illegal value)
        //0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
        [
            -1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            4,
            4,
            6,
            6,
            6,
            6,
            7,
            8,
            8,
            9,
            9,
            10,
            12,
            12,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            19,
            20,
            21,
            22,
            24,
            25
        ],
        // Low
        [
            -1,
            1,
            1,
            1,
            2,
            2,
            4,
            4,
            4,
            5,
            5,
            5,
            8,
            9,
            9,
            10,
            10,
            11,
            13,
            14,
            16,
            17,
            17,
            18,
            20,
            21,
            23,
            25,
            26,
            28,
            29,
            31,
            33,
            35,
            37,
            38,
            40,
            43,
            45,
            47,
            49
        ],
        // Medium
        [
            -1,
            1,
            1,
            2,
            2,
            4,
            4,
            6,
            6,
            8,
            8,
            8,
            10,
            12,
            16,
            12,
            17,
            16,
            18,
            21,
            20,
            23,
            23,
            25,
            27,
            29,
            34,
            34,
            35,
            38,
            40,
            43,
            45,
            48,
            51,
            53,
            56,
            59,
            62,
            65,
            68
        ],
        // Quartile
        [
            -1,
            1,
            1,
            2,
            4,
            4,
            4,
            5,
            6,
            8,
            8,
            11,
            11,
            16,
            16,
            18,
            16,
            19,
            21,
            25,
            25,
            25,
            34,
            30,
            32,
            35,
            37,
            40,
            42,
            45,
            48,
            51,
            54,
            57,
            60,
            63,
            66,
            70,
            74,
            77,
            81
        ]
    ];
    let QrCode = _QrCode;
    qrcodegen2.QrCode = _QrCode;
    function appendBits(val, len, bb) {
        if (len < 0 || len > 31 || val >>> len != 0) throw new RangeError("Value out of range");
        for(let i = len - 1; i >= 0; i--)bb.push(val >>> i & 1);
    }
    function getBit(x, i) {
        return (x >>> i & 1) != 0;
    }
    function assert(cond) {
        if (!cond) throw new Error("Assertion error");
    }
    const _QrSegment = class _QrSegment {
        /*-- Constructor (low level) and fields --*/ // Creates a new QR Code segment with the given attributes and data.
        // The character count (numChars) must agree with the mode and the bit buffer length,
        // but the constraint isn't checked. The given bit buffer is cloned and stored.
        constructor(mode, numChars, bitData){
            this.mode = mode;
            this.numChars = numChars;
            this.bitData = bitData;
            if (numChars < 0) throw new RangeError("Invalid argument");
            this.bitData = bitData.slice();
        }
        /*-- Static factory functions (mid level) --*/ // Returns a segment representing the given binary data encoded in
        // byte mode. All input byte arrays are acceptable. Any text string
        // can be converted to UTF-8 bytes and encoded as a byte mode segment.
        static makeBytes(data) {
            let bb = [];
            for (const b of data)appendBits(b, 8, bb);
            return new _QrSegment(_QrSegment.Mode.BYTE, data.length, bb);
        }
        // Returns a segment representing the given string of decimal digits encoded in numeric mode.
        static makeNumeric(digits) {
            if (!_QrSegment.isNumeric(digits)) throw new RangeError("String contains non-numeric characters");
            let bb = [];
            for(let i = 0; i < digits.length;){
                const n = Math.min(digits.length - i, 3);
                appendBits(parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
                i += n;
            }
            return new _QrSegment(_QrSegment.Mode.NUMERIC, digits.length, bb);
        }
        // Returns a segment representing the given text string encoded in alphanumeric mode.
        // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
        // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
        static makeAlphanumeric(text) {
            if (!_QrSegment.isAlphanumeric(text)) throw new RangeError("String contains unencodable characters in alphanumeric mode");
            let bb = [];
            let i;
            for(i = 0; i + 2 <= text.length; i += 2){
                let temp = _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
                temp += _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
                appendBits(temp, 11, bb);
            }
            if (i < text.length) appendBits(_QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
            return new _QrSegment(_QrSegment.Mode.ALPHANUMERIC, text.length, bb);
        }
        // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
        // The result may use various segment modes and switch modes to optimize the length of the bit stream.
        static makeSegments(text) {
            if (text == "") return [];
            else if (_QrSegment.isNumeric(text)) return [
                _QrSegment.makeNumeric(text)
            ];
            else if (_QrSegment.isAlphanumeric(text)) return [
                _QrSegment.makeAlphanumeric(text)
            ];
            else return [
                _QrSegment.makeBytes(_QrSegment.toUtf8ByteArray(text))
            ];
        }
        // Returns a segment representing an Extended Channel Interpretation
        // (ECI) designator with the given assignment value.
        static makeEci(assignVal) {
            let bb = [];
            if (assignVal < 0) throw new RangeError("ECI assignment value out of range");
            else if (assignVal < 1 << 7) appendBits(assignVal, 8, bb);
            else if (assignVal < 1 << 14) {
                appendBits(2, 2, bb);
                appendBits(assignVal, 14, bb);
            } else if (assignVal < 1e6) {
                appendBits(6, 3, bb);
                appendBits(assignVal, 21, bb);
            } else throw new RangeError("ECI assignment value out of range");
            return new _QrSegment(_QrSegment.Mode.ECI, 0, bb);
        }
        // Tests whether the given string can be encoded as a segment in numeric mode.
        // A string is encodable iff each character is in the range 0 to 9.
        static isNumeric(text) {
            return _QrSegment.NUMERIC_REGEX.test(text);
        }
        // Tests whether the given string can be encoded as a segment in alphanumeric mode.
        // A string is encodable iff each character is in the following set: 0 to 9, A to Z
        // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
        static isAlphanumeric(text) {
            return _QrSegment.ALPHANUMERIC_REGEX.test(text);
        }
        /*-- Methods --*/ // Returns a new copy of the data bits of this segment.
        getData() {
            return this.bitData.slice();
        }
        // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
        // the given version. The result is infinity if a segment has too many characters to fit its length field.
        static getTotalBits(segs, version) {
            let result = 0;
            for (const seg of segs){
                const ccbits = seg.mode.numCharCountBits(version);
                if (seg.numChars >= 1 << ccbits) return Infinity;
                result += 4 + ccbits + seg.bitData.length;
            }
            return result;
        }
        // Returns a new array of bytes representing the given string encoded in UTF-8.
        static toUtf8ByteArray(str) {
            str = encodeURI(str);
            let result = [];
            for(let i = 0; i < str.length; i++){
                if (str.charAt(i) != "%") result.push(str.charCodeAt(i));
                else {
                    result.push(parseInt(str.substring(i + 1, i + 3), 16));
                    i += 2;
                }
            }
            return result;
        }
    };
    /*-- Constants --*/ // Describes precisely all strings that are encodable in numeric mode.
    _QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
    // Describes precisely all strings that are encodable in alphanumeric mode.
    _QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
    // The set of all legal characters in alphanumeric mode,
    // where each character value maps to the index in the string.
    _QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
    let QrSegment = _QrSegment;
    qrcodegen2.QrSegment = _QrSegment;
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2)=>{
    let QrCode;
    ((QrCode2)=>{
        const _Ecc = class _Ecc {
            // The QR Code can tolerate about 30% erroneous codewords
            /*-- Constructor and fields --*/ constructor(ordinal, formatBits){
                this.ordinal = ordinal;
                this.formatBits = formatBits;
            }
        };
        /*-- Constants --*/ _Ecc.LOW = new _Ecc(0, 1);
        // The QR Code can tolerate about  7% erroneous codewords
        _Ecc.MEDIUM = new _Ecc(1, 0);
        // The QR Code can tolerate about 15% erroneous codewords
        _Ecc.QUARTILE = new _Ecc(2, 3);
        // The QR Code can tolerate about 25% erroneous codewords
        _Ecc.HIGH = new _Ecc(3, 2);
        let Ecc = _Ecc;
        QrCode2.Ecc = _Ecc;
    })(QrCode = qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2)=>{
    let QrSegment;
    ((QrSegment2)=>{
        const _Mode = class _Mode {
            /*-- Constructor and fields --*/ constructor(modeBits, numBitsCharCount){
                this.modeBits = modeBits;
                this.numBitsCharCount = numBitsCharCount;
            }
            /*-- Method --*/ // (Package-private) Returns the bit width of the character count field for a segment in
            // this mode in a QR Code at the given version number. The result is in the range [0, 16].
            numCharCountBits(ver) {
                return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
            }
        };
        /*-- Constants --*/ _Mode.NUMERIC = new _Mode(1, [
            10,
            12,
            14
        ]);
        _Mode.ALPHANUMERIC = new _Mode(2, [
            9,
            11,
            13
        ]);
        _Mode.BYTE = new _Mode(4, [
            8,
            16,
            16
        ]);
        _Mode.KANJI = new _Mode(8, [
            8,
            10,
            12
        ]);
        _Mode.ECI = new _Mode(7, [
            0,
            0,
            0
        ]);
        let Mode = _Mode;
        QrSegment2.Mode = _Mode;
    })(QrSegment = qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
})(qrcodegen || (qrcodegen = {}));
var qrcodegen_default = qrcodegen;
// src/index.tsx
/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */ var ERROR_LEVEL_MAP = {
    L: qrcodegen_default.QrCode.Ecc.LOW,
    M: qrcodegen_default.QrCode.Ecc.MEDIUM,
    Q: qrcodegen_default.QrCode.Ecc.QUARTILE,
    H: qrcodegen_default.QrCode.Ecc.HIGH
};
var DEFAULT_SIZE = 128;
var DEFAULT_LEVEL = "L";
var DEFAULT_BGCOLOR = "#FFFFFF";
var DEFAULT_FGCOLOR = "#000000";
var DEFAULT_INCLUDEMARGIN = false;
var DEFAULT_MINVERSION = 1;
var SPEC_MARGIN_SIZE = 4;
var DEFAULT_MARGIN_SIZE = 0;
var DEFAULT_IMG_SCALE = 0.1;
function generatePath(modules, margin = 0) {
    const ops = [];
    modules.forEach(function(row, y) {
        let start = null;
        row.forEach(function(cell, x) {
            if (!cell && start !== null) {
                ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
                start = null;
                return;
            }
            if (x === row.length - 1) {
                if (!cell) {
                    return;
                }
                if (start === null) {
                    ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
                } else {
                    ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
                }
                return;
            }
            if (cell && start === null) {
                start = x;
            }
        });
    });
    return ops.join("");
}
function excavateModules(modules, excavation) {
    return modules.slice().map((row, y)=>{
        if (y < excavation.y || y >= excavation.y + excavation.h) {
            return row;
        }
        return row.map((cell, x)=>{
            if (x < excavation.x || x >= excavation.x + excavation.w) {
                return cell;
            }
            return false;
        });
    });
}
function getImageSettings(cells, size, margin, imageSettings) {
    if (imageSettings == null) {
        return null;
    }
    const numCells = cells.length + margin * 2;
    const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
    const scale = numCells / size;
    const w = (imageSettings.width || defaultSize) * scale;
    const h = (imageSettings.height || defaultSize) * scale;
    const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
    const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
    const opacity = imageSettings.opacity == null ? 1 : imageSettings.opacity;
    let excavation = null;
    if (imageSettings.excavate) {
        let floorX = Math.floor(x);
        let floorY = Math.floor(y);
        let ceilW = Math.ceil(w + x - floorX);
        let ceilH = Math.ceil(h + y - floorY);
        excavation = {
            x: floorX,
            y: floorY,
            w: ceilW,
            h: ceilH
        };
    }
    const crossOrigin = imageSettings.crossOrigin;
    return {
        x,
        y,
        h,
        w,
        excavation,
        opacity,
        crossOrigin
    };
}
function getMarginSize(includeMargin, marginSize) {
    if (marginSize != null) {
        return Math.max(Math.floor(marginSize), 0);
    }
    return includeMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
}
function useQRCode({ value, level, minVersion, includeMargin, marginSize, imageSettings, size, boostLevel }) {
    let qrcode = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        const values = Array.isArray(value) ? value : [
            value
        ];
        const segments = values.reduce((accum, v)=>{
            accum.push(...qrcodegen_default.QrSegment.makeSegments(v));
            return accum;
        }, []);
        return qrcodegen_default.QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion, void 0, void 0, boostLevel);
    }, [
        value,
        level,
        minVersion,
        boostLevel
    ]);
    const { cells, margin, numCells, calculatedImageSettings } = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        let cells2 = qrcode.getModules();
        const margin2 = getMarginSize(includeMargin, marginSize);
        const numCells2 = cells2.length + margin2 * 2;
        const calculatedImageSettings2 = getImageSettings(cells2, size, margin2, imageSettings);
        return {
            cells: cells2,
            margin: margin2,
            numCells: numCells2,
            calculatedImageSettings: calculatedImageSettings2
        };
    }, [
        qrcode,
        size,
        imageSettings,
        includeMargin,
        marginSize
    ]);
    return {
        qrcode,
        margin,
        cells,
        numCells,
        calculatedImageSettings
    };
}
var SUPPORTS_PATH2D = function() {
    try {
        new Path2D().addPath(new Path2D());
    } catch (e) {
        return false;
    }
    return true;
}();
var QRCodeCanvas = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(function QRCodeCanvas2(props, forwardedRef) {
    const _a = props, { value, size = DEFAULT_SIZE, level = DEFAULT_LEVEL, bgColor = DEFAULT_BGCOLOR, fgColor = DEFAULT_FGCOLOR, includeMargin = DEFAULT_INCLUDEMARGIN, minVersion = DEFAULT_MINVERSION, boostLevel, marginSize, imageSettings } = _a, extraProps = __objRest(_a, [
        "value",
        "size",
        "level",
        "bgColor",
        "fgColor",
        "includeMargin",
        "minVersion",
        "boostLevel",
        "marginSize",
        "imageSettings"
    ]);
    const _b = extraProps, { style } = _b, otherProps = __objRest(_b, [
        "style"
    ]);
    const imgSrc = imageSettings == null ? void 0 : imageSettings.src;
    const _canvas = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const _image = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const setCanvasRef = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((node)=>{
        _canvas.current = node;
        if (typeof forwardedRef === "function") {
            forwardedRef(node);
        } else if (forwardedRef) {
            forwardedRef.current = node;
        }
    }, [
        forwardedRef
    ]);
    const [isImgLoaded, setIsImageLoaded] = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
        value,
        level,
        minVersion,
        boostLevel,
        includeMargin,
        marginSize,
        imageSettings,
        size
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (_canvas.current != null) {
            const canvas = _canvas.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                return;
            }
            let cellsToDraw = cells;
            const image = _image.current;
            const haveImageToRender = calculatedImageSettings != null && image !== null && image.complete && image.naturalHeight !== 0 && image.naturalWidth !== 0;
            if (haveImageToRender) {
                if (calculatedImageSettings.excavation != null) {
                    cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
                }
            }
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.height = canvas.width = size * pixelRatio;
            const scale = size / numCells * pixelRatio;
            ctx.scale(scale, scale);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, numCells, numCells);
            ctx.fillStyle = fgColor;
            if (SUPPORTS_PATH2D) {
                ctx.fill(new Path2D(generatePath(cellsToDraw, margin)));
            } else {
                cells.forEach(function(row, rdx) {
                    row.forEach(function(cell, cdx) {
                        if (cell) {
                            ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
                        }
                    });
                });
            }
            if (calculatedImageSettings) {
                ctx.globalAlpha = calculatedImageSettings.opacity;
            }
            if (haveImageToRender) {
                ctx.drawImage(image, calculatedImageSettings.x + margin, calculatedImageSettings.y + margin, calculatedImageSettings.w, calculatedImageSettings.h);
            }
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        setIsImageLoaded(false);
    }, [
        imgSrc
    ]);
    const canvasStyle = __spreadValues({
        height: size,
        width: size
    }, style);
    let img = null;
    if (imgSrc != null) {
        img = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("img", {
            src: imgSrc,
            key: imgSrc,
            style: {
                display: "none"
            },
            onLoad: ()=>{
                setIsImageLoaded(true);
            },
            ref: _image,
            crossOrigin: calculatedImageSettings == null ? void 0 : calculatedImageSettings.crossOrigin
        });
    }
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, null, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("canvas", __spreadValues({
        style: canvasStyle,
        height: size,
        width: size,
        ref: setCanvasRef,
        role: "img"
    }, otherProps)), img);
});
QRCodeCanvas.displayName = "QRCodeCanvas";
var QRCodeSVG = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(function QRCodeSVG2(props, forwardedRef) {
    const _a = props, { value, size = DEFAULT_SIZE, level = DEFAULT_LEVEL, bgColor = DEFAULT_BGCOLOR, fgColor = DEFAULT_FGCOLOR, includeMargin = DEFAULT_INCLUDEMARGIN, minVersion = DEFAULT_MINVERSION, boostLevel, title, marginSize, imageSettings } = _a, otherProps = __objRest(_a, [
        "value",
        "size",
        "level",
        "bgColor",
        "fgColor",
        "includeMargin",
        "minVersion",
        "boostLevel",
        "title",
        "marginSize",
        "imageSettings"
    ]);
    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
        value,
        level,
        minVersion,
        boostLevel,
        includeMargin,
        marginSize,
        imageSettings,
        size
    });
    let cellsToDraw = cells;
    let image = null;
    if (imageSettings != null && calculatedImageSettings != null) {
        if (calculatedImageSettings.excavation != null) {
            cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
        }
        image = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("image", {
            href: imageSettings.src,
            height: calculatedImageSettings.h,
            width: calculatedImageSettings.w,
            x: calculatedImageSettings.x + margin,
            y: calculatedImageSettings.y + margin,
            preserveAspectRatio: "none",
            opacity: calculatedImageSettings.opacity,
            crossOrigin: calculatedImageSettings.crossOrigin
        });
    }
    const fgPath = generatePath(cellsToDraw, margin);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("svg", __spreadValues({
        height: size,
        width: size,
        viewBox: `0 0 ${numCells} ${numCells}`,
        ref: forwardedRef,
        role: "img"
    }, otherProps), !!title && /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("title", null, title), /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("path", {
        fill: bgColor,
        d: `M0,0 h${numCells}v${numCells}H0z`,
        shapeRendering: "crispEdges"
    }), /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("path", {
        fill: fgColor,
        d: fgPath,
        shapeRendering: "crispEdges"
    }), image);
});
QRCodeSVG.displayName = "QRCodeSVG";
;
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Camera
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
            key: "18u6gg"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "13",
            r: "3",
            key: "1vg3eu"
        }
    ]
];
const Camera = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("camera", __iconNode);
;
 //# sourceMappingURL=camera.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript) <export default as Camera>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Camera",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript)");
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Globe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
            key: "13o1zl"
        }
    ],
    [
        "path",
        {
            d: "M2 12h20",
            key: "9i4pu4"
        }
    ]
];
const Globe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("globe", __iconNode);
;
 //# sourceMappingURL=globe.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Globe",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript)");
}),
"[project]/frontend/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Concatenates two arrays faster than the array spread operator.
 */ __turbopack_context__.s([
    "createTailwindMerge",
    ()=>createTailwindMerge,
    "extendTailwindMerge",
    ()=>extendTailwindMerge,
    "fromTheme",
    ()=>fromTheme,
    "getDefaultConfig",
    ()=>getDefaultConfig,
    "mergeConfigs",
    ()=>mergeConfigs,
    "twJoin",
    ()=>twJoin,
    "twMerge",
    ()=>twMerge,
    "validators",
    ()=>validators
]);
const concatArrays = (array1, array2)=>{
    // Pre-allocate for better V8 optimization
    const combinedArray = new Array(array1.length + array2.length);
    for(let i = 0; i < array1.length; i++){
        combinedArray[i] = array1[i];
    }
    for(let i = 0; i < array2.length; i++){
        combinedArray[array1.length + i] = array2[i];
    }
    return combinedArray;
};
// Factory function ensures consistent object shapes
const createClassValidatorObject = (classGroupId, validator)=>({
        classGroupId,
        validator
    });
// Factory ensures consistent ClassPartObject shape
const createClassPartObject = (nextPart = new Map(), validators = null, classGroupId)=>({
        nextPart,
        validators,
        classGroupId
    });
const CLASS_PART_SEPARATOR = '-';
const EMPTY_CONFLICTS = [];
// I use two dots here because one dot is used as prefix for class groups in plugins
const ARBITRARY_PROPERTY_PREFIX = 'arbitrary..';
const createClassGroupUtils = (config)=>{
    const classMap = createClassMap(config);
    const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
    const getClassGroupId = (className)=>{
        if (className.startsWith('[') && className.endsWith(']')) {
            return getGroupIdForArbitraryProperty(className);
        }
        const classParts = className.split(CLASS_PART_SEPARATOR);
        // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and skip it.
        const startIndex = classParts[0] === '' && classParts.length > 1 ? 1 : 0;
        return getGroupRecursive(classParts, startIndex, classMap);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier)=>{
        if (hasPostfixModifier) {
            const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
            const baseConflicts = conflictingClassGroups[classGroupId];
            if (modifierConflicts) {
                if (baseConflicts) {
                    // Merge base conflicts with modifier conflicts
                    return concatArrays(baseConflicts, modifierConflicts);
                }
                // Only modifier conflicts
                return modifierConflicts;
            }
            // Fall back to without postfix if no modifier conflicts
            return baseConflicts || EMPTY_CONFLICTS;
        }
        return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
    };
    return {
        getClassGroupId,
        getConflictingClassGroupIds
    };
};
const getGroupRecursive = (classParts, startIndex, classPartObject)=>{
    const classPathsLength = classParts.length - startIndex;
    if (classPathsLength === 0) {
        return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[startIndex];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    if (nextClassPartObject) {
        const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
        if (result) return result;
    }
    const validators = classPartObject.validators;
    if (validators === null) {
        return undefined;
    }
    // Build classRest string efficiently by joining from startIndex onwards
    const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
    const validatorsLength = validators.length;
    for(let i = 0; i < validatorsLength; i++){
        const validatorObj = validators[i];
        if (validatorObj.validator(classRest)) {
            return validatorObj.classGroupId;
        }
    }
    return undefined;
};
/**
 * Get the class group ID for an arbitrary property.
 *
 * @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
 */ const getGroupIdForArbitraryProperty = (className)=>className.slice(1, -1).indexOf(':') === -1 ? undefined : (()=>{
        const content = className.slice(1, -1);
        const colonIndex = content.indexOf(':');
        const property = content.slice(0, colonIndex);
        return property ? ARBITRARY_PROPERTY_PREFIX + property : undefined;
    })();
/**
 * Exported for testing only
 */ const createClassMap = (config)=>{
    const { theme, classGroups } = config;
    return processClassGroups(classGroups, theme);
};
// Split into separate functions to maintain monomorphic call sites
const processClassGroups = (classGroups, theme)=>{
    const classMap = createClassPartObject();
    for(const classGroupId in classGroups){
        const group = classGroups[classGroupId];
        processClassesRecursively(group, classMap, classGroupId, theme);
    }
    return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme)=>{
    const len = classGroup.length;
    for(let i = 0; i < len; i++){
        const classDefinition = classGroup[i];
        processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
    }
};
// Split into separate functions for each type to maintain monomorphic call sites
const processClassDefinition = (classDefinition, classPartObject, classGroupId, theme)=>{
    if (typeof classDefinition === 'string') {
        processStringDefinition(classDefinition, classPartObject, classGroupId);
        return;
    }
    if (typeof classDefinition === 'function') {
        processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
        return;
    }
    processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
const processStringDefinition = (classDefinition, classPartObject, classGroupId)=>{
    const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
    classPartObjectToEdit.classGroupId = classGroupId;
};
const processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme)=>{
    if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
    }
    if (classPartObject.validators === null) {
        classPartObject.validators = [];
    }
    classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
const processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme)=>{
    const entries = Object.entries(classDefinition);
    const len = entries.length;
    for(let i = 0; i < len; i++){
        const [key, value] = entries[i];
        processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
    }
};
const getPart = (classPartObject, path)=>{
    let current = classPartObject;
    const parts = path.split(CLASS_PART_SEPARATOR);
    const len = parts.length;
    for(let i = 0; i < len; i++){
        const part = parts[i];
        let next = current.nextPart.get(part);
        if (!next) {
            next = createClassPartObject();
            current.nextPart.set(part, next);
        }
        current = next;
    }
    return current;
};
// Type guard maintains monomorphic check
const isThemeGetter = (func)=>'isThemeGetter' in func && func.isThemeGetter === true;
// LRU cache implementation using plain objects for simplicity
const createLruCache = (maxCacheSize)=>{
    if (maxCacheSize < 1) {
        return {
            get: ()=>undefined,
            set: ()=>{}
        };
    }
    let cacheSize = 0;
    let cache = Object.create(null);
    let previousCache = Object.create(null);
    const update = (key, value)=>{
        cache[key] = value;
        cacheSize++;
        if (cacheSize > maxCacheSize) {
            cacheSize = 0;
            previousCache = cache;
            cache = Object.create(null);
        }
    };
    return {
        get (key) {
            let value = cache[key];
            if (value !== undefined) {
                return value;
            }
            if ((value = previousCache[key]) !== undefined) {
                update(key, value);
                return value;
            }
        },
        set (key, value) {
            if (key in cache) {
                cache[key] = value;
            } else {
                update(key, value);
            }
        }
    };
};
const IMPORTANT_MODIFIER = '!';
const MODIFIER_SEPARATOR = ':';
const EMPTY_MODIFIERS = [];
// Pre-allocated result object shape for consistency
const createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal)=>({
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition,
        isExternal
    });
const createParseClassName = (config)=>{
    const { prefix, experimentalParseClassName } = config;
    /**
   * Parse class name into parts.
   *
   * Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
   * @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
   */ let parseClassName = (className)=>{
        // Use simple array with push for better performance
        const modifiers = [];
        let bracketDepth = 0;
        let parenDepth = 0;
        let modifierStart = 0;
        let postfixModifierPosition;
        const len = className.length;
        for(let index = 0; index < len; index++){
            const currentCharacter = className[index];
            if (bracketDepth === 0 && parenDepth === 0) {
                if (currentCharacter === MODIFIER_SEPARATOR) {
                    modifiers.push(className.slice(modifierStart, index));
                    modifierStart = index + 1;
                    continue;
                }
                if (currentCharacter === '/') {
                    postfixModifierPosition = index;
                    continue;
                }
            }
            if (currentCharacter === '[') bracketDepth++;
            else if (currentCharacter === ']') bracketDepth--;
            else if (currentCharacter === '(') parenDepth++;
            else if (currentCharacter === ')') parenDepth--;
        }
        const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
        // Inline important modifier check
        let baseClassName = baseClassNameWithImportantModifier;
        let hasImportantModifier = false;
        if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
            baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
            hasImportantModifier = true;
        } else if (/**
     * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
     * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
     */ baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)) {
            baseClassName = baseClassNameWithImportantModifier.slice(1);
            hasImportantModifier = true;
        }
        const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
        return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
    };
    if (prefix) {
        const fullPrefix = prefix + MODIFIER_SEPARATOR;
        const parseClassNameOriginal = parseClassName;
        parseClassName = (className)=>className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, undefined, true);
    }
    if (experimentalParseClassName) {
        const parseClassNameOriginal = parseClassName;
        parseClassName = (className)=>experimentalParseClassName({
                className,
                parseClassName: parseClassNameOriginal
            });
    }
    return parseClassName;
};
/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */ const createSortModifiers = (config)=>{
    // Pre-compute weights for all known modifiers for O(1) comparison
    const modifierWeights = new Map();
    // Assign weights to sensitive modifiers (highest priority, but preserve order)
    config.orderSensitiveModifiers.forEach((mod, index)=>{
        modifierWeights.set(mod, 1000000 + index); // High weights for sensitive mods
    });
    return (modifiers)=>{
        const result = [];
        let currentSegment = [];
        // Process modifiers in one pass
        for(let i = 0; i < modifiers.length; i++){
            const modifier = modifiers[i];
            // Check if modifier is sensitive (starts with '[' or in orderSensitiveModifiers)
            const isArbitrary = modifier[0] === '[';
            const isOrderSensitive = modifierWeights.has(modifier);
            if (isArbitrary || isOrderSensitive) {
                // Sort and flush current segment alphabetically
                if (currentSegment.length > 0) {
                    currentSegment.sort();
                    result.push(...currentSegment);
                    currentSegment = [];
                }
                result.push(modifier);
            } else {
                // Regular modifier - add to current segment for batch sorting
                currentSegment.push(modifier);
            }
        }
        // Sort and add any remaining segment items
        if (currentSegment.length > 0) {
            currentSegment.sort();
            result.push(...currentSegment);
        }
        return result;
    };
};
const createConfigUtils = (config)=>({
        cache: createLruCache(config.cacheSize),
        parseClassName: createParseClassName(config),
        sortModifiers: createSortModifiers(config),
        ...createClassGroupUtils(config)
    });
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils)=>{
    const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers } = configUtils;
    /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */ const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = '';
    for(let index = classNames.length - 1; index >= 0; index -= 1){
        const originalClassName = classNames[index];
        const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
        if (isExternal) {
            result = originalClassName + (result.length > 0 ? ' ' + result : result);
            continue;
        }
        let hasPostfixModifier = !!maybePostfixModifierPosition;
        let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
        if (!classGroupId) {
            if (!hasPostfixModifier) {
                // Not a Tailwind class
                result = originalClassName + (result.length > 0 ? ' ' + result : result);
                continue;
            }
            classGroupId = getClassGroupId(baseClassName);
            if (!classGroupId) {
                // Not a Tailwind class
                result = originalClassName + (result.length > 0 ? ' ' + result : result);
                continue;
            }
            hasPostfixModifier = false;
        }
        // Fast path: skip sorting for empty or single modifier
        const variantModifier = modifiers.length === 0 ? '' : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(':');
        const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
        const classId = modifierId + classGroupId;
        if (classGroupsInConflict.indexOf(classId) > -1) {
            continue;
        }
        classGroupsInConflict.push(classId);
        const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
        for(let i = 0; i < conflictGroups.length; ++i){
            const group = conflictGroups[i];
            classGroupsInConflict.push(modifierId + group);
        }
        // Tailwind class not in conflict
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
    }
    return result;
};
/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */ const twJoin = (...classLists)=>{
    let index = 0;
    let argument;
    let resolvedValue;
    let string = '';
    while(index < classLists.length){
        if (argument = classLists[index++]) {
            if (resolvedValue = toValue(argument)) {
                string && (string += ' ');
                string += resolvedValue;
            }
        }
    }
    return string;
};
const toValue = (mix)=>{
    // Fast path for strings
    if (typeof mix === 'string') {
        return mix;
    }
    let resolvedValue;
    let string = '';
    for(let k = 0; k < mix.length; k++){
        if (mix[k]) {
            if (resolvedValue = toValue(mix[k])) {
                string && (string += ' ');
                string += resolvedValue;
            }
        }
    }
    return string;
};
const createTailwindMerge = (createConfigFirst, ...createConfigRest)=>{
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall;
    const initTailwindMerge = (classList)=>{
        const config = createConfigRest.reduce((previousConfig, createConfigCurrent)=>createConfigCurrent(previousConfig), createConfigFirst());
        configUtils = createConfigUtils(config);
        cacheGet = configUtils.cache.get;
        cacheSet = configUtils.cache.set;
        functionToCall = tailwindMerge;
        return tailwindMerge(classList);
    };
    const tailwindMerge = (classList)=>{
        const cachedResult = cacheGet(classList);
        if (cachedResult) {
            return cachedResult;
        }
        const result = mergeClassList(classList, configUtils);
        cacheSet(classList, result);
        return result;
    };
    functionToCall = initTailwindMerge;
    return (...args)=>functionToCall(twJoin(...args));
};
const fallbackThemeArr = [];
const fromTheme = (key)=>{
    const themeGetter = (theme)=>theme[key] || fallbackThemeArr;
    themeGetter.isThemeGetter = true;
    return themeGetter;
};
const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
const fractionRegex = /^\d+\/\d+$/;
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isFraction = (value)=>fractionRegex.test(value);
const isNumber = (value)=>!!value && !Number.isNaN(Number(value));
const isInteger = (value)=>!!value && Number.isInteger(Number(value));
const isPercent = (value)=>value.endsWith('%') && isNumber(value.slice(0, -1));
const isTshirtSize = (value)=>tshirtUnitRegex.test(value);
const isAny = ()=>true;
const isLengthOnly = (value)=>// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = ()=>false;
const isShadow = (value)=>shadowRegex.test(value);
const isImage = (value)=>imageRegex.test(value);
const isAnyNonArbitrary = (value)=>!isArbitraryValue(value) && !isArbitraryVariable(value);
const isArbitrarySize = (value)=>getIsArbitraryValue(value, isLabelSize, isNever);
const isArbitraryValue = (value)=>arbitraryValueRegex.test(value);
const isArbitraryLength = (value)=>getIsArbitraryValue(value, isLabelLength, isLengthOnly);
const isArbitraryNumber = (value)=>getIsArbitraryValue(value, isLabelNumber, isNumber);
const isArbitraryPosition = (value)=>getIsArbitraryValue(value, isLabelPosition, isNever);
const isArbitraryImage = (value)=>getIsArbitraryValue(value, isLabelImage, isImage);
const isArbitraryShadow = (value)=>getIsArbitraryValue(value, isLabelShadow, isShadow);
const isArbitraryVariable = (value)=>arbitraryVariableRegex.test(value);
const isArbitraryVariableLength = (value)=>getIsArbitraryVariable(value, isLabelLength);
const isArbitraryVariableFamilyName = (value)=>getIsArbitraryVariable(value, isLabelFamilyName);
const isArbitraryVariablePosition = (value)=>getIsArbitraryVariable(value, isLabelPosition);
const isArbitraryVariableSize = (value)=>getIsArbitraryVariable(value, isLabelSize);
const isArbitraryVariableImage = (value)=>getIsArbitraryVariable(value, isLabelImage);
const isArbitraryVariableShadow = (value)=>getIsArbitraryVariable(value, isLabelShadow, true);
// Helpers
const getIsArbitraryValue = (value, testLabel, testValue)=>{
    const result = arbitraryValueRegex.exec(value);
    if (result) {
        if (result[1]) {
            return testLabel(result[1]);
        }
        return testValue(result[2]);
    }
    return false;
};
const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false)=>{
    const result = arbitraryVariableRegex.exec(value);
    if (result) {
        if (result[1]) {
            return testLabel(result[1]);
        }
        return shouldMatchNoLabel;
    }
    return false;
};
// Labels
const isLabelPosition = (label)=>label === 'position' || label === 'percentage';
const isLabelImage = (label)=>label === 'image' || label === 'url';
const isLabelSize = (label)=>label === 'length' || label === 'size' || label === 'bg-size';
const isLabelLength = (label)=>label === 'length';
const isLabelNumber = (label)=>label === 'number';
const isLabelFamilyName = (label)=>label === 'family-name';
const isLabelShadow = (label)=>label === 'shadow';
const validators = /*#__PURE__*/ Object.defineProperty({
    __proto__: null,
    isAny,
    isAnyNonArbitrary,
    isArbitraryImage,
    isArbitraryLength,
    isArbitraryNumber,
    isArbitraryPosition,
    isArbitraryShadow,
    isArbitrarySize,
    isArbitraryValue,
    isArbitraryVariable,
    isArbitraryVariableFamilyName,
    isArbitraryVariableImage,
    isArbitraryVariableLength,
    isArbitraryVariablePosition,
    isArbitraryVariableShadow,
    isArbitraryVariableSize,
    isFraction,
    isInteger,
    isNumber,
    isPercent,
    isTshirtSize
}, Symbol.toStringTag, {
    value: 'Module'
});
const getDefaultConfig = ()=>{
    /**
   * Theme getters for theme variable namespaces
   * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
   */ /***/ const themeColor = fromTheme('color');
    const themeFont = fromTheme('font');
    const themeText = fromTheme('text');
    const themeFontWeight = fromTheme('font-weight');
    const themeTracking = fromTheme('tracking');
    const themeLeading = fromTheme('leading');
    const themeBreakpoint = fromTheme('breakpoint');
    const themeContainer = fromTheme('container');
    const themeSpacing = fromTheme('spacing');
    const themeRadius = fromTheme('radius');
    const themeShadow = fromTheme('shadow');
    const themeInsetShadow = fromTheme('inset-shadow');
    const themeTextShadow = fromTheme('text-shadow');
    const themeDropShadow = fromTheme('drop-shadow');
    const themeBlur = fromTheme('blur');
    const themePerspective = fromTheme('perspective');
    const themeAspect = fromTheme('aspect');
    const themeEase = fromTheme('ease');
    const themeAnimate = fromTheme('animate');
    /**
   * Helpers to avoid repeating the same scales
   *
   * We use functions that create a new array every time they're called instead of static arrays.
   * This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
   */ /***/ const scaleBreak = ()=>[
            'auto',
            'avoid',
            'all',
            'avoid-page',
            'page',
            'left',
            'right',
            'column'
        ];
    const scalePosition = ()=>[
            'center',
            'top',
            'bottom',
            'left',
            'right',
            'top-left',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'left-top',
            'top-right',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'right-top',
            'bottom-right',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'right-bottom',
            'bottom-left',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'left-bottom'
        ];
    const scalePositionWithArbitrary = ()=>[
            ...scalePosition(),
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleOverflow = ()=>[
            'auto',
            'hidden',
            'clip',
            'visible',
            'scroll'
        ];
    const scaleOverscroll = ()=>[
            'auto',
            'contain',
            'none'
        ];
    const scaleUnambiguousSpacing = ()=>[
            isArbitraryVariable,
            isArbitraryValue,
            themeSpacing
        ];
    const scaleInset = ()=>[
            isFraction,
            'full',
            'auto',
            ...scaleUnambiguousSpacing()
        ];
    const scaleGridTemplateColsRows = ()=>[
            isInteger,
            'none',
            'subgrid',
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleGridColRowStartAndEnd = ()=>[
            'auto',
            {
                span: [
                    'full',
                    isInteger,
                    isArbitraryVariable,
                    isArbitraryValue
                ]
            },
            isInteger,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleGridColRowStartOrEnd = ()=>[
            isInteger,
            'auto',
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleGridAutoColsRows = ()=>[
            'auto',
            'min',
            'max',
            'fr',
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleAlignPrimaryAxis = ()=>[
            'start',
            'end',
            'center',
            'between',
            'around',
            'evenly',
            'stretch',
            'baseline',
            'center-safe',
            'end-safe'
        ];
    const scaleAlignSecondaryAxis = ()=>[
            'start',
            'end',
            'center',
            'stretch',
            'center-safe',
            'end-safe'
        ];
    const scaleMargin = ()=>[
            'auto',
            ...scaleUnambiguousSpacing()
        ];
    const scaleSizing = ()=>[
            isFraction,
            'auto',
            'full',
            'dvw',
            'dvh',
            'lvw',
            'lvh',
            'svw',
            'svh',
            'min',
            'max',
            'fit',
            ...scaleUnambiguousSpacing()
        ];
    const scaleColor = ()=>[
            themeColor,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleBgPosition = ()=>[
            ...scalePosition(),
            isArbitraryVariablePosition,
            isArbitraryPosition,
            {
                position: [
                    isArbitraryVariable,
                    isArbitraryValue
                ]
            }
        ];
    const scaleBgRepeat = ()=>[
            'no-repeat',
            {
                repeat: [
                    '',
                    'x',
                    'y',
                    'space',
                    'round'
                ]
            }
        ];
    const scaleBgSize = ()=>[
            'auto',
            'cover',
            'contain',
            isArbitraryVariableSize,
            isArbitrarySize,
            {
                size: [
                    isArbitraryVariable,
                    isArbitraryValue
                ]
            }
        ];
    const scaleGradientStopPosition = ()=>[
            isPercent,
            isArbitraryVariableLength,
            isArbitraryLength
        ];
    const scaleRadius = ()=>[
            // Deprecated since Tailwind CSS v4.0.0
            '',
            'none',
            'full',
            themeRadius,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleBorderWidth = ()=>[
            '',
            isNumber,
            isArbitraryVariableLength,
            isArbitraryLength
        ];
    const scaleLineStyle = ()=>[
            'solid',
            'dashed',
            'dotted',
            'double'
        ];
    const scaleBlendMode = ()=>[
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity'
        ];
    const scaleMaskImagePosition = ()=>[
            isNumber,
            isPercent,
            isArbitraryVariablePosition,
            isArbitraryPosition
        ];
    const scaleBlur = ()=>[
            // Deprecated since Tailwind CSS v4.0.0
            '',
            'none',
            themeBlur,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleRotate = ()=>[
            'none',
            isNumber,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleScale = ()=>[
            'none',
            isNumber,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleSkew = ()=>[
            isNumber,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleTranslate = ()=>[
            isFraction,
            'full',
            ...scaleUnambiguousSpacing()
        ];
    return {
        cacheSize: 500,
        theme: {
            animate: [
                'spin',
                'ping',
                'pulse',
                'bounce'
            ],
            aspect: [
                'video'
            ],
            blur: [
                isTshirtSize
            ],
            breakpoint: [
                isTshirtSize
            ],
            color: [
                isAny
            ],
            container: [
                isTshirtSize
            ],
            'drop-shadow': [
                isTshirtSize
            ],
            ease: [
                'in',
                'out',
                'in-out'
            ],
            font: [
                isAnyNonArbitrary
            ],
            'font-weight': [
                'thin',
                'extralight',
                'light',
                'normal',
                'medium',
                'semibold',
                'bold',
                'extrabold',
                'black'
            ],
            'inset-shadow': [
                isTshirtSize
            ],
            leading: [
                'none',
                'tight',
                'snug',
                'normal',
                'relaxed',
                'loose'
            ],
            perspective: [
                'dramatic',
                'near',
                'normal',
                'midrange',
                'distant',
                'none'
            ],
            radius: [
                isTshirtSize
            ],
            shadow: [
                isTshirtSize
            ],
            spacing: [
                'px',
                isNumber
            ],
            text: [
                isTshirtSize
            ],
            'text-shadow': [
                isTshirtSize
            ],
            tracking: [
                'tighter',
                'tight',
                'normal',
                'wide',
                'wider',
                'widest'
            ]
        },
        classGroups: {
            // --------------
            // --- Layout ---
            // --------------
            /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */ aspect: [
                {
                    aspect: [
                        'auto',
                        'square',
                        isFraction,
                        isArbitraryValue,
                        isArbitraryVariable,
                        themeAspect
                    ]
                }
            ],
            /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */ container: [
                'container'
            ],
            /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */ columns: [
                {
                    columns: [
                        isNumber,
                        isArbitraryValue,
                        isArbitraryVariable,
                        themeContainer
                    ]
                }
            ],
            /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */ 'break-after': [
                {
                    'break-after': scaleBreak()
                }
            ],
            /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */ 'break-before': [
                {
                    'break-before': scaleBreak()
                }
            ],
            /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */ 'break-inside': [
                {
                    'break-inside': [
                        'auto',
                        'avoid',
                        'avoid-page',
                        'avoid-column'
                    ]
                }
            ],
            /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */ 'box-decoration': [
                {
                    'box-decoration': [
                        'slice',
                        'clone'
                    ]
                }
            ],
            /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */ box: [
                {
                    box: [
                        'border',
                        'content'
                    ]
                }
            ],
            /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */ display: [
                'block',
                'inline-block',
                'inline',
                'flex',
                'inline-flex',
                'table',
                'inline-table',
                'table-caption',
                'table-cell',
                'table-column',
                'table-column-group',
                'table-footer-group',
                'table-header-group',
                'table-row-group',
                'table-row',
                'flow-root',
                'grid',
                'inline-grid',
                'contents',
                'list-item',
                'hidden'
            ],
            /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */ sr: [
                'sr-only',
                'not-sr-only'
            ],
            /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */ float: [
                {
                    float: [
                        'right',
                        'left',
                        'none',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */ clear: [
                {
                    clear: [
                        'left',
                        'right',
                        'both',
                        'none',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */ isolation: [
                'isolate',
                'isolation-auto'
            ],
            /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */ 'object-fit': [
                {
                    object: [
                        'contain',
                        'cover',
                        'fill',
                        'none',
                        'scale-down'
                    ]
                }
            ],
            /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */ 'object-position': [
                {
                    object: scalePositionWithArbitrary()
                }
            ],
            /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */ overflow: [
                {
                    overflow: scaleOverflow()
                }
            ],
            /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */ 'overflow-x': [
                {
                    'overflow-x': scaleOverflow()
                }
            ],
            /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */ 'overflow-y': [
                {
                    'overflow-y': scaleOverflow()
                }
            ],
            /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ overscroll: [
                {
                    overscroll: scaleOverscroll()
                }
            ],
            /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ 'overscroll-x': [
                {
                    'overscroll-x': scaleOverscroll()
                }
            ],
            /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ 'overscroll-y': [
                {
                    'overscroll-y': scaleOverscroll()
                }
            ],
            /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */ position: [
                'static',
                'fixed',
                'absolute',
                'relative',
                'sticky'
            ],
            /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ inset: [
                {
                    inset: scaleInset()
                }
            ],
            /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ 'inset-x': [
                {
                    'inset-x': scaleInset()
                }
            ],
            /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ 'inset-y': [
                {
                    'inset-y': scaleInset()
                }
            ],
            /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ start: [
                {
                    start: scaleInset()
                }
            ],
            /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ end: [
                {
                    end: scaleInset()
                }
            ],
            /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ top: [
                {
                    top: scaleInset()
                }
            ],
            /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ right: [
                {
                    right: scaleInset()
                }
            ],
            /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ bottom: [
                {
                    bottom: scaleInset()
                }
            ],
            /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ left: [
                {
                    left: scaleInset()
                }
            ],
            /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */ visibility: [
                'visible',
                'invisible',
                'collapse'
            ],
            /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */ z: [
                {
                    z: [
                        isInteger,
                        'auto',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // ------------------------
            // --- Flexbox and Grid ---
            // ------------------------
            /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */ basis: [
                {
                    basis: [
                        isFraction,
                        'full',
                        'auto',
                        themeContainer,
                        ...scaleUnambiguousSpacing()
                    ]
                }
            ],
            /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */ 'flex-direction': [
                {
                    flex: [
                        'row',
                        'row-reverse',
                        'col',
                        'col-reverse'
                    ]
                }
            ],
            /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */ 'flex-wrap': [
                {
                    flex: [
                        'nowrap',
                        'wrap',
                        'wrap-reverse'
                    ]
                }
            ],
            /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */ flex: [
                {
                    flex: [
                        isNumber,
                        isFraction,
                        'auto',
                        'initial',
                        'none',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */ grow: [
                {
                    grow: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */ shrink: [
                {
                    shrink: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */ order: [
                {
                    order: [
                        isInteger,
                        'first',
                        'last',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */ 'grid-cols': [
                {
                    'grid-cols': scaleGridTemplateColsRows()
                }
            ],
            /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-start-end': [
                {
                    col: scaleGridColRowStartAndEnd()
                }
            ],
            /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-start': [
                {
                    'col-start': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-end': [
                {
                    'col-end': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */ 'grid-rows': [
                {
                    'grid-rows': scaleGridTemplateColsRows()
                }
            ],
            /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-start-end': [
                {
                    row: scaleGridColRowStartAndEnd()
                }
            ],
            /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-start': [
                {
                    'row-start': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-end': [
                {
                    'row-end': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */ 'grid-flow': [
                {
                    'grid-flow': [
                        'row',
                        'col',
                        'dense',
                        'row-dense',
                        'col-dense'
                    ]
                }
            ],
            /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */ 'auto-cols': [
                {
                    'auto-cols': scaleGridAutoColsRows()
                }
            ],
            /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */ 'auto-rows': [
                {
                    'auto-rows': scaleGridAutoColsRows()
                }
            ],
            /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */ gap: [
                {
                    gap: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */ 'gap-x': [
                {
                    'gap-x': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */ 'gap-y': [
                {
                    'gap-y': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */ 'justify-content': [
                {
                    justify: [
                        ...scaleAlignPrimaryAxis(),
                        'normal'
                    ]
                }
            ],
            /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */ 'justify-items': [
                {
                    'justify-items': [
                        ...scaleAlignSecondaryAxis(),
                        'normal'
                    ]
                }
            ],
            /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */ 'justify-self': [
                {
                    'justify-self': [
                        'auto',
                        ...scaleAlignSecondaryAxis()
                    ]
                }
            ],
            /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */ 'align-content': [
                {
                    content: [
                        'normal',
                        ...scaleAlignPrimaryAxis()
                    ]
                }
            ],
            /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */ 'align-items': [
                {
                    items: [
                        ...scaleAlignSecondaryAxis(),
                        {
                            baseline: [
                                '',
                                'last'
                            ]
                        }
                    ]
                }
            ],
            /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */ 'align-self': [
                {
                    self: [
                        'auto',
                        ...scaleAlignSecondaryAxis(),
                        {
                            baseline: [
                                '',
                                'last'
                            ]
                        }
                    ]
                }
            ],
            /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */ 'place-content': [
                {
                    'place-content': scaleAlignPrimaryAxis()
                }
            ],
            /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */ 'place-items': [
                {
                    'place-items': [
                        ...scaleAlignSecondaryAxis(),
                        'baseline'
                    ]
                }
            ],
            /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */ 'place-self': [
                {
                    'place-self': [
                        'auto',
                        ...scaleAlignSecondaryAxis()
                    ]
                }
            ],
            // Spacing
            /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */ p: [
                {
                    p: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */ px: [
                {
                    px: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */ py: [
                {
                    py: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */ ps: [
                {
                    ps: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */ pe: [
                {
                    pe: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */ pt: [
                {
                    pt: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */ pr: [
                {
                    pr: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */ pb: [
                {
                    pb: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */ pl: [
                {
                    pl: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */ m: [
                {
                    m: scaleMargin()
                }
            ],
            /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */ mx: [
                {
                    mx: scaleMargin()
                }
            ],
            /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */ my: [
                {
                    my: scaleMargin()
                }
            ],
            /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */ ms: [
                {
                    ms: scaleMargin()
                }
            ],
            /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */ me: [
                {
                    me: scaleMargin()
                }
            ],
            /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */ mt: [
                {
                    mt: scaleMargin()
                }
            ],
            /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */ mr: [
                {
                    mr: scaleMargin()
                }
            ],
            /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */ mb: [
                {
                    mb: scaleMargin()
                }
            ],
            /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */ ml: [
                {
                    ml: scaleMargin()
                }
            ],
            /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-x': [
                {
                    'space-x': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-x-reverse': [
                'space-x-reverse'
            ],
            /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-y': [
                {
                    'space-y': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-y-reverse': [
                'space-y-reverse'
            ],
            // --------------
            // --- Sizing ---
            // --------------
            /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */ size: [
                {
                    size: scaleSizing()
                }
            ],
            /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */ w: [
                {
                    w: [
                        themeContainer,
                        'screen',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */ 'min-w': [
                {
                    'min-w': [
                        themeContainer,
                        'screen',
                        /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ 'none',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */ 'max-w': [
                {
                    'max-w': [
                        themeContainer,
                        'screen',
                        'none',
                        /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ 'prose',
                        /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ {
                            screen: [
                                themeBreakpoint
                            ]
                        },
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */ h: [
                {
                    h: [
                        'screen',
                        'lh',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */ 'min-h': [
                {
                    'min-h': [
                        'screen',
                        'lh',
                        'none',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */ 'max-h': [
                {
                    'max-h': [
                        'screen',
                        'lh',
                        ...scaleSizing()
                    ]
                }
            ],
            // ------------------
            // --- Typography ---
            // ------------------
            /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */ 'font-size': [
                {
                    text: [
                        'base',
                        themeText,
                        isArbitraryVariableLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */ 'font-smoothing': [
                'antialiased',
                'subpixel-antialiased'
            ],
            /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */ 'font-style': [
                'italic',
                'not-italic'
            ],
            /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */ 'font-weight': [
                {
                    font: [
                        themeFontWeight,
                        isArbitraryVariable,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */ 'font-stretch': [
                {
                    'font-stretch': [
                        'ultra-condensed',
                        'extra-condensed',
                        'condensed',
                        'semi-condensed',
                        'normal',
                        'semi-expanded',
                        'expanded',
                        'extra-expanded',
                        'ultra-expanded',
                        isPercent,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */ 'font-family': [
                {
                    font: [
                        isArbitraryVariableFamilyName,
                        isArbitraryValue,
                        themeFont
                    ]
                }
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-normal': [
                'normal-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-ordinal': [
                'ordinal'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-slashed-zero': [
                'slashed-zero'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-figure': [
                'lining-nums',
                'oldstyle-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-spacing': [
                'proportional-nums',
                'tabular-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-fraction': [
                'diagonal-fractions',
                'stacked-fractions'
            ],
            /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */ tracking: [
                {
                    tracking: [
                        themeTracking,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */ 'line-clamp': [
                {
                    'line-clamp': [
                        isNumber,
                        'none',
                        isArbitraryVariable,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */ leading: [
                {
                    leading: [
                        /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ themeLeading,
                        ...scaleUnambiguousSpacing()
                    ]
                }
            ],
            /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */ 'list-image': [
                {
                    'list-image': [
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */ 'list-style-position': [
                {
                    list: [
                        'inside',
                        'outside'
                    ]
                }
            ],
            /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */ 'list-style-type': [
                {
                    list: [
                        'disc',
                        'decimal',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */ 'text-alignment': [
                {
                    text: [
                        'left',
                        'center',
                        'right',
                        'justify',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */ 'placeholder-color': [
                {
                    placeholder: scaleColor()
                }
            ],
            /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */ 'text-color': [
                {
                    text: scaleColor()
                }
            ],
            /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */ 'text-decoration': [
                'underline',
                'overline',
                'line-through',
                'no-underline'
            ],
            /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */ 'text-decoration-style': [
                {
                    decoration: [
                        ...scaleLineStyle(),
                        'wavy'
                    ]
                }
            ],
            /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */ 'text-decoration-thickness': [
                {
                    decoration: [
                        isNumber,
                        'from-font',
                        'auto',
                        isArbitraryVariable,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */ 'text-decoration-color': [
                {
                    decoration: scaleColor()
                }
            ],
            /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */ 'underline-offset': [
                {
                    'underline-offset': [
                        isNumber,
                        'auto',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */ 'text-transform': [
                'uppercase',
                'lowercase',
                'capitalize',
                'normal-case'
            ],
            /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */ 'text-overflow': [
                'truncate',
                'text-ellipsis',
                'text-clip'
            ],
            /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */ 'text-wrap': [
                {
                    text: [
                        'wrap',
                        'nowrap',
                        'balance',
                        'pretty'
                    ]
                }
            ],
            /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */ indent: [
                {
                    indent: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */ 'vertical-align': [
                {
                    align: [
                        'baseline',
                        'top',
                        'middle',
                        'bottom',
                        'text-top',
                        'text-bottom',
                        'sub',
                        'super',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */ whitespace: [
                {
                    whitespace: [
                        'normal',
                        'nowrap',
                        'pre',
                        'pre-line',
                        'pre-wrap',
                        'break-spaces'
                    ]
                }
            ],
            /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */ break: [
                {
                    break: [
                        'normal',
                        'words',
                        'all',
                        'keep'
                    ]
                }
            ],
            /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */ wrap: [
                {
                    wrap: [
                        'break-word',
                        'anywhere',
                        'normal'
                    ]
                }
            ],
            /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */ hyphens: [
                {
                    hyphens: [
                        'none',
                        'manual',
                        'auto'
                    ]
                }
            ],
            /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */ content: [
                {
                    content: [
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // -------------------
            // --- Backgrounds ---
            // -------------------
            /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */ 'bg-attachment': [
                {
                    bg: [
                        'fixed',
                        'local',
                        'scroll'
                    ]
                }
            ],
            /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */ 'bg-clip': [
                {
                    'bg-clip': [
                        'border',
                        'padding',
                        'content',
                        'text'
                    ]
                }
            ],
            /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */ 'bg-origin': [
                {
                    'bg-origin': [
                        'border',
                        'padding',
                        'content'
                    ]
                }
            ],
            /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */ 'bg-position': [
                {
                    bg: scaleBgPosition()
                }
            ],
            /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */ 'bg-repeat': [
                {
                    bg: scaleBgRepeat()
                }
            ],
            /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */ 'bg-size': [
                {
                    bg: scaleBgSize()
                }
            ],
            /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */ 'bg-image': [
                {
                    bg: [
                        'none',
                        {
                            linear: [
                                {
                                    to: [
                                        't',
                                        'tr',
                                        'r',
                                        'br',
                                        'b',
                                        'bl',
                                        'l',
                                        'tl'
                                    ]
                                },
                                isInteger,
                                isArbitraryVariable,
                                isArbitraryValue
                            ],
                            radial: [
                                '',
                                isArbitraryVariable,
                                isArbitraryValue
                            ],
                            conic: [
                                isInteger,
                                isArbitraryVariable,
                                isArbitraryValue
                            ]
                        },
                        isArbitraryVariableImage,
                        isArbitraryImage
                    ]
                }
            ],
            /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */ 'bg-color': [
                {
                    bg: scaleColor()
                }
            ],
            /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-from-pos': [
                {
                    from: scaleGradientStopPosition()
                }
            ],
            /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-via-pos': [
                {
                    via: scaleGradientStopPosition()
                }
            ],
            /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-to-pos': [
                {
                    to: scaleGradientStopPosition()
                }
            ],
            /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-from': [
                {
                    from: scaleColor()
                }
            ],
            /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-via': [
                {
                    via: scaleColor()
                }
            ],
            /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-to': [
                {
                    to: scaleColor()
                }
            ],
            // ---------------
            // --- Borders ---
            // ---------------
            /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */ rounded: [
                {
                    rounded: scaleRadius()
                }
            ],
            /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-s': [
                {
                    'rounded-s': scaleRadius()
                }
            ],
            /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-e': [
                {
                    'rounded-e': scaleRadius()
                }
            ],
            /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-t': [
                {
                    'rounded-t': scaleRadius()
                }
            ],
            /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-r': [
                {
                    'rounded-r': scaleRadius()
                }
            ],
            /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-b': [
                {
                    'rounded-b': scaleRadius()
                }
            ],
            /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-l': [
                {
                    'rounded-l': scaleRadius()
                }
            ],
            /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-ss': [
                {
                    'rounded-ss': scaleRadius()
                }
            ],
            /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-se': [
                {
                    'rounded-se': scaleRadius()
                }
            ],
            /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-ee': [
                {
                    'rounded-ee': scaleRadius()
                }
            ],
            /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-es': [
                {
                    'rounded-es': scaleRadius()
                }
            ],
            /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-tl': [
                {
                    'rounded-tl': scaleRadius()
                }
            ],
            /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-tr': [
                {
                    'rounded-tr': scaleRadius()
                }
            ],
            /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-br': [
                {
                    'rounded-br': scaleRadius()
                }
            ],
            /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-bl': [
                {
                    'rounded-bl': scaleRadius()
                }
            ],
            /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w': [
                {
                    border: scaleBorderWidth()
                }
            ],
            /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-x': [
                {
                    'border-x': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-y': [
                {
                    'border-y': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-s': [
                {
                    'border-s': scaleBorderWidth()
                }
            ],
            /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-e': [
                {
                    'border-e': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-t': [
                {
                    'border-t': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-r': [
                {
                    'border-r': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-b': [
                {
                    'border-b': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-l': [
                {
                    'border-l': scaleBorderWidth()
                }
            ],
            /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-x': [
                {
                    'divide-x': scaleBorderWidth()
                }
            ],
            /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-x-reverse': [
                'divide-x-reverse'
            ],
            /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-y': [
                {
                    'divide-y': scaleBorderWidth()
                }
            ],
            /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-y-reverse': [
                'divide-y-reverse'
            ],
            /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */ 'border-style': [
                {
                    border: [
                        ...scaleLineStyle(),
                        'hidden',
                        'none'
                    ]
                }
            ],
            /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */ 'divide-style': [
                {
                    divide: [
                        ...scaleLineStyle(),
                        'hidden',
                        'none'
                    ]
                }
            ],
            /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color': [
                {
                    border: scaleColor()
                }
            ],
            /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-x': [
                {
                    'border-x': scaleColor()
                }
            ],
            /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-y': [
                {
                    'border-y': scaleColor()
                }
            ],
            /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-s': [
                {
                    'border-s': scaleColor()
                }
            ],
            /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-e': [
                {
                    'border-e': scaleColor()
                }
            ],
            /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-t': [
                {
                    'border-t': scaleColor()
                }
            ],
            /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-r': [
                {
                    'border-r': scaleColor()
                }
            ],
            /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-b': [
                {
                    'border-b': scaleColor()
                }
            ],
            /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-l': [
                {
                    'border-l': scaleColor()
                }
            ],
            /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */ 'divide-color': [
                {
                    divide: scaleColor()
                }
            ],
            /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */ 'outline-style': [
                {
                    outline: [
                        ...scaleLineStyle(),
                        'none',
                        'hidden'
                    ]
                }
            ],
            /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */ 'outline-offset': [
                {
                    'outline-offset': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */ 'outline-w': [
                {
                    outline: [
                        '',
                        isNumber,
                        isArbitraryVariableLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */ 'outline-color': [
                {
                    outline: scaleColor()
                }
            ],
            // ---------------
            // --- Effects ---
            // ---------------
            /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */ shadow: [
                {
                    shadow: [
                        // Deprecated since Tailwind CSS v4.0.0
                        '',
                        'none',
                        themeShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */ 'shadow-color': [
                {
                    shadow: scaleColor()
                }
            ],
            /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */ 'inset-shadow': [
                {
                    'inset-shadow': [
                        'none',
                        themeInsetShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */ 'inset-shadow-color': [
                {
                    'inset-shadow': scaleColor()
                }
            ],
            /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */ 'ring-w': [
                {
                    ring: scaleBorderWidth()
                }
            ],
            /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */ 'ring-w-inset': [
                'ring-inset'
            ],
            /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */ 'ring-color': [
                {
                    ring: scaleColor()
                }
            ],
            /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */ 'ring-offset-w': [
                {
                    'ring-offset': [
                        isNumber,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */ 'ring-offset-color': [
                {
                    'ring-offset': scaleColor()
                }
            ],
            /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */ 'inset-ring-w': [
                {
                    'inset-ring': scaleBorderWidth()
                }
            ],
            /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */ 'inset-ring-color': [
                {
                    'inset-ring': scaleColor()
                }
            ],
            /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */ 'text-shadow': [
                {
                    'text-shadow': [
                        'none',
                        themeTextShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */ 'text-shadow-color': [
                {
                    'text-shadow': scaleColor()
                }
            ],
            /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */ opacity: [
                {
                    opacity: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */ 'mix-blend': [
                {
                    'mix-blend': [
                        ...scaleBlendMode(),
                        'plus-darker',
                        'plus-lighter'
                    ]
                }
            ],
            /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */ 'bg-blend': [
                {
                    'bg-blend': scaleBlendMode()
                }
            ],
            /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */ 'mask-clip': [
                {
                    'mask-clip': [
                        'border',
                        'padding',
                        'content',
                        'fill',
                        'stroke',
                        'view'
                    ]
                },
                'mask-no-clip'
            ],
            /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */ 'mask-composite': [
                {
                    mask: [
                        'add',
                        'subtract',
                        'intersect',
                        'exclude'
                    ]
                }
            ],
            /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */ 'mask-image-linear-pos': [
                {
                    'mask-linear': [
                        isNumber
                    ]
                }
            ],
            'mask-image-linear-from-pos': [
                {
                    'mask-linear-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-linear-to-pos': [
                {
                    'mask-linear-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-linear-from-color': [
                {
                    'mask-linear-from': scaleColor()
                }
            ],
            'mask-image-linear-to-color': [
                {
                    'mask-linear-to': scaleColor()
                }
            ],
            'mask-image-t-from-pos': [
                {
                    'mask-t-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-t-to-pos': [
                {
                    'mask-t-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-t-from-color': [
                {
                    'mask-t-from': scaleColor()
                }
            ],
            'mask-image-t-to-color': [
                {
                    'mask-t-to': scaleColor()
                }
            ],
            'mask-image-r-from-pos': [
                {
                    'mask-r-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-r-to-pos': [
                {
                    'mask-r-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-r-from-color': [
                {
                    'mask-r-from': scaleColor()
                }
            ],
            'mask-image-r-to-color': [
                {
                    'mask-r-to': scaleColor()
                }
            ],
            'mask-image-b-from-pos': [
                {
                    'mask-b-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-b-to-pos': [
                {
                    'mask-b-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-b-from-color': [
                {
                    'mask-b-from': scaleColor()
                }
            ],
            'mask-image-b-to-color': [
                {
                    'mask-b-to': scaleColor()
                }
            ],
            'mask-image-l-from-pos': [
                {
                    'mask-l-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-l-to-pos': [
                {
                    'mask-l-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-l-from-color': [
                {
                    'mask-l-from': scaleColor()
                }
            ],
            'mask-image-l-to-color': [
                {
                    'mask-l-to': scaleColor()
                }
            ],
            'mask-image-x-from-pos': [
                {
                    'mask-x-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-x-to-pos': [
                {
                    'mask-x-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-x-from-color': [
                {
                    'mask-x-from': scaleColor()
                }
            ],
            'mask-image-x-to-color': [
                {
                    'mask-x-to': scaleColor()
                }
            ],
            'mask-image-y-from-pos': [
                {
                    'mask-y-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-y-to-pos': [
                {
                    'mask-y-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-y-from-color': [
                {
                    'mask-y-from': scaleColor()
                }
            ],
            'mask-image-y-to-color': [
                {
                    'mask-y-to': scaleColor()
                }
            ],
            'mask-image-radial': [
                {
                    'mask-radial': [
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            'mask-image-radial-from-pos': [
                {
                    'mask-radial-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-radial-to-pos': [
                {
                    'mask-radial-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-radial-from-color': [
                {
                    'mask-radial-from': scaleColor()
                }
            ],
            'mask-image-radial-to-color': [
                {
                    'mask-radial-to': scaleColor()
                }
            ],
            'mask-image-radial-shape': [
                {
                    'mask-radial': [
                        'circle',
                        'ellipse'
                    ]
                }
            ],
            'mask-image-radial-size': [
                {
                    'mask-radial': [
                        {
                            closest: [
                                'side',
                                'corner'
                            ],
                            farthest: [
                                'side',
                                'corner'
                            ]
                        }
                    ]
                }
            ],
            'mask-image-radial-pos': [
                {
                    'mask-radial-at': scalePosition()
                }
            ],
            'mask-image-conic-pos': [
                {
                    'mask-conic': [
                        isNumber
                    ]
                }
            ],
            'mask-image-conic-from-pos': [
                {
                    'mask-conic-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-conic-to-pos': [
                {
                    'mask-conic-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-conic-from-color': [
                {
                    'mask-conic-from': scaleColor()
                }
            ],
            'mask-image-conic-to-color': [
                {
                    'mask-conic-to': scaleColor()
                }
            ],
            /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */ 'mask-mode': [
                {
                    mask: [
                        'alpha',
                        'luminance',
                        'match'
                    ]
                }
            ],
            /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */ 'mask-origin': [
                {
                    'mask-origin': [
                        'border',
                        'padding',
                        'content',
                        'fill',
                        'stroke',
                        'view'
                    ]
                }
            ],
            /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */ 'mask-position': [
                {
                    mask: scaleBgPosition()
                }
            ],
            /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */ 'mask-repeat': [
                {
                    mask: scaleBgRepeat()
                }
            ],
            /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */ 'mask-size': [
                {
                    mask: scaleBgSize()
                }
            ],
            /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */ 'mask-type': [
                {
                    'mask-type': [
                        'alpha',
                        'luminance'
                    ]
                }
            ],
            /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */ 'mask-image': [
                {
                    mask: [
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // ---------------
            // --- Filters ---
            // ---------------
            /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */ filter: [
                {
                    filter: [
                        // Deprecated since Tailwind CSS v3.0.0
                        '',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */ blur: [
                {
                    blur: scaleBlur()
                }
            ],
            /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */ brightness: [
                {
                    brightness: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */ contrast: [
                {
                    contrast: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */ 'drop-shadow': [
                {
                    'drop-shadow': [
                        // Deprecated since Tailwind CSS v4.0.0
                        '',
                        'none',
                        themeDropShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */ 'drop-shadow-color': [
                {
                    'drop-shadow': scaleColor()
                }
            ],
            /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */ grayscale: [
                {
                    grayscale: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */ 'hue-rotate': [
                {
                    'hue-rotate': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */ invert: [
                {
                    invert: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */ saturate: [
                {
                    saturate: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */ sepia: [
                {
                    sepia: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */ 'backdrop-filter': [
                {
                    'backdrop-filter': [
                        // Deprecated since Tailwind CSS v3.0.0
                        '',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */ 'backdrop-blur': [
                {
                    'backdrop-blur': scaleBlur()
                }
            ],
            /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */ 'backdrop-brightness': [
                {
                    'backdrop-brightness': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */ 'backdrop-contrast': [
                {
                    'backdrop-contrast': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */ 'backdrop-grayscale': [
                {
                    'backdrop-grayscale': [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */ 'backdrop-hue-rotate': [
                {
                    'backdrop-hue-rotate': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */ 'backdrop-invert': [
                {
                    'backdrop-invert': [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */ 'backdrop-opacity': [
                {
                    'backdrop-opacity': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */ 'backdrop-saturate': [
                {
                    'backdrop-saturate': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */ 'backdrop-sepia': [
                {
                    'backdrop-sepia': [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // --------------
            // --- Tables ---
            // --------------
            /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */ 'border-collapse': [
                {
                    border: [
                        'collapse',
                        'separate'
                    ]
                }
            ],
            /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing': [
                {
                    'border-spacing': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing-x': [
                {
                    'border-spacing-x': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing-y': [
                {
                    'border-spacing-y': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */ 'table-layout': [
                {
                    table: [
                        'auto',
                        'fixed'
                    ]
                }
            ],
            /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */ caption: [
                {
                    caption: [
                        'top',
                        'bottom'
                    ]
                }
            ],
            // ---------------------------------
            // --- Transitions and Animation ---
            // ---------------------------------
            /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */ transition: [
                {
                    transition: [
                        '',
                        'all',
                        'colors',
                        'opacity',
                        'shadow',
                        'transform',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */ 'transition-behavior': [
                {
                    transition: [
                        'normal',
                        'discrete'
                    ]
                }
            ],
            /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */ duration: [
                {
                    duration: [
                        isNumber,
                        'initial',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */ ease: [
                {
                    ease: [
                        'linear',
                        'initial',
                        themeEase,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */ delay: [
                {
                    delay: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */ animate: [
                {
                    animate: [
                        'none',
                        themeAnimate,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // ------------------
            // --- Transforms ---
            // ------------------
            /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */ backface: [
                {
                    backface: [
                        'hidden',
                        'visible'
                    ]
                }
            ],
            /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */ perspective: [
                {
                    perspective: [
                        themePerspective,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */ 'perspective-origin': [
                {
                    'perspective-origin': scalePositionWithArbitrary()
                }
            ],
            /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */ rotate: [
                {
                    rotate: scaleRotate()
                }
            ],
            /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */ 'rotate-x': [
                {
                    'rotate-x': scaleRotate()
                }
            ],
            /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */ 'rotate-y': [
                {
                    'rotate-y': scaleRotate()
                }
            ],
            /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */ 'rotate-z': [
                {
                    'rotate-z': scaleRotate()
                }
            ],
            /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */ scale: [
                {
                    scale: scaleScale()
                }
            ],
            /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-x': [
                {
                    'scale-x': scaleScale()
                }
            ],
            /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-y': [
                {
                    'scale-y': scaleScale()
                }
            ],
            /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-z': [
                {
                    'scale-z': scaleScale()
                }
            ],
            /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-3d': [
                'scale-3d'
            ],
            /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */ skew: [
                {
                    skew: scaleSkew()
                }
            ],
            /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */ 'skew-x': [
                {
                    'skew-x': scaleSkew()
                }
            ],
            /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */ 'skew-y': [
                {
                    'skew-y': scaleSkew()
                }
            ],
            /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */ transform: [
                {
                    transform: [
                        isArbitraryVariable,
                        isArbitraryValue,
                        '',
                        'none',
                        'gpu',
                        'cpu'
                    ]
                }
            ],
            /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */ 'transform-origin': [
                {
                    origin: scalePositionWithArbitrary()
                }
            ],
            /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */ 'transform-style': [
                {
                    transform: [
                        '3d',
                        'flat'
                    ]
                }
            ],
            /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */ translate: [
                {
                    translate: scaleTranslate()
                }
            ],
            /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-x': [
                {
                    'translate-x': scaleTranslate()
                }
            ],
            /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-y': [
                {
                    'translate-y': scaleTranslate()
                }
            ],
            /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-z': [
                {
                    'translate-z': scaleTranslate()
                }
            ],
            /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-none': [
                'translate-none'
            ],
            // ---------------------
            // --- Interactivity ---
            // ---------------------
            /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */ accent: [
                {
                    accent: scaleColor()
                }
            ],
            /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */ appearance: [
                {
                    appearance: [
                        'none',
                        'auto'
                    ]
                }
            ],
            /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */ 'caret-color': [
                {
                    caret: scaleColor()
                }
            ],
            /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */ 'color-scheme': [
                {
                    scheme: [
                        'normal',
                        'dark',
                        'light',
                        'light-dark',
                        'only-dark',
                        'only-light'
                    ]
                }
            ],
            /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */ cursor: [
                {
                    cursor: [
                        'auto',
                        'default',
                        'pointer',
                        'wait',
                        'text',
                        'move',
                        'help',
                        'not-allowed',
                        'none',
                        'context-menu',
                        'progress',
                        'cell',
                        'crosshair',
                        'vertical-text',
                        'alias',
                        'copy',
                        'no-drop',
                        'grab',
                        'grabbing',
                        'all-scroll',
                        'col-resize',
                        'row-resize',
                        'n-resize',
                        'e-resize',
                        's-resize',
                        'w-resize',
                        'ne-resize',
                        'nw-resize',
                        'se-resize',
                        'sw-resize',
                        'ew-resize',
                        'ns-resize',
                        'nesw-resize',
                        'nwse-resize',
                        'zoom-in',
                        'zoom-out',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */ 'field-sizing': [
                {
                    'field-sizing': [
                        'fixed',
                        'content'
                    ]
                }
            ],
            /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */ 'pointer-events': [
                {
                    'pointer-events': [
                        'auto',
                        'none'
                    ]
                }
            ],
            /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */ resize: [
                {
                    resize: [
                        'none',
                        '',
                        'y',
                        'x'
                    ]
                }
            ],
            /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */ 'scroll-behavior': [
                {
                    scroll: [
                        'auto',
                        'smooth'
                    ]
                }
            ],
            /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-m': [
                {
                    'scroll-m': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mx': [
                {
                    'scroll-mx': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-my': [
                {
                    'scroll-my': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-ms': [
                {
                    'scroll-ms': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-me': [
                {
                    'scroll-me': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mt': [
                {
                    'scroll-mt': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mr': [
                {
                    'scroll-mr': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mb': [
                {
                    'scroll-mb': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-ml': [
                {
                    'scroll-ml': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-p': [
                {
                    'scroll-p': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-px': [
                {
                    'scroll-px': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-py': [
                {
                    'scroll-py': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-ps': [
                {
                    'scroll-ps': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pe': [
                {
                    'scroll-pe': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pt': [
                {
                    'scroll-pt': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pr': [
                {
                    'scroll-pr': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pb': [
                {
                    'scroll-pb': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pl': [
                {
                    'scroll-pl': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */ 'snap-align': [
                {
                    snap: [
                        'start',
                        'end',
                        'center',
                        'align-none'
                    ]
                }
            ],
            /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */ 'snap-stop': [
                {
                    snap: [
                        'normal',
                        'always'
                    ]
                }
            ],
            /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */ 'snap-type': [
                {
                    snap: [
                        'none',
                        'x',
                        'y',
                        'both'
                    ]
                }
            ],
            /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */ 'snap-strictness': [
                {
                    snap: [
                        'mandatory',
                        'proximity'
                    ]
                }
            ],
            /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */ touch: [
                {
                    touch: [
                        'auto',
                        'none',
                        'manipulation'
                    ]
                }
            ],
            /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-x': [
                {
                    'touch-pan': [
                        'x',
                        'left',
                        'right'
                    ]
                }
            ],
            /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-y': [
                {
                    'touch-pan': [
                        'y',
                        'up',
                        'down'
                    ]
                }
            ],
            /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-pz': [
                'touch-pinch-zoom'
            ],
            /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */ select: [
                {
                    select: [
                        'none',
                        'text',
                        'all',
                        'auto'
                    ]
                }
            ],
            /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */ 'will-change': [
                {
                    'will-change': [
                        'auto',
                        'scroll',
                        'contents',
                        'transform',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // -----------
            // --- SVG ---
            // -----------
            /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */ fill: [
                {
                    fill: [
                        'none',
                        ...scaleColor()
                    ]
                }
            ],
            /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */ 'stroke-w': [
                {
                    stroke: [
                        isNumber,
                        isArbitraryVariableLength,
                        isArbitraryLength,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */ stroke: [
                {
                    stroke: [
                        'none',
                        ...scaleColor()
                    ]
                }
            ],
            // ---------------------
            // --- Accessibility ---
            // ---------------------
            /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */ 'forced-color-adjust': [
                {
                    'forced-color-adjust': [
                        'auto',
                        'none'
                    ]
                }
            ]
        },
        conflictingClassGroups: {
            overflow: [
                'overflow-x',
                'overflow-y'
            ],
            overscroll: [
                'overscroll-x',
                'overscroll-y'
            ],
            inset: [
                'inset-x',
                'inset-y',
                'start',
                'end',
                'top',
                'right',
                'bottom',
                'left'
            ],
            'inset-x': [
                'right',
                'left'
            ],
            'inset-y': [
                'top',
                'bottom'
            ],
            flex: [
                'basis',
                'grow',
                'shrink'
            ],
            gap: [
                'gap-x',
                'gap-y'
            ],
            p: [
                'px',
                'py',
                'ps',
                'pe',
                'pt',
                'pr',
                'pb',
                'pl'
            ],
            px: [
                'pr',
                'pl'
            ],
            py: [
                'pt',
                'pb'
            ],
            m: [
                'mx',
                'my',
                'ms',
                'me',
                'mt',
                'mr',
                'mb',
                'ml'
            ],
            mx: [
                'mr',
                'ml'
            ],
            my: [
                'mt',
                'mb'
            ],
            size: [
                'w',
                'h'
            ],
            'font-size': [
                'leading'
            ],
            'fvn-normal': [
                'fvn-ordinal',
                'fvn-slashed-zero',
                'fvn-figure',
                'fvn-spacing',
                'fvn-fraction'
            ],
            'fvn-ordinal': [
                'fvn-normal'
            ],
            'fvn-slashed-zero': [
                'fvn-normal'
            ],
            'fvn-figure': [
                'fvn-normal'
            ],
            'fvn-spacing': [
                'fvn-normal'
            ],
            'fvn-fraction': [
                'fvn-normal'
            ],
            'line-clamp': [
                'display',
                'overflow'
            ],
            rounded: [
                'rounded-s',
                'rounded-e',
                'rounded-t',
                'rounded-r',
                'rounded-b',
                'rounded-l',
                'rounded-ss',
                'rounded-se',
                'rounded-ee',
                'rounded-es',
                'rounded-tl',
                'rounded-tr',
                'rounded-br',
                'rounded-bl'
            ],
            'rounded-s': [
                'rounded-ss',
                'rounded-es'
            ],
            'rounded-e': [
                'rounded-se',
                'rounded-ee'
            ],
            'rounded-t': [
                'rounded-tl',
                'rounded-tr'
            ],
            'rounded-r': [
                'rounded-tr',
                'rounded-br'
            ],
            'rounded-b': [
                'rounded-br',
                'rounded-bl'
            ],
            'rounded-l': [
                'rounded-tl',
                'rounded-bl'
            ],
            'border-spacing': [
                'border-spacing-x',
                'border-spacing-y'
            ],
            'border-w': [
                'border-w-x',
                'border-w-y',
                'border-w-s',
                'border-w-e',
                'border-w-t',
                'border-w-r',
                'border-w-b',
                'border-w-l'
            ],
            'border-w-x': [
                'border-w-r',
                'border-w-l'
            ],
            'border-w-y': [
                'border-w-t',
                'border-w-b'
            ],
            'border-color': [
                'border-color-x',
                'border-color-y',
                'border-color-s',
                'border-color-e',
                'border-color-t',
                'border-color-r',
                'border-color-b',
                'border-color-l'
            ],
            'border-color-x': [
                'border-color-r',
                'border-color-l'
            ],
            'border-color-y': [
                'border-color-t',
                'border-color-b'
            ],
            translate: [
                'translate-x',
                'translate-y',
                'translate-none'
            ],
            'translate-none': [
                'translate',
                'translate-x',
                'translate-y',
                'translate-z'
            ],
            'scroll-m': [
                'scroll-mx',
                'scroll-my',
                'scroll-ms',
                'scroll-me',
                'scroll-mt',
                'scroll-mr',
                'scroll-mb',
                'scroll-ml'
            ],
            'scroll-mx': [
                'scroll-mr',
                'scroll-ml'
            ],
            'scroll-my': [
                'scroll-mt',
                'scroll-mb'
            ],
            'scroll-p': [
                'scroll-px',
                'scroll-py',
                'scroll-ps',
                'scroll-pe',
                'scroll-pt',
                'scroll-pr',
                'scroll-pb',
                'scroll-pl'
            ],
            'scroll-px': [
                'scroll-pr',
                'scroll-pl'
            ],
            'scroll-py': [
                'scroll-pt',
                'scroll-pb'
            ],
            touch: [
                'touch-x',
                'touch-y',
                'touch-pz'
            ],
            'touch-x': [
                'touch'
            ],
            'touch-y': [
                'touch'
            ],
            'touch-pz': [
                'touch'
            ]
        },
        conflictingClassGroupModifiers: {
            'font-size': [
                'leading'
            ]
        },
        orderSensitiveModifiers: [
            '*',
            '**',
            'after',
            'backdrop',
            'before',
            'details-content',
            'file',
            'first-letter',
            'first-line',
            'marker',
            'placeholder',
            'selection'
        ]
    };
};
/**
 * @param baseConfig Config where other config will be merged into. This object will be mutated.
 * @param configExtension Partial config to merge into the `baseConfig`.
 */ const mergeConfigs = (baseConfig, { cacheSize, prefix, experimentalParseClassName, extend = {}, override = {} })=>{
    overrideProperty(baseConfig, 'cacheSize', cacheSize);
    overrideProperty(baseConfig, 'prefix', prefix);
    overrideProperty(baseConfig, 'experimentalParseClassName', experimentalParseClassName);
    overrideConfigProperties(baseConfig.theme, override.theme);
    overrideConfigProperties(baseConfig.classGroups, override.classGroups);
    overrideConfigProperties(baseConfig.conflictingClassGroups, override.conflictingClassGroups);
    overrideConfigProperties(baseConfig.conflictingClassGroupModifiers, override.conflictingClassGroupModifiers);
    overrideProperty(baseConfig, 'orderSensitiveModifiers', override.orderSensitiveModifiers);
    mergeConfigProperties(baseConfig.theme, extend.theme);
    mergeConfigProperties(baseConfig.classGroups, extend.classGroups);
    mergeConfigProperties(baseConfig.conflictingClassGroups, extend.conflictingClassGroups);
    mergeConfigProperties(baseConfig.conflictingClassGroupModifiers, extend.conflictingClassGroupModifiers);
    mergeArrayProperties(baseConfig, extend, 'orderSensitiveModifiers');
    return baseConfig;
};
const overrideProperty = (baseObject, overrideKey, overrideValue)=>{
    if (overrideValue !== undefined) {
        baseObject[overrideKey] = overrideValue;
    }
};
const overrideConfigProperties = (baseObject, overrideObject)=>{
    if (overrideObject) {
        for(const key in overrideObject){
            overrideProperty(baseObject, key, overrideObject[key]);
        }
    }
};
const mergeConfigProperties = (baseObject, mergeObject)=>{
    if (mergeObject) {
        for(const key in mergeObject){
            mergeArrayProperties(baseObject, mergeObject, key);
        }
    }
};
const mergeArrayProperties = (baseObject, mergeObject, key)=>{
    const mergeValue = mergeObject[key];
    if (mergeValue !== undefined) {
        baseObject[key] = baseObject[key] ? baseObject[key].concat(mergeValue) : mergeValue;
    }
};
const extendTailwindMerge = (configExtension, ...createConfig)=>typeof configExtension === 'function' ? createTailwindMerge(getDefaultConfig, configExtension, ...createConfig) : createTailwindMerge(()=>mergeConfigs(getDefaultConfig(), configExtension), ...createConfig);
const twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
;
 //# sourceMappingURL=bundle-mjs.mjs.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Lock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "18",
            height: "11",
            x: "3",
            y: "11",
            rx: "2",
            ry: "2",
            key: "1w4ew1"
        }
    ],
    [
        "path",
        {
            d: "M7 11V7a5 5 0 0 1 10 0v4",
            key: "fwvmzm"
        }
    ]
];
const Lock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("lock", __iconNode);
;
 //# sourceMappingURL=lock.js.map
}),
"[project]/frontend/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Lock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=9e883_d690bf12._.js.map