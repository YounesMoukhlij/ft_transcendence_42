import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getProfileImageUrl = (currentImg: string) => {
  if (!currentImg) {
    console.log("No profile image found, using default.");
    return `${process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE}`;
  }
  if (currentImg && currentImg.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_BACK_API}${currentImg}`;
  }
  return currentImg;
};