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
  params: Promise<{ id: number }>;
}

export default function UserProfile({ params }: UserProfileProps) {
  const { id } = use(params);

  const { user: currentUser, addSentRequestsArray, setFriends } = useUserStore();
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (!currentUser?.access_token) return; 
    if (!id) return;

    let active = true;


    const fetchProfile = async () => {
      try {
        const res = await api.get<User>(`/api/getUserStats/${id}`,{
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
          `/api/getSentRequests`,
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
  }, [id, currentUser]);

  if (!profile) return <Loading />; 

  return <Profile user={profile} />;
}
