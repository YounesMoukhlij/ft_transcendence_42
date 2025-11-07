module.exports = [
"[project]/frontend/.next-internal/server/app/(protected)/profile/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/frontend/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/src/app/(protected)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/(protected)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/src/app/(protected)/profile/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// "use client"
// import { Profile } from "@/app/(protected)/profile/components/profile"
// import axios from "axios"
// import { User } from "@/types/user"
// import "@/app/(protected)/profile/style.css"
// import {useUserStore} from "@/store/userStore"
// interface UserProfilePageProps {
//   params: { username: string }
// }
// export default async function UserProfile() {
//   const { user } = useUserStore.getState();
//   const context_username = user.username;
//    try {
//       if (!context_username) throw new Error("Username param is missing")
//       const url = `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getUserStats/${context_username}`
//       const res = await axios.get<User>(url)
//       const user = res.data
//       return <Profile user={user} />
//     } 
//   catch (err) {
//     console.error("Error fetching user data:", err)
//     return <div>User not found or failed to load 
//       {context_username} not found
//     </div>
//   }
// }
// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Profile } from "@/app/(protected)/profile/components/profile";
// import { User } from "@/types/user";
// import "@/app/(protected)/profile/style.css";
// import { useUserStore } from "@/store/userStore";
// export default function UserProfile() {
//   const { user } = useUserStore(); // get Zustand user state
//   const [profile, setProfile] = useState<User | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   console.log(user);
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.access_token) {
//         setError("User token is missing. Please log in.");
//         return;
//       }
//       try {
//         const url = `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getUserStats`;
//         const res = await axios.get<User>(url, {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         });
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError("Failed to load user data.");
//       }
//     };
//     fetchUserData();
//   }, [user]);
//   if (error) return <div>{error}</div>;
//   if (!profile) return <div>Loading...</div>;
//   return <Profile user={profile} />;
// }
}),
"[project]/frontend/src/app/(protected)/profile/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/(protected)/profile/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b92c6fac._.js.map