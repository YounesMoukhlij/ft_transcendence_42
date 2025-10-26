"use client"
import { Profile } from "@/app/(protected)/profile/components/profile"
import axios from "axios"
import { User } from "@/types/user"
import "@/app/(protected)/profile/style.css"
import {useUserStore} from "@/store/userStore"

interface UserProfilePageProps {
  params: { username: string }
}

export default async function UserProfile() {
  const { user } = useUserStore.getState();
  const context_username = user.username;
   try {
      if (!context_username) throw new Error("Username param is missing")
      const url = `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getUserStats/${context_username}`

      const res = await axios.get<User>(url)
      const user = res.data
      
      return <Profile user={user} />
    } 
  catch (err) {
    console.error("Error fetching user data:", err)
    return <div>User not found or failed to load 
      {context_username} not found
    </div>
  }
}


