"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/api";
import { Profile } from "@/app/(protected)/profile/components/profile";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user";
import "@/app/(protected)/profile/style.css";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/page";

interface UserProfileProps {
  params: Promise<{ username: string }>;
}

export default function UserProfile({ params }: UserProfileProps) {
  const { username } = use(params);

  const { user: currentUser, addSentRequestsArray, setFriends } = useUserStore();
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser?.access_token) return; // still no user → skip
    if (!username) return;

    let active = true;
    // setLoading(true);

    const fetchProfile = async () => {
      try {
        const res = await api.get<User>(`/getUserStats/${username}`,{
          headers: { Authorization: `Bearer ${currentUser.access_token}` },
        });
        if (!active) return;
        setProfile(res.data);
        
      } catch (err) {
        console.error("Error loading profile:", err);
        if ((err).response?.status === 404) {
          router.replace('/not-found');
          return; 
        }
      }
      try {
         const res = await api.get(
          `/getSentRequests`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        addSentRequestsArray(res.data.filter(object => object.title == "request friend"));
      }
      catch (err)
      {
        console.error("Error loading profile:", err);
      }

     
      try {
        const res = await api.get(`/GetFriends`, {
          params: { username: currentUser.username },
          headers: { Authorization: `Bearer ${currentUser.access_token}` }
        }
          
      );
        if (!active) return;
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
    return () => { active = false; };
  }, [username, currentUser]);

  // --- RENDER PROTECTION ---

  // if (!currentUser || loading) return <Loading />; // waiting for user or data
  if (!profile) return <Loading />; // safety fallback while axios resolves

  return <Profile user={profile} />;
}
