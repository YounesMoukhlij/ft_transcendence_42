// settings/components/profile/page.tsx
'use client'
import React from 'react'
import { Camera, Globe, ChevronDown } from 'lucide-react'
import {getProfileImageUrl} from "@/lib/utils"


interface UserProfile {
  profile_img: string;
  username: string;
  email: string;
  bio?: string;
  languages?: string;
}

interface ProfileFormData {
  username: string;
  email: string;
  bio: string;
  language: string;
  languages: string;
  fullname: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ProfileTabProps {
  user: UserProfile
  formData: ProfileFormData 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  languages: { id: string; label: string; flag: string }[]
  isPasswordAuth: boolean;
  handleImageClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSaveProfile: () => void
  isLoading: boolean
  setIsDeleteDialogOpen: (isOpen: boolean) => void
  previewImage: string | null
}


const ProfileTab = ({
  user,
  formData,
  handleInputChange,
  languages,
  isPasswordAuth,
  handleImageClick,
  fileInputRef,
  handleImageChange,
  handleSaveProfile,
  isLoading,
  setIsDeleteDialogOpen,
  previewImage
}: ProfileTabProps) => {
  return (
    <>
      {/* Profile Image */}
      <div className="flex flex-col items-center py-8 border-b border-gray-700 relative">
        <div
          onClick={handleImageClick}
          className="relative cursor-pointer group"
        >
          <img
            src={previewImage || getProfileImageUrl(user.profile_img)}
            alt="Profile"
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-gray-500 object-cover group-hover:brightness-75 transition"
          />
          <div className="absolute inset-0 bg-opacity-60 flex flex-col justify-center items-center rounded-full  group-hover:opacity-100 transition">
            <Camera color='black' size={30} className="absolute  bg-white bottom-0 right-0 p-0.5 rounded-full" />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="languages"
                className="flex items-center gap-2 text-gray-400 text-sm mb-2"
              >
                <Globe size={18} /> Preferred Language
              </label>
              <div className="relative">
                <select
                  id="languages"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 pr-10 text-sm sm:text-base text-white focus:border-white  focus:ring-white appearance-none "
                >
                  {languages.map((lang) => (
                    <option
                      key={lang.id}
                      value={lang.id}
                      className="bg-black text-white hover:bg-gray-800 "
                    >
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username"
            className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white  appearance-none"
          />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="text-gray-400 text-sm mb-1 block">
            {isPasswordAuth ? 'Email' : 'Email (You cannot change your email)'}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            disabled={!isPasswordAuth}
            className={
              isPasswordAuth
                ? 'w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white'
                : 'w-full  border-2 border-gray-600 rounded-xl p-3 text-gray-500 cursor-not-allowed'
            }
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2 scrollbar-hide">
          <span className="flex justify-between items-center mb-1">
            <label className="text-gray-400 text-sm mb-1 block">Bio</label>
              <p className="text-right text-xs text-gray-500">
                {formData.bio ? formData.bio.length : 0} / 200
              </p>
            </span>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white resize-none overflow-hidden"
            maxLength={200}
          />
        </div>
      </div>

      {/* Save Button for Profile */}
      <div className="flex justify-around p-3 sm:p-8 border-t border-gray-700">
        <button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className={`px-2 py-2 w-1/3  rounded-xl font-semibold text-sm sm:text-base transition hover:cursor-pointer ${
            isLoading
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'border border-gray-500 hover:bg-gray-500 hover:text-white'
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Profile Changes'}
        </button>
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isLoading}
          className={`px-4 py-2 w-1/3 rounded-xl font-semibold text-sm sm:text-base transition hover:cursor-pointer ${
            isLoading
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'border border-red-600 text-white hover:bg-red-500'
          }`}
        >
          Delete Account
        </button>
      </div>
    </>
  )
}

export default ProfileTab;