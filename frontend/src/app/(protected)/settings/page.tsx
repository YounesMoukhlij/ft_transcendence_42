'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Camera, Save, User, Mail, Lock, Globe, ChevronDown, Shield, HelpCircle } from 'lucide-react'
import { useUserStore } from '../../../store/userStore'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

// Define the base URL of your backend API
const API_URL = 'http://localhost:4444'
const defaultProfileImg = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg'


interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

// This component remains unchanged
const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}: DeleteConfirmationDialogProps) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      

      <div 
        className="relative bg-black rounded-2xl shadow-2xl w-full max-w-md border"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        <div className="px-8 pb-6">
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Delete Account ?
          </h2>
          <p className="text-gray-400 text-center leading-relaxed">
            This action is permanent and cannot be undone. All your data, settings, and content will be permanently deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border border-white hover:bg-gray-500 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border border-red-600 hover:bg-red-500 hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// This component remains unchanged
function SwitchButton({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-end w-full sm:w-auto gap-3">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <span className="text-gray-300 text-sm sm:text-base font-medium">{label}</span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={onChange}
          />
          <div
            className={`w-12 h-7 rounded-full transition-colors duration-300 ${
              checked ? 'bg-blue-400' : 'bg-gray-400'
            }`}
          ></div>
          <div
            className={`absolute top-[2px] left-[2px] w-6 h-6 bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 ${
              checked ? 'translate-x-5 ' : ''
            }`}
          ></div>
        </div>
      </label>
    </div>
  )
}

