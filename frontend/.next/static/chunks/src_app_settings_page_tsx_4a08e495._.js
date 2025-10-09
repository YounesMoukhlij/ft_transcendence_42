(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/settings/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 'use client'
// import React, { useState, useRef, useEffect } from 'react'
// import { Camera, Save, User, Mail, Lock, FileText, Globe, ChevronDown } from 'lucide-react'
// import { useUserStore } from '../../store/userStore'
// import { toast } from 'react-toastify'
// const API_URL = 'http://localhost:4444'
// const defaultProfileImg = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg'
// interface LanguageOption {
//   id: string
//   label: string
//   flag: string
// }
// const ProfileSettingsPage = () => {
//   const Userdata = useUserStore((state) => state.user)
//   const setUser = useUserStore((state) => state.setUser)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const [formData, setFormData] = useState({
//     profile_img: '',
//     languages: 'es',
//     username: '',
//     full_name: '',
//     email: '',
//     bio: '',
//     newPassword: '',
//     confirmPassword: '',
//   })
//   const [previewImage, setPreviewImage] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   // Populate form with user data when component mounts or Userdata changes
//   useEffect(() => {
//     if (Userdata) {
//       setFormData({
//         profile_img: Userdata.profile_img || '',
//         languages: Userdata.languages || 'en',
//         username: Userdata.username || '',
//         full_name: Userdata.full_name || '',
//         email: Userdata.email || '',
//         bio: Userdata.bio || '',
//         newPassword: '',
//         confirmPassword: '',
//       })
//     }
//   }, [Userdata])
//   const languages: LanguageOption[] = [
//     { id: 'en', label: 'English', flag: '🇬🇧' },
//     { id: 'es', label: 'Spanish', flag: '🇪🇸' },
//     { id: 'tz', label: 'Tamazight', flag: 'ⵣ' },
//     { id: 'fr', label: 'French', flag: '🇫🇷' },
//   ]
//   const authMethod = Userdata?.auth_method || 0
//   const isPasswordAuth = authMethod === 0
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }
//   const handleImageClick = () => {
//     fileInputRef.current?.click()
//   }
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB')
//         return
//       }
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please upload a valid image file')
//         return
//       }
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string)
//         setFormData(prev => ({ ...prev, profile_img: reader.result as string }))
//       }
//       reader.readAsDataURL(file)
//     }
//   }
//   const validateForm = () => {
//     if (!formData.username.trim()) {
//       toast.error('Username is required')
//       return false
//     }
//     if (!formData.email.trim()) {
//       toast.error('Email is required')
//       return false
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address')
//       return false
//     }
//     if (isPasswordAuth && (formData.newPassword || formData.confirmPassword)) {
//       if (formData.newPassword.length < 8) {
//         toast.error('Password must be at least 8 characters long')
//         return false
//       }
//       if (formData.newPassword !== formData.confirmPassword) {
//         toast.error('Passwords do not match')
//         return false
//       }
//     }
//     return true
//   }
//   const handleSave = async () => {
//     if (!validateForm()) return
//     setIsLoading(true)
//     try {
//       // Prepare update data
//       const updateData: any = {
//         username: formData.username.trim(),
//         full_name: formData.full_name.trim(),
//         email: formData.email.trim(),
//         bio: formData.bio.trim(),
//         profile_img: formData.profile_img || Userdata?.profile_img,
//         languages: formData.languages,
//       }
//       // Only include password if user is changing it
//       if (isPasswordAuth && formData.newPassword) {
//         updateData.password = formData.newPassword
//       }
//       // TODO: Make actual API call to update user
//       // const response = await fetch(`${API_URL}/updateUser/${Userdata?.id_user}`, {
//       //   method: 'PUT',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(updateData)
//       // })
//       // 
//       // if (!response.ok) {
//       //   throw new Error('Failed to update profile')
//       // }
//       // 
//       // const updatedUser = await response.json()
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000))
//       // Update user store with new data
//       const updatedUser = {
//         ...Userdata,
//         ...updateData,
//       }
//       setUser(updatedUser)
//       // Update localStorage
//       localStorage.setItem('user', JSON.stringify(updatedUser))
//       toast.success('Profile updated successfully!')
//       // Clear password fields
//       setFormData(prev => ({ 
//         ...prev, 
//         newPassword: '', 
//         confirmPassword: '' 
//       }))
//       // Clear preview image
//       setPreviewImage(null)
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       toast.error('Failed to update profile. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }
//   if (!Userdata) {
//     return (
//       <div className='min-h-screen w-full flex items-center justify-center bg-black'>
//         <p className='text-gray-500'>Loading user data...</p>
//       </div>
//     )
//   }
//   return (
//     <div className='min-h-screen w-full bg-black p-3 sm:p-4 md:p-6 lg:p-8'>
//       <div className='max-w-5xl mx-auto'>
//         {/* Header */}
//         <div className='text-center mb-6 sm:mb-8 md:mb-10'>
//           <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2'>
//             Account Settings
//           </h1>
//           <p className='text-xs sm:text-sm md:text-base text-gray-500'>
//             Manage your profile and preferences
//           </p>
//         </div>
//         {/* Main Card */}
//         <div className='bg-black border-2 border-gray-400 rounded-2xl shadow-2xl overflow-hidden'>
//           {/* Profile Image Section */}
//           <div className='bg-gradient-to-b from-black to-gray-800 p-6 sm:p-8 md:p-10 flex justify-center relative border-b-2 border-gray-400'>
//             <div 
//               className='relative group cursor-pointer'
//               onClick={handleImageClick}
//               role="button"
//               aria-label="Change profile picture"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   handleImageClick()
//                 }
//               }}
//             >
//               <div className='relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40'>
//                 <img 
//                   src={previewImage || formData.profile_img || defaultProfileImg}
//                   alt="Profile" 
//                   className='w-full h-full rounded-full object-cover border-2 border-gray-400 shadow-2xl transition-all duration-300 group-hover:brightness-50 group-hover:border-white'
//                 />
//                 {/* Camera Overlay */}
//                 <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300'>
//                   <Camera size={36} className='text-white mb-1' strokeWidth={2.5} />
//                   <span className='text-white text-xs font-semibold'>Change Photo</span>
//                 </div>
//               </div>
//               <input 
//                 ref={fileInputRef}
//                 type="file" 
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//                 aria-hidden="true"
//               />
//             </div>
//           </div>
//           {/* Form Section */}
//           <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6'>
//               {/* Language Selection */}
//               <div className='md:col-span-2'>
//                 <label htmlFor="languages" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                   <Globe size={16} className='sm:w-5 sm:h-5' />
//                   Preferred Language
//                 </label>
//                 <div className="relative">
//                   <select
//                     id="languages"
//                     name="languages"
//                     value={formData.languages}
//                     onChange={handleInputChange}
//                     className="w-full p-3 sm:p-3.5 pr-10 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm sm:text-base appearance-none cursor-pointer hover:border-white"
//                   >
//                     {languages.map((lang) => (
//                       <option key={lang.id} value={lang.id} className="bg-black text-white">
//                         {lang.flag} {lang.label}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
//                 </div>
//               </div>
//               {/* Username */}
//               <div>
//                 <label htmlFor="username" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                   <User size={16} className='sm:w-5 sm:h-5' />
//                   Username
//                 </label>
//                 <input 
//                   type="text" 
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   className='w-full p-3 sm:p-3.5 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm sm:text-base hover:border-white placeholder-gray-500'
//                   placeholder="Enter your username"
//                 />
//               </div>
//               {/* Full Name */}
//               <div>
//                 <label htmlFor="full_name" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                   <User size={16} className='sm:w-5 sm:h-5' />
//                   Full Name
//                 </label>
//                 <input 
//                   type="text" 
//                   id="full_name"
//                   name="full_name"
//                   value={formData.full_name}
//                   onChange={handleInputChange}
//                   className='w-full p-3 sm:p-3.5 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm sm:text-base hover:border-white placeholder-gray-500'
//                   placeholder="Enter your full name"
//                 />
//               </div>
//               {/* Email */}
//               <div className='md:col-span-2'>
//                 <label htmlFor="email" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                   <Mail size={16} className='sm:w-5 sm:h-5' />
//                   Email Address
//                 </label>
//                 <input 
//                   type="email" 
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className='w-full p-3 sm:p-3.5 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm sm:text-base hover:border-white placeholder-gray-500'
//                   placeholder="Enter your email address"
//                 />
//               </div>
//               {/* Bio */}
//               <div className='md:col-span-2'>
//                 <label htmlFor="bio" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                   <FileText size={16} className='sm:w-5 sm:h-5' />
//                   Bio
//                 </label>
//                 <textarea
//                   id="bio"
//                   name="bio"
//                   rows={4}
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   className='w-full p-3 sm:p-3.5 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none resize-none text-white text-sm sm:text-base hover:border-white placeholder-gray-500'
//                   placeholder="Tell us about yourself..."
//                 />
//               </div>
//               {/* Password Fields - Only show if password auth */}
//               {isPasswordAuth && (
//                 <>
//                   <div>
//                     <label htmlFor="newPassword" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                       <Lock size={16} className='sm:w-5 sm:h-5' />
//                       New Password
//                     </label>
//                     <input 
//                       type="password" 
//                       id="newPassword"
//                       name="newPassword"
//                       value={formData.newPassword}
//                       onChange={handleInputChange}
//                       className='w-full p-3 sm:p-3.5 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm sm:text-base hover:border-white placeholder-gray-500'
//                       placeholder="Enter new password"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="confirmPassword" className='flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-2'>
//                       <Lock size={16} className='sm:w-5 sm:h-5' />
//                       Confirm Password
//                     </label>
//                     <input 
//                       type="password" 
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleInputChange}
//                       className='w-full p-3 sm:p-3.5 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm sm:text-base hover:border-white placeholder-gray-500'
//                       placeholder="Confirm new password"
//                     />
//                   </div>
//                 </>
//               )}
//               {/* OAuth Info Message */}
//               {!isPasswordAuth && (
//                 <div className='md:col-span-2 p-4 bg-black border-2 border-gray-400 rounded-xl'>
//                   <p className='text-xs sm:text-sm text-gray-500 flex items-start gap-2'>
//                     <Lock size={16} className='mt-0.5 flex-shrink-0' />
//                     <span>
//                       You signed in with <strong className='text-white'>{authMethod === 1 ? 'Google' : '42'}</strong>. Password management is not available for OAuth accounts.
//                     </span>
//                   </p>
//                 </div>
//               )}
//             </div>
//             {/* Save Button */}
//             <div className='mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3'>
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 disabled={isLoading}
//                 className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 transition-all text-sm sm:text-base ${
//                   isLoading
//                     ? 'bg-gray-500 text-black cursor-not-allowed opacity-50'
//                     : 'bg-white text-black hover:bg-gray-500 hover:text-white active:scale-95'
//                 }`}
//               >
//                 <Save size={18} className='sm:w-5 sm:h-5' />
//                 {isLoading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default ProfileSettingsPage
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const page = ()=>{
    _s();
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSubmit = (e)=>{
        e.preventDefault();
        // Handle code verification logic here
        console.log("Verifying code:", code);
        console.log("Code verified successfully!");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen w-full flex items-center justify-center bg-black p-3 sm:p-4 md:p-6 lg:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-screen bg-black p-3 border-2 border-gray-400 rounded-2xl shadow-2xl max-w-md mx-auto max-h-100 ",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mb-4 text-2xl font-bold",
                    children: "Two-Factor Authentication"
                }, void 0, false, {
                    fileName: "[project]/src/app/settings/page.tsx",
                    lineNumber: 441,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-8 text-center text-gray-500 text-xl",
                    children: "Please enter the 6-digit code from your authenticator app to continue."
                }, void 0, false, {
                    fileName: "[project]/src/app/settings/page.tsx",
                    lineNumber: 442,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "w-full max-w-sm mb-4 flex flex-col items-around gap-4",
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 flex justify-between",
                            children: [
                                ...Array(6)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    maxLength: 1,
                                    className: "w-12 rounded border border-gray-300 p-2 text-center text-xl focus:border-gray-500 focus:outline-none",
                                    onChange: (e)=>{
                                        const value = e.target.value;
                                        if (/^[0-9]$/.test(value)) {
                                            setCode((prev)=>prev + value);
                                            // Move to next input
                                            const nextInput = e.target.nextElementSibling;
                                            if (nextInput) {
                                                nextInput.focus();
                                            }
                                        } else {
                                            e.target.value = "";
                                        }
                                    }
                                }, i, false, {
                                    fileName: "[project]/src/app/settings/page.tsx",
                                    lineNumber: 451,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/settings/page.tsx",
                            lineNumber: 449,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "w-full rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 hover:cursor-pointer active:scale-95 ",
                                children: "Verify"
                            }, void 0, false, {
                                fileName: "[project]/src/app/settings/page.tsx",
                                lineNumber: 473,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/settings/page.tsx",
                            lineNumber: 472,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/settings/page.tsx",
                    lineNumber: 445,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/settings/page.tsx",
            lineNumber: 439,
            columnNumber: 8
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/settings/page.tsx",
        lineNumber: 438,
        columnNumber: 5
    }, this);
};
_s(page, "IyWYJSZmPOQ025EjfLsvo6LmHmg=");
const __TURBOPACK__default__export__ = page;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_settings_page_tsx_4a08e495._.js.map