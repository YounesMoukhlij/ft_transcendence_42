"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "@/app/(protected)/profile/components/profile";
import { User } from "@/types/user";
import "@/app/(protected)/profile/style.css";
import { useUserStore } from "@/store/userStore";

export default function UserProfile() {
  const { user: currentUser} = useUserStore();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {


    if (!currentUser?.access_token) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getUserStats`,
          { headers: { Authorization: `Bearer ${currentUser.access_token}` } }
        );

        if (res.status === 200) setProfile(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [currentUser]);



  // Not logged in
  if (!currentUser) return <div>Please log in</div>;

  // Waiting for API data
  if (!profile) return null; 

  return <Profile user={profile} />;
}