const ProfileSettingsPage = () => {
 
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser)
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false) 
  const [previewImage, setPreviewImage] = useState(null) // Kept for UI preview
  
  // --- NEW --- State to hold the actual file for upload
  const [imageFile, setImageFile] = useState(null);
  
  const [activeTab, setActiveTab] = useState('profile') 

  const [formData, setFormData] = useState({
    languages: 'en',
    username: '',
    fullname: '',
    email: '',
    bio: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  })
  
  // Languages data (remains unchanged)
  const languages = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'tz', label: 'Tamazight', flag: '🇲🇦' },
    { id: 'fr', label: 'French', flag: '🇫🇷' },
  ]

  
  const authMethod = user?.auth_method || 0 
  const isPasswordAuth = authMethod === 0
  

  // This useEffect remains unchanged
  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.push('/signIn');
      return;
    }

    setFormData({
      languages: user.languages || 'en',
      username: user.username || '',
      fullname: user.fullname || '',
      email: user.email || '',
      bio: user.bio || '',
      newPassword: '',
      confirmPassword: '',
      currentPassword: '',
    })

    setIs2FAEnabled(user.is2FAEnabled || false)

  }, [user, router, hasHydrated])

  
  // Loading state remains unchanged
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    )
  }

  // This function remains unchanged
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageClick = () => fileInputRef.current?.click()

  // --- MODIFIED --- This function now stores the file and sets a preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }
    
    // 1. Store the raw file object for uploading
    setImageFile(file);

    // 2. Create a Base64 preview for the UI
    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result as string) // Cast to string
    reader.readAsDataURL(file)
  }

  // --- MODIFIED --- This function now sends FormData
  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      // Form validation remains the same
      if (!formData.username.trim()) {
        toast.error('Username is required')
        setIsLoading(false) // Added this to stop execution
        return
      }
      if (!formData.email.trim()) {
        toast.error('Email is required')
        setIsLoading(false) // Added this to stop execution
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        setIsLoading(false) // Added this to stop execution
        return
      }
      
      // --- NEW --- Create FormData to send file and text
      const dataToSave = new FormData();
      
      // Append all text-based form fields
      dataToSave.append('languages', formData.languages);
      dataToSave.append('username', formData.username);
      dataToSave.append('fullname', formData.fullname);
      dataToSave.append('email', formData.email);
      dataToSave.append('bio', formData.bio);
      if (imageFile) {
        dataToSave.append('profile_image', imageFile, imageFile.name);
      }

      const token = user.access_token;
      
      const response = await fetch(`${API_URL}/updateUserInfo`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${user.access_token}`
        },

        body: dataToSave,
      })

      const data = await response.json()

      if (!response.ok || data.code === 409 || !data.success) {
        toast.error(data.message || 'Failed to update profile')
        return // Do not proceed on failure
      }

      toast.success('Profile updated successfully!')
      
      // --- MODIFIED --- Update user state from the backend's response
      // The backend now sends back the updated user object
      const updatedUser = {
        ...user,
        ...data.user, // Merge the updated fields (e.g., new profile_img path)
      }
      setUser(updatedUser) 
      
      // Clear the temporary states
      setPreviewImage(null)
      setImageFile(null)

    } catch (error)
    {
      console.error('Profile update error:', error)
      toast.error('An unexpected error occurred while updating profile.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // --- All functions below remain unchanged ---

  const handleSaveSecurity = async () => {
    setIsLoading(true)

    if (is2FAEnabled) {
      if (!formData.currentPassword.trim()) {
        toast.error('Current password is required')
        setIsLoading(false)
        return
      }
    }

    if (isPasswordAuth) {
      if (formData.newPassword.trim() !== '' && formData.currentPassword.trim() === '') {
        toast.error('Current password is required to set a new password')
        setIsLoading(false)
        return
      }
      if (formData.newPassword.trim() !== '') {
        if (formData.newPassword.length < 8) {
          toast.error('New password must be at least 8 characters long')
          setIsLoading(false)
          return
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New password and confirmation do not match')
          setIsLoading(false)
          return
        }
      }
    }

    try {
      const response = await fetch(`${API_URL}/updateUserPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' 
          , Authorization: `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      })
      
      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to update security settings')
        return
      }

      toast.success('Password  updated successfully!')

      setUser({ ...user })

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))

    } catch (error) {
      console.error('Security update error:', error)
      toast.error('An unexpected error occurred while updating security settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsLoading(true)
    const twofavalue = !is2FAEnabled ? 1 : 0;
    console.log('Toggling 2FA, current state:', twofavalue);
    try {
      const response = await fetch(`${API_URL}/update2FA`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 
          Authorization: `Bearer ${user.access_token}`},
        body: JSON.stringify({
          twofa: twofavalue,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to update 2FA settings')
        return
      }

      setIs2FAEnabled(!is2FAEnabled)
      setUser({ ...user, is2FAEnabled: !is2FAEnabled })
      toast.success(`Two-Factor Authentication ${!is2FAEnabled ? 'enabled' : 'disabled'} successfully!`)
      // set a timeout to clear the message after 3 seconds
      

    } catch (error) {
      console.error('2FA update error:', error)
      toast.error('An unexpected error occurred while updating 2FA settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    
    try {
      const response = await fetch(`${API_URL}/DeleteUserById/${user.id_user}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Failed to delete account')
        return
      }

      toast.success('Account deleted successfully!')
      setUser(null)
      setIsDeleteDialogOpen(false)

      router.push('/signIn')
    } catch (error) {
      console.error('Account deletion error:', error)
      toast.error('An unexpected error occurred while deleting the account')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const TabButton = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-center gap-3  py-3 rounded-xl font-medium  w-1/4 hover:cursor-pointer ${
        activeTab === tab
          ? 'bg-white text-black'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )

  // --- NEW --- Helper function to determine the correct image URL
  const getProfileImageUrl = () => {
    // 1. If there's a local preview (Base64), show it first
    if (previewImage) {
      return previewImage;
    }
    
    // Get the current image path from the user state or use default
    const currentImg = user.profile_img || defaultProfileImg;

    // 2. If the path is from our DB (e.g., /uploads/...), prefix with API_URL
    if (currentImg && currentImg.startsWith('/uploads/')) {
      // e.g., http://localhost:4444/uploads/12345.png
      return `${API_URL}${currentImg}`; 
    }
    
    // 3. Otherwise, it's a full URL (default or from OAuth), use it directly
    return currentImg;
  }
  // --- END NEW ---

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage your profile and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 ">
          <TabButton tab="profile" icon={User} label="Profile" />
          <TabButton tab="security" icon={Shield} label="Security" />
          <TabButton tab="help" icon={HelpCircle} label="Help" />
        </div>

        {/* Profile Card */}
        <div className="border border-gray-700 rounded-2xl shadow-lg bg-black">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <>
              {/* Profile Image */}
              <div className="flex flex-col items-center py-8 border-b border-gray-700 relative">
                <div
                  onClick={handleImageClick}
                  className="relative cursor-pointer group"
                >
                  <img
                    // --- MODIFIED --- Use the helper function to get the correct src
                    src={getProfileImageUrl()}
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

              {/* Profile Form (This section remains unchanged) */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language Selector */}
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
                {/* Email (Combined and Conditional) */}
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
                  <label className="text-gray-400 text-sm mb-1 block">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white resize-none overflow-hidden"
                  />
                </div>
              </div>

              {/* Save Button for Profile (This section remains unchanged) */}
              <div className="flex justify-around p-3 sm:p-8 border-t border-gray-700">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition hover:cursor-pointer ${
                    isLoading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'border border-white hover:bg-gray-500 hover:text-white '
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isLoading}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition hover:cursor-pointer ${
                    isLoading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'border border-red-600 text-white hover:bg-red-500 '
                  }`}
                >
                  Delete Account
                </button>
              </div>
            </>
          )}

          {/* SECURITY TAB (This section remains unchanged) */}
          {activeTab === 'security' && (
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
                <p className="text-gray-500">Manage your password and security preferences</p>
              </div>

              {/* OAuth Info Message */}
              {!isPasswordAuth && (
                <div className='mb-6 p-4 bg-black border-2 border-gray-400 rounded-xl'>
                  <p className='text-sm text-gray-500 flex items-start gap-2'>
                    <Lock size={16} className='mt-0.5 flex-shrink-0' />
                    <span>
                      You signed in with <strong className='text-white'>{authMethod === 1 ? 'Google' : '42'}</strong>. Password management is not available for OAuth accounts.
                    </span>
                  </p>
                </div>
              )}

              {/* Password Fields and 2FA Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Password Fields */}
                {isPasswordAuth && (
                  <>
                    {/* Current Password */}
                    <div className="md:col-span-2">
                      <label htmlFor="currentPassword" className='flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2'>
                        <Lock size={16} />
                        Current Password
                      </label>
                      <input 
                        type="password" 
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className='w-full p-3 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm hover:border-white placeholder-gray-500'
                        placeholder="Enter current password"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className='flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2'>
                        <Lock size={16} />
                        New Password (optional)
                      </label>
                      <input 
                        type="password" 
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className='w-full p-3 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm hover:border-white placeholder-gray-500'
                        placeholder="Enter new password"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className='flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2'>
                        <Lock size={16} />
                        Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className='w-full p-3 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm hover:border-white placeholder-gray-500'
                        placeholder="Confirm new password"
                      />
                    </div>
                  </>
                )}
                
                {/* Security Preferences Section */}
                <div className="mt-8 pt-6 border-t border-gray-700 w-full md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Security Preferences</h3>
                  
                  {/* 2FA Toggle */}
                  <div className={`flex items-center justify-between p-2 border border-gray-500 rounded-xl ${!isPasswordAuth ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <SwitchButton
                      label={is2FAEnabled ? 'Enabled' : 'Disabled'}
                      checked={is2FAEnabled}
                     onChange={() => isPasswordAuth && handleToggle2FA()}
                    />
                  </div>
                  
                  {/* Message for OAuth users */}
                  {!isPasswordAuth && (
                    <p className="text-sm text-gray-400 mt-2">
                      Two-Factor Authentication settings are managed through your external provider ({authMethod === 1 ? 'Google' : '42'}) or are disabled for OAuth accounts.
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button for Security */}
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-700">
                <button
                  onClick={handleSaveSecurity}
                  disabled={isLoading || !isPasswordAuth} 
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition ${
                    (isLoading || !isPasswordAuth)
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-white text-black hover:bg-gray-500 hover:text-white  hover:cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Update Security Settings'}
                </button>
              </div>
            </div>
          )}

          {/* HELP TAB (This section remains unchanged) */}
          {activeTab === 'help' && (
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Help & Support</h2>
                <p className="text-gray-500">Get help with your account and application</p>
              </div>

              <div className="space-y-6">
                {/* FAQ Section */}
                <div className="bg-black rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle size={20} />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-white mb-2">How do I reset my password?</p>
                      <p className="text-gray-400 text-sm">
                        Go to the Security tab and use the password reset form. You'll need to provide your current password and set a new one.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-white mb-2">What is Two-Factor Authentication?</p>
                      <p className="text-gray-400 text-sm">
                        2FA adds an extra layer of security by requiring a verification code from your mobile device when signing in.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-white mb-2">Can I change my username?</p>
                      <p className="text-gray-400 text-sm">
                        Yes, you can change your username in the Profile tab. Note that your old username may become available for others.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-black rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
                  <p className="text-gray-400 mb-4">
                    If you need further assistance, please contact our support team:
                  </p>
                  <div className="space-y-2">
                    <p className="text-white">📧 Email: support@ponggame.com</p>
                    <p className="text-white">🕒 Response Time: 24-48 hours</p>
                  </div>
                </div>

                {/* Application Info */}
                <div className="bg-black rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Application Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Version</p>
                      <p className="text-white">1.0.0</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white">November 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog (This component remains unchanged) */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />
    </div>
  )
}

export default ProfileSettingsPage