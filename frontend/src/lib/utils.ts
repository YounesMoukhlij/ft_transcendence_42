import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the backend API base URL with fallbacks
 * Handles both NEXT_PUBLIC_BACKEND_IP/PORT and NEXT_PUBLIC_BACKENDIP/PORT naming conventions
 *
 * Smart detection:
 * - If accessed from network IP, automatically uses that IP for backend
 * - If env var is set and not localhost, uses env var
 * - Falls back to window.location.hostname (runtime detection)
 * - Last resort: localhost
 */
export function getBackendURL(): string {
  // Check both naming conventions for env vars
  const envHost = process.env.NEXT_PUBLIC_BACKEND_IP || process.env.NEXT_PUBLIC_BACKENDIP;
  const envPort = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_BACKENDPORT;

  let finalHost: string;
  let finalPort: string;

  // Runtime detection: use window.location.hostname when available
  // This ensures network access works automatically
  if (typeof window !== 'undefined') {
    const currentHostname = window.location.hostname;

    // Priority:
    // 1. If env var is explicitly set and is not localhost, use it
    // 2. Otherwise, use the current hostname (works for network access)
    //    This is smart: if accessing from 192.168.1.100:3000,
    //    backend will be at 192.168.1.100:4444
    if (envHost && envHost.trim() !== '' && envHost !== 'localhost' && envHost !== '127.0.0.1') {
      finalHost = envHost;
    } else {
      // Use the hostname from the current URL (runtime detection)
      // This automatically works for network access
      finalHost = currentHostname;
    }

    finalPort = envPort || '4444';
  } else {
    // Server-side rendering: use env vars or defaults
    finalHost = envHost || 'localhost';
    finalPort = envPort || '4444';
  }

  // Build and validate URL
  try {
    const url = `http://${finalHost}:${finalPort}`;
    new URL(url); // This will throw if invalid

    // Log the backend URL in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[getBackendURL] Backend URL:', url, {
        envHost,
        currentHostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
        finalHost,
        finalPort
      });
    }

    return url;
  } catch (error) {
    console.error('Invalid backend URL configuration:', { host: finalHost, port: finalPort });
    // Still return a valid URL even if validation fails
    return `http://${finalHost}:${finalPort}`;
  }
}
