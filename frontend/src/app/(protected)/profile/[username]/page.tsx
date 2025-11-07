import UserProfile from "@/app/(protected)/profile/components/profileWrapper";

interface PageProps {
  params: Promise<{ username: string }>; // dynamic route
}

// Server component
export default async function TheProfile({ params }: PageProps) {
  const { username } = await params; // unwrap the promise
  return <UserProfile username={username} />; // pass to client component
}
