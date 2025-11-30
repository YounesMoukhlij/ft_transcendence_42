import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the backend API base URL with fallbacks
 * Handles both NEXT_PUBLIC_BACKEND_IP/PORT and NEXT_PUBLIC_BACKENDIP/PORT naming conventions
 */
export function getBackendURL(): string {
  const host = process.env.NEXT_PUBLIC_BACKEND_IP || process.env.NEXT_PUBLIC_BACKENDIP || 'localhost';
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_BACKENDPORT || '4444';

  // Validate that we have valid values
  if (!host || !port) {
    console.warn('Backend URL configuration missing. Using defaults: localhost:4444');
    return 'http://localhost:4444';
  }

  // Validate URL format
  try {
    const url = `http://${host}:${port}`;
    new URL(url); // This will throw if invalid
    return url;
  } catch (error) {
    console.error('Invalid backend URL configuration:', { host, port });
    return 'http://localhost:4444';
  }
}
