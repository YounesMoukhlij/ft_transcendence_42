"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"
import { Profile } from "@/app/(protected)/profile/components/profile";
import { User } from "@/types/user";
import "@/app/(protected)/profile/style.css";
import { useUserStore } from "@/store/userStore";
import Loading from "@/components/Loading/page";

export default function UserProfile() {
  const { user: currentUser} = useUserStore();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {


    if (!currentUser?.access_token) return;

    const fetchUserData = async () => {
      try {
        const res = await api.get(
          `/api/getUserStats/${currentUser.id_user}`,
          { headers: { Authorization: `Bearer ${currentUser.access_token}` } }
        );

        if (res.status === 200) setProfile(res.data);
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [currentUser]);


  if (!currentUser) return <Loading/>;
  
  if (!profile) return null; 

  return <Profile user={profile} />;
}


