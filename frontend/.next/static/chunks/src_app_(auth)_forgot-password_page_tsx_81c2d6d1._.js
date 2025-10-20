(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/(auth)/forgot-password/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// Define step constants for clarity
const STEPS = {
    ENTER_EMAIL: 'ENTER_EMAIL',
    VERIFY_CODE: 'VERIFY_CODE',
    RESET_PASSWORD: 'RESET_PASSWORD'
};
const ForgotPasswordPage = ()=>{
    _s();
    // State for multi-step form logic
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(STEPS.ENTER_EMAIL);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [resetToken, setResetToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // To store the temporary token from the backend
    // General UI state
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Generic handler to update state from input fields
    const handleStateChange = (setter)=>(e)=>{
            setter(e.target.value);
            if (error) setError(null);
        };
    // Step 1: API call to send verification code
    const handleSendCode = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4444/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to send code.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message);
            setCurrentStep(STEPS.VERIFY_CODE);
        } catch (err) {
            const errorMessage = err.message || 'An error occurred. Please try again.';
            setError(errorMessage);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
        } finally{
            setLoading(false);
        }
    };
    // Step 2: API call to verify the code
    const handleVerifyCode = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4444/verifyCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    code
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Code verification failed.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message);
            setResetToken(data.resetToken); // Save the temporary token
            setCurrentStep(STEPS.RESET_PASSWORD);
        } catch (err) {
            const errorMessage = err.message || 'An error occurred. Please try again.';
            setError(errorMessage);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
        } finally{
            setLoading(false);
        }
    };
    // Step 3: API call to reset the password using the token
    const handleResetPassword = async (e)=>{
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            const msg = "Passwords do not match.";
            setError(msg);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(msg);
            return;
        }
        if (newPassword.length < 6) {
            const msg = "Password must be at least 6 characters long.";
            setError(msg);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(msg);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4444/resetPasswordWithToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resetToken,
                    newPassword
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to reset password.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Password has been reset successfully!');
            window.location.href = '/signIn'; // Redirect on success
        } catch (err) {
            const errorMessage = err.message || 'An error occurred. Please try again.';
            setError(errorMessage);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
        } finally{
            setLoading(false);
        }
    };
    // Render different form inputs based on the current step
    const renderFormContent = ()=>{
        switch(currentStep){
            case STEPS.ENTER_EMAIL:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8",
                            children: "Enter your gmail to receive a verification code."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "flex flex-col space-y-3 sm:space-y-4",
                            onSubmit: handleSendCode,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    placeholder: "Gmail",
                                    className: "w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out",
                                    value: email,
                                    onChange: handleStateChange(setEmail),
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? 'Sending...' : 'Send Code'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true);
            case STEPS.VERIFY_CODE:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8",
                            children: [
                                "A 6-digit code was sent to ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-white",
                                    children: email
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 42
                                }, this),
                                ". It expires in 1 minute."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "flex flex-col space-y-3 sm:space-y-4",
                            onSubmit: handleVerifyCode,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "6-digit code",
                                    className: "w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out",
                                    value: code,
                                    onChange: handleStateChange(setCode),
                                    required: true,
                                    maxLength: 6,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? 'Verifying...' : 'Verify Code'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true);
            case STEPS.RESET_PASSWORD:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8",
                            children: "Code verified. Please enter your new password."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "flex flex-col space-y-3 sm:space-y-4",
                            onSubmit: handleResetPassword,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "New Password",
                                    className: "w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out",
                                    value: newPassword,
                                    onChange: handleStateChange(setNewPassword),
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Confirm New Password",
                                    className: "w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out",
                                    value: confirmPassword,
                                    onChange: handleStateChange(setConfirmPassword),
                                    required: true,
                                    disabled: loading
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? 'Resetting...' : 'Reset Password'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 rounded-lg md:rounded-xl shadow-md sm:shadow-lg md:shadow-xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-[180px] sm:max-w-[220px] md:max-w-xs mx-auto mb-2 sm:mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "https://media1.tenor.com/m/5ot5ADGxJdAAAAAd/hello.gif",
                        alt: "Logo",
                        className: "w-full h-auto rounded-lg"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4",
                        children: "Forgot Password"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                    lineNumber: 193,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: renderFormContent()
                }, void 0, false, {
                    fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
                    lineNumber: 198,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(auth)/forgot-password/page.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
};
_s(ForgotPasswordPage, "4GXTLxFBd95afwkUf1souQ0nKhY=");
_c = ForgotPasswordPage;
const __TURBOPACK__default__export__ = ForgotPasswordPage;
var _c;
__turbopack_context__.k.register(_c, "ForgotPasswordPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_%28auth%29_forgot-password_page_tsx_81c2d6d1._.js.map