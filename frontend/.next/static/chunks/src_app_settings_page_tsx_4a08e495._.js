(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/settings/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 'use client'
// import React, { useState } from 'react'
// import { Camera } from 'lucide-react'
// const ProfileSettingsPage = () => {
//   const [user, setUser] = useState({
//     idUser: 1,
//     username: 'li kwak',
//     email: 'likwak@9alwa.com',
//     password: '',
//     confirmPassword: '',
//     bio: 'Li 3waj ngado zaml boh',
//     profile: 'avatar'
//   });
//   const handleSaveChanges = () => {
//     // Add your save logic here
//     console.log('Saving user data:', user);
//   };
//   return (
//     <div className='p-4 w-full h-full flex flex-col gap-4 justify-center items-center'>
//       <div className='w-full max-w-2xl p-6 bg-gray-400 rounded-lg shadow-md flex flex-col items-center'>
//         <div className='text-center'>
//           <h1 className='text-4xl font-bold text-black'>Settings</h1>
//           <p className='text-black'>Manage your account settings here.</p>
//         </div>
//         <div className='flex flex-col gap-2 bg-red-500 rounded-md w-1/2'>
//         <div className=''>
//           {/* Clickable Avatar with Camera Overlay */}
//           <div 
//             className='relative w-24 h-24 mb-4 cursor-pointer'
//             // onClick={}
//           >
//             <img 
//               src={user.profile} 
//               alt="Profile" 
//               className='w-24 h-24 rounded-full object-cover border-2 group-hover:opacity-75 transition-opacity duration-200'
//             />
//             {/* Camera Overlay */}
//             <div className='absolute inset-0 flex items-center justify-center bg-opacity-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
//               <input type="file" className="absolute inset-0 rounded-full opacity-0" />
//               <Camera size={24} className='text-black' />
//             </div>
//           </div>
//         </div>
//           <label htmlFor="username" className='block text-sm font-medium text-black'>Username</label>
//           <input 
//             type="text" 
//             id="username" 
//             className='mt-1 p-2 w-full border rounded-md text-black'
//             value={user.username}
//             onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
//           />
//           <label htmlFor="email" className='block text-sm font-medium text-black'>Email</label>
//           <input 
//             type="email" 
//             id="email" 
//             className='mt-1 p-2 w-full border rounded-md text-black'
//             value={user.email}
//             onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
//           />
//           <label htmlFor="bio" className='block text-sm font-medium text-black'>Bio</label>
//           <textarea
//             id="bio"
//             className='mt-1 p-2 w-full border rounded-md text-black'
//             value={user.bio}
//             onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
//           />
//           <label htmlFor="password" className='block text-sm font-medium text-black'>Password</label>
//           <input 
//             type="password" 
//             id="password" 
//             className='mt-1 p-2 w-full border rounded-md text-black'
//             value={user.password}
//             onChange={(e) => setUser(prev => ({ ...prev, password: e.target.value }))}
//           />
//           <label htmlFor="confirm-password" className='block text-sm font-medium text-black'>Confirm Password</label>
//           <input 
//             type="password" 
//             id="confirm-password" 
//             className='mt-1 p-2 w-full border rounded-md text-black'
//             value={user.confirmPassword}
//             onChange={(e) => setUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
//           />
//         </div>
//         <div className='mt-6 text-center'>
//           <button 
//           className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800'
//           onClick={handleSaveChanges}
//           >Save Changes</button>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default ProfileSettingsPage
__turbopack_context__.s({
    "default": (()=>ProfileSettingsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function LanguageSelect({ value, onChange }) {
    const languages = [
        {
            id: 'en',
            label: 'English',
            flag: '🇬🇧'
        },
        {
            id: 'es',
            label: 'Spanish',
            flag: '🇪🇸'
        },
        {
            id: 'tz',
            label: 'Tamazight',
            flag: 'ⵣ'
        },
        {
            id: 'fr',
            label: 'French',
            flag: '🇫🇷'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        value: value,
        onChange: (e)=>onChange(e.target.value),
        className: "w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-600",
        children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: lang.id,
                children: [
                    lang.flag,
                    " ",
                    lang.label
                ]
            }, lang.id, true, {
                fileName: "[project]/src/app/settings/page.tsx",
                lineNumber: 147,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/app/settings/page.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_c = LanguageSelect;
function ProfileSettingsPage() {
    const initialUser = {
        id_user: 15,
        username: "test",
        fullname: null,
        bio: null,
        profile_img: "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg",
        email: "tes@mail.m",
        langue: "en",
        auth_method: 0
    } // const [user, setUser] = useState<UserData>(initialUser)
     // const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' })
     // const [previewImage, setPreviewImage] = useState<string>(user.profile_img)
     // const [imageFile, setImageFile] = useState<File | null>(null)
     // const [isLoading, setIsLoading] = useState(false)
     // const fileInputRef = useRef<HTMLInputElement>(null)
     // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     //   const file = e.target.files?.[0]
     //   if (file) {
     //     if (file.size > 5 * 1024 * 1024) {
     //       alert('Image size should be less than 5MB')
     //       return
     //     }
     //     setImageFile(file)
     //     const reader = new FileReader()
     //     reader.onloadend = () => {
     //       setPreviewImage(reader.result as string)
     //     }
     //     reader.readAsDataURL(file)
     //   }
     // }
     // const handleAvatarClick = () => {
     //   fileInputRef.current?.click()
     // }
     // const handleSaveChanges = async () => {
     //   setIsLoading(true)
     //   if (passwords.password && passwords.password !== passwords.confirmPassword) {
     //     alert('Passwords do not match')
     //     setIsLoading(false)
     //     return
     //   }
     //   try {
     //     if (imageFile) {
     //       const formData = new FormData()
     //       formData.append('profile_img', imageFile)
     //       console.log('Uploading image:', imageFile.name)
     //     }
     //     const updateData = {
     //       ...user,
     //       ...(passwords.password && { password: passwords.password })
     //     }
     //     console.log('Saving user data:', updateData)
     //     alert('Changes saved successfully!')
     //   } catch (error) {
     //     console.error('Error saving changes:', error)
     //     alert('Failed to save changes')
     //   } finally {
     //     setIsLoading(false)
     //   }
     // }
     // const isPasswordAuth = user.auth_method === 0
     //   return (
     //   <div className="min-h-screen w-full bg-white p-6 text-gray-900">
     //     <div className="max-w-4xl mx-auto">
     //       {/* Header */}
     //       <div className="text-center mb-8">
     //         <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
     //         <p className="text-gray-600">Manage your profile and preferences</p>
     //       </div>
     //       {/* Main Card */}
     //       <div className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
     //         {/* Profile Image Section */}
     //         <div className="bg-white p-8 flex justify-center">
     //           <div
     //             className="relative cursor-pointer top bottom"
     //             // onClick={handleAvatarClick}
     //             style={{ width: 128, height: 128 }}
     //           >
     //             <img
     //               // src={previewImage}
     //               alt="Profile"
     //               className="w-full h-full rounded-full object-cover border-4 border-gray-900 shadow-lg"
     //             />
     //             <input
     //               // ref={fileInputRef}
     //               type="file"
     //               accept="image/*"
     //               // onChange={handleImageChange}
     //               className="hidden"
     //             />
     //           </div>
     //         </div>
     //         {/* Form Section */}
     //         <div className="p-8 space-y-6">
     //           {/* Language Select */}
     //           <div>
     //             <label className="block mb-1 font-semibold flex items-center gap-2">
     //               <Globe size={18} /> Preferred Language
     //             </label>
     //             <select
     //               className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
     //             >
     //               {[
     //                 { id: "en", label: "English", flag: "🇬🇧" },
     //                 { id: "es", label: "Spanish", flag: "🇪🇸" },
     //                 { id: "tz", label: "Tamazight", flag: "ⵣ" },
     //                 { id: "fr", label: "French", flag: "🇫🇷" },
     //               ].map((lang) => (
     //                 <option key={lang.id} value={lang.id}>
     //                   {lang.flag} {lang.label}
     //                 </option>
     //               ))}
     //             </select>
     //           </div>
     //           {/* Username */}
     //           <div>
     //             <label className="block mb-1 font-semibold flex items-center gap-2">
     //               <User size={18} /> Username
     //             </label>
     //             <input
     //               type="text"
     //               value={user.username}
     //               onChange={(e) =>
     //                 setUser((prev) => ({ ...prev, username: e.target.value }))
     //               }
     //               className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
     //             />
     //           </div>
     //           {/* Full Name */}
     //           <div>
     //             <label className="block mb-1 font-semibold flex items-center gap-2">
     //               <User size={18} /> Full Name
     //             </label>
     //             <input
     //               type="text"
     //               value={user.fullname || ""}
     //               onChange={(e) =>
     //                 setUser((prev) => ({ ...prev, fullname: e.target.value }))
     //               }
     //               placeholder="Enter your full name"
     //               className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
     //             />
     //           </div>
     //           {/* Email */}
     //           <div>
     //             <label className="block mb-1 font-semibold flex items-center gap-2">
     //               <Mail size={18} /> Email Address
     //             </label>
     //             <input
     //               type="email"
     //               value={user.email}
     //               onChange={(e) =>
     //                 setUser((prev) => ({ ...prev, email: e.target.value }))
     //               }
     //               className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
     //             />
     //           </div>
     //           {/* Bio */}
     //           <div>
     //             <label className="block mb-1 font-semibold flex items-center gap-2">
     //               <FileText size={18} /> Bio
     //             </label>
     //             <textarea
     //               rows={4}
     //               value={user.bio || ""}
     //               onChange={(e) =>
     //                 setUser((prev) => ({ ...prev, bio: e.target.value }))
     //               }
     //               placeholder="Tell us about yourself..."
     //               className="w-full p-3 border border-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-800"
     //             />
     //           </div>
     //           {/* Password (only if password auth) */}
     //           {user.auth_method === 0 ? (
     //             <>
     //               <div>
     //                 <label className="block mb-1 font-semibold flex items-center gap-2">
     //                   <Lock size={18} /> New Password
     //                 </label>
     //                 <input
     //                   type="password"
     //                   value={passwords.password}
     //                   onChange={(e) =>
     //                     setPasswords((prev) => ({ ...prev, password: e.target.value }))
     //                   }
     //                   placeholder="Leave blank to keep current"
     //                   className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
     //                 />
     //               </div>
     //               <div>
     //                 <label className="block mb-1 font-semibold flex items-center gap-2">
     //                   <Lock size={18} /> Confirm Password
     //                 </label>
     //                 <input
     //                   type="password"
     //                   value={passwords.confirmPassword}
     //                   onChange={(e) =>
     //                     setPasswords((prev) => ({
     //                       ...prev,
     //                       confirmPassword: e.target.value,
     //                     }))
     //                   }
     //                   placeholder="Confirm new password"
     //                   className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
     //                 />
     //               </div>
     //             </>
     //           ) : (
     //             <div className="p-4 bg-gray-100 text-gray-700 rounded-md text-sm">
     //               <strong>Note:</strong> You're signed in with OAuth. Password changes
     //               are not available.
     //             </div>
     //           )}
     //           {/* Buttons */}
     //           <div className="flex justify-end gap-4 mt-6">
     //             <button
     //               onClick={() => {
     //                 setUser(initialUser)
     //                 setPasswords({ password: "", confirmPassword: "" })
     //                 setPreviewImage(initialUser.profile_img)
     //                 setImageFile(null)
     //               }}
     //               disabled={isLoading}
     //               className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
     //             >
     //               Reset
     //             </button>
     //             <button
     //               onClick={handleSaveChanges}
     //               disabled={isLoading}
     //               className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 disabled:opacity-50 flex items-center gap-2"
     //             >
     //               {isLoading ? (
     //                 <>
     //                   <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
     //                   Saving...
     //                 </>
     //               ) : (
     //                 <>
     //                   <Save size={18} />
     //                   Save Changes
     //                 </>
     //               )}
     //             </button>
     //           </div>
     //         </div>
     //       </div>
     //     </div>
     //   </div>
     // )
     // }
    ;
}
_c1 = ProfileSettingsPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "LanguageSelect");
__turbopack_context__.k.register(_c1, "ProfileSettingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_settings_page_tsx_4a08e495._.js.map