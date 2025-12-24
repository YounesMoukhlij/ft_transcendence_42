import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getProfileImageUrl = (currentImg: string) => {

  if (!currentImg) {
    return `${process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE}`;
  }
  if (currentImg && currentImg.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_BACK_API}${currentImg}`;
  }
  return currentImg;
};