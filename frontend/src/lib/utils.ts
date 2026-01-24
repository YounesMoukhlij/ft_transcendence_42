"use client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { useRouter } from "next/router"

export const getProfileImageUrl = (currentImg: string) => {

  if (!currentImg) {
    return `${process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE}`;
  }
  if (currentImg && currentImg.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_BACK_API}/api${currentImg}`;
  }
  return currentImg;
};

// added these from merge

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getBackendURL(): string {
  // Check both naming conventions for env vars
  const envHost = process.env.NEXT_PUBLIC_BACKEND_IP || process.env.NEXT_PUBLIC_BACKENDIP;
  const envPort = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_BACKENDPORT;

  let finalHost: string;
  let finalPort: string;


  if (typeof window !== 'undefined') {
    const currentHostname = window.location.hostname;

    if (envHost && envHost.trim() !== '' && envHost !== 'localhost' && envHost !== '127.0.0.1') {
      finalHost = envHost;
    } else {

      finalHost = currentHostname;
    }

    finalPort = envPort || '4444';
  } else {
    finalHost = envHost || 'localhost';
    finalPort = envPort || '4444';
  }

  try {
    const url = `https://${finalHost}:${finalPort}`;
    new URL(url); 

    if (process.env.NODE_ENV === 'development') {
      console.log('[getBackendURL] Backend URL:', url, {
        envHost,
        currentHostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
        finalHost,
        finalPort
      });
    }

    return url;
  } catch {
    console.error('Invalid backend URL configuration:', { host: finalHost, port: finalPort });
    return `https://${finalHost}:${finalPort}`;
  }
}


export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await axios.post(`${getBackendURL()}/api/refreshToken`, {
      refreshToken: refreshToken
    });

    if (response.data?.success && response.data?.accessToken) {
      return response.data.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}


export async function makeAuthenticatedRequest<T>(
  requestFn: (token: string) => Promise<T>,
  user: { access_token?: string; refresh_token?: string } | null,
  setUser: (user: { access_token?: string; refresh_token?: string }) => void
): Promise<T> {
  if (!user?.access_token) {
    throw new Error('No access token available');
  }

  try {
    return await requestFn(user.access_token);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401 && user?.refresh_token) {
      console.log('Token expired, attempting to refresh...');

      const newAccessToken = await refreshAccessToken(user.refresh_token);

      if (newAccessToken) {
        const updatedUser = { ...user, access_token: newAccessToken };
        setUser(updatedUser);

        if (typeof document !== 'undefined') {
          document.cookie = `auth_token=${newAccessToken}; path=/`;
        }

        return await requestFn(newAccessToken);
      } else {
        throw error;
      }
    }
    throw error;
  }
}
export function RedirectToGameLobby({ to }: { to: string }) {
  const router = useRouter();
      router.push(to);
  return null;
}
