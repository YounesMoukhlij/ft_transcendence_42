import { Profile } from "@/app/(protected)/profile/components/profile"
import "@/app/(protected)/profile/style.css"

interface UserProfilePageProps {
  params: { username: string }
}

export default async function UserProfile({ params }: UserProfilePageProps) {
  try {
    if (!params.username) throw new Error("Username param is missing")

    const url = `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getUserStats/${params.username}`

    const res = await fetch(url);
      if (!res.ok) {
      throw new Error(`Failed to fetch user stats: ${res.status}`);
    }
    const user = await res.json()

    return <Profile user={user} />
  } catch (err) {
    console.error("Error fetching user data:", err)
    // You can return a 404 page or a fallback component
    return <div>User not found or failed to load 
{params.username} not found
    </div>
  }
}
