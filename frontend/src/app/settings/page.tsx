'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Camera, Save, User, Mail, Lock, Globe, ChevronDown, Shield, HelpCircle } from 'lucide-react'
import { useUserStore } from '../../store/userStore'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
// Removed: import { shallow } from 'zustand/shallow'

const API_URL = 'http://localhost:4444'
const defaultProfileImg = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg'

// --- SwitchButton Component (No changes needed) ---
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
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false) 
  const [previewImage, setPreviewImage] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  const [formData, setFormData] = useState({
    languages: 'en',
    username: '',
    full_name: '',
    email: '',
    bio: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  })
  
  // Languages data
  const languages = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'tz', label: 'Tamazight', flag: 'ⵣ' },
    { id: 'fr', label: 'French', flag: '🇫🇷' },
  ]

  // Conditional logic based on real user data
  const authMethod = user?.auth_method || 0 
  const isPasswordAuth = authMethod === 0
  
  // --- Data Initialization and Redirect Logic ---
  useEffect(() => {
    if (!hasHydrated) return; // Wait for Zustand to hydrate
    // 1. Redirection Check: If user is null, redirect.
    if (!user) {
      toast.error('You must be logged in to view settings.');
      router.push('/signIn');
      return; // Stop execution if redirecting
    }

    // 2. Initialize form data with real user state
    setFormData({
      languages: user.languages || 'en',
      username: user.username || '',
      full_name: user.full_name || '',
      email: user.email || '',
      bio: user.bio || '',
      newPassword: '',
      confirmPassword: '',
      currentPassword: '',
    })

    // 3. Initialize 2FA state from user object
    setIs2FAEnabled(user.is2FAEnabled || false)

  }, [user, router, hasHydrated])

  // Prevent rendering the content if user is null (will show "Loading..." until state is hydrated/redirected)
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    )
  }
  // --- End of Initialization ---

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageClick = () => fileInputRef.current?.click()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    
    // Use the preview image if available, otherwise the current user's image, or default.
    const imageToSave = previewImage || user.profile_img || defaultProfileImg

    try {
      // Basic validation
      if (!formData.username.trim()) {
        toast.error('Username is required')
        return
      }
      if (!formData.email.trim()) {
        toast.error('Email is required')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        return
      }

      // API call to update profile
      const response = await fetch(`${API_URL}/updateUserInfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user, // Use real user ID
          profile_img: imageToSave,
          languages: formData.languages,
          username: formData.username,
          full_name: formData.full_name,
          email: formData.email,
          bio: formData.bio,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.code === 409 || !data.success) {
        toast.error(data.message || 'Failed to update profile')
        return
      }

      toast.success('Profile updated successfully!')
      
      // Update user store (Zustand)
      const updatedUser = {
        ...user,
        profile_img: imageToSave,
        languages: formData.languages,
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        bio: formData.bio,
      }
      setUser(updatedUser) 
      
      // Clear preview image after successful save
      setPreviewImage(null)

    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('An unexpected error occurred while updating profile.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    
    if (isPasswordAuth) {
      // Only validate password fields if password auth is used
      if (!formData.currentPassword.trim()) {
        toast.error('Current password is required')
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
      // API call to update security settings
      const response = await fetch(`${API_URL}/updateUserSecurity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user, // Use real user ID
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          is2FAEnabled: is2FAEnabled, // Pass 2FA state
        }),
      })
      
      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to update security settings')
        return
      }
      
      toast.success('Security settings updated successfully!')
      
      // Update 2FA state in the store if API call was successful
      setUser({ ...user, is2FAEnabled: is2FAEnabled })

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

  // Tab navigation component (No changes needed)
  const TabButton = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        activeTab === tab
          ? 'bg-white text-black'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )

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
        <div className="flex flex-wrap gap-2 mb-6">
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
                    // Bound to user state
                    src={previewImage || user.profile_img || defaultProfileImg}
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

              {/* Profile Form */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language Selector */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 pr-10 text-sm sm:text-base text-white focus:border-white focus:ring-2 focus:ring-white appearance-none"
                        >
                          {languages.map((lang) => (
                            <option
                              key={lang.id}
                              value={lang.id}
                              className="bg-black text-white"
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
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm mb-1 block">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white focus:border-white resize-none"
                  />
                </div>
              </div>

              {/* Save Button for Profile */}
              <div className="flex justify-end p-6 sm:p-8 border-t border-gray-700">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition ${
                    isLoading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-white text-black hover:bg-gray-500 hover:text-white active:scale-95'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
                <p className="text-gray-500">Manage your password and security preferences</p>
              </div>

              {/* OAuth Info Message (Visible only for non-password users) */}
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

              {/* Password Fields and 2FA Section (Conditional visibility based on isPasswordAuth) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Password Fields - Only show if password auth */}
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
                  
                  {/* 2FA Toggle - Only functional if isPasswordAuth is true */}
                  <div className={`flex items-center justify-between p-2 bg-gray-900 rounded-xl ${!isPasswordAuth ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                      onChange={() => isPasswordAuth && setIs2FAEnabled(!is2FAEnabled)} // 👈 Disable onChange for OAuth
                    />
                  </div>
                  
                  {/* Message for OAuth users if 2FA is not available for them */}
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
                  // Disable button if loading OR if it's an OAuth account
                  disabled={isLoading || !isPasswordAuth} 
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition ${
                    (isLoading || !isPasswordAuth)
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-white text-black hover:bg-gray-500 hover:text-white active:scale-95 hover:cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Update Security Settings'}
                </button>
              </div>
            </div>
          )}

          {/* HELP TAB (No changes needed) */}
          {activeTab === 'help' && (
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Help & Support</h2>
                <p className="text-gray-500">Get help with your account and application</p>
              </div>

              <div className="space-y-6">
                {/* FAQ Section */}
                <div className="bg-gray-900 rounded-xl p-6">
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
                <div className="bg-gray-900 rounded-xl p-6">
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
                <div className="bg-gray-900 rounded-xl p-6">
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
    </div>
  )
}

export default ProfileSettingsPage