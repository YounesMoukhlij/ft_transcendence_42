"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "@/app/(protected)/profile/components/profile";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user";
import "@/app/(protected)/profile/style.css";

interface UserProfileProps {
  username?: string; // optional: if missing, can use current user
}

export default function UserProfile({ username }: UserProfileProps) {
  const { user: currentUser } = useUserStore(); // Zustand logged-in user
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const targetUsername = username || currentUser?.username;
    console.log(currentUser.access_token);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.access_token) {
        setError("You must be logged in to view profiles");
        return;
      }
      if (!targetUsername) {
        setError("Username is missing");
        return;
      }

      try {
        const res = await axios.get<User>(
          `http://${process.env.NEXT_PUBLIC_BACKEND_IP}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/getUserStats/${targetUsername}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError(`Failed to load profile for ${targetUsername}`);
      }
    };

    fetchProfile();
  }, [targetUsername, currentUser]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return <Profile user={profile} />;
}
