
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "@/app/(protected)/profile/components/profile";
import { User } from "@/types/user";
import "@/app/(protected)/profile/style.css";
import { useUserStore } from "@/store/userStore";

export default function UserProfile() {
  const { user } = useUserStore(); // get Zustand user state
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log(user?.access_token);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.access_token) {
        setError("User token is missing. Please log in.");
        return;
      }

      try {
        const url = `http://${process.env.NEXT_PUBLIC_BACKEND_IP}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/getUserStats`;

        const res = await axios.get<User>(url, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [user]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return <Profile user={profile} />;
}


