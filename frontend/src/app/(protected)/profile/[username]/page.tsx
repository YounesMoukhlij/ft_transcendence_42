"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "@/app/(protected)/profile/components/profile";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user";
import "@/app/(protected)/profile/style.css";

interface UserProfileProps {
  params: Promise<{ username: string }>;
}

export default function UserProfile({ params }: UserProfileProps) {
  const { username } = use(params);
  const { user: currentUser, addSentRequestsArray, setFriends } = useUserStore();

  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {

    if (!currentUser?.access_token) return;     // still no user → skip
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get<User>(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getUserStats/${username}`,
          {
            headers: { Authorization: `Bearer ${currentUser.access_token}` },
          }
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
      try {
         const res = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/getSentRequests`,
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
        const res = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/GetFriends`, {
          params: { username: currentUser.username },
          headers: { Authorization: `Bearer ${currentUser.access_token}` }
        }
          
      );

        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [username, currentUser]);

  // --- RENDER PROTECTION ---

  if (!currentUser) return null;         // no logged-in user yet
  if (!profile) return null;             // waiting for axios

  return <Profile user={profile} />;
}
