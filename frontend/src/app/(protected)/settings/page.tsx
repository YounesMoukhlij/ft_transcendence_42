'use client'
import React, { useState, useRef, useEffect } from 'react'
import { User, Shield, HelpCircle} from 'lucide-react'
import { useUserStore } from '../../../store/userStore'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

// helper components
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog'
import TwoFAModal from './components/TwoFAModal'
import ProfileTab from './components/profile/page'
import SecurityTab from './components/security/page'
import HelpTab from './components/help/page'

import Loading from '@/components/loading/page'

// Define the base URL of your backend API
// const process.env.NEXT_PUBLIC_BACK_API = 'http://localhost:4444'
// const defaultProfileImg = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg'

const ProfileSettingsPage = () => {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const hasHydrated = useUserStore((state) => state._hasHydrated)

  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [otpAuthUrl, setOtpAuthUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [activeTab, setActiveTab] = useState('profile')

  const [formData, setFormData] = useState({
    languages: 'en',
    username: '',
    fullname: '',
    email: '',
    bio: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: ''
  })

  // Languages data
  const languages = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'tz', label: 'Tamazight', flag: '🇲🇦' },
    { id: 'fr', label: 'French', flag: '🇫🇷' }
  ]

  const authMethod = user?.auth_method || 0
  const isPasswordAuth = authMethod === 0

  // Load user data on mount
  useEffect(() => {
    if (!hasHydrated) return
    if (!user) {
      router.push('/signIn')
      return
    }

    setFormData({
      languages: user.languages || 'en',
      username: user.username || '',
      fullname: user.fullname || '',
      email: user.email || '',
      bio: user.bio || '',
      newPassword: '',
      confirmPassword: '',
      currentPassword: ''
    })

    setIs2FAEnabled(user.twoFA_enabled || false)
  }, [user, router, hasHydrated])

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <Loading />
      </div>
    )
  }



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
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      if (!formData.username.trim()) {
        toast.error('Username is required')
        setIsLoading(false)
        return
      }
      if (!formData.email.trim()) {
        toast.error('Email is required')
        setIsLoading(false)
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        setIsLoading(false)
        return
      }

      const dataToSave = new FormData()
      dataToSave.append('languages', formData.languages)
      dataToSave.append('username', formData.username)
      dataToSave.append('fullname', formData.fullname)
      dataToSave.append('email', formData.email)
      dataToSave.append('bio', formData.bio)
      if (imageFile) {
        dataToSave.append('profile_image', imageFile, imageFile.name)
      }
      console.log('from env============');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/updateUserInfo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.access_token}`
        },
        body: dataToSave
      })

      const data = await response.json()
      if (!response.ok || data.code === 409 || !data.success) {
        toast.error(data.message || 'Failed to update profile')
        return
      }

      toast.success('Profile updated successfully!')
      const updatedUser = { ...user, ...data.user }
      setUser(updatedUser)
      setPreviewImage(null)
      setImageFile(null)

    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('An unexpected error occurred while updating profile.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)

    if (is2FAEnabled && !formData.currentPassword.trim()) {
      toast.error('Current password is required')
      setIsLoading(false)
      return
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
      if (formData.newPassword.trim() !== '') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/updateUserPassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access_token}`
          },
          body: JSON.stringify({
            current_password: formData.currentPassword,
            new_password: formData.newPassword
          })
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          toast.error(data.message || 'Failed to update password')
          return
        }
        toast.success('Password updated successfully!')
      } else {
        toast.error('No new password entered. Skipping password update.')
      }
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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
    if (is2FAEnabled) {
      // Disable 2FA
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/update2FA`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access_token}`
          },
          body: JSON.stringify({ twofa: false })
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          toast.error(data.message || 'Failed to disable 2FA')
        } else {
          setIs2FAEnabled(false)
          setUser({ ...user, twoFA_enabled: false, twoFA_secret: null })
          toast.success('Two-Factor Authentication disabled.')
        }
      } catch (error) {
        console.error('2FA disable error:', error)
        toast.error('An error occurred while disabling 2FA.')
      } finally {
        setIsLoading(false)
      }
    } else {
      // Enable 2FA (Step 1: Generate)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/2fa/generate`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.access_token}` }
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          toast.error(data.message || 'Failed to generate 2FA secret')
        } else {
          setOtpAuthUrl(data.otpauth)
          setVerificationCode('')
          setShow2FAModal(true)
        }
      } catch (error) {
        console.error('2FA generate error:', error)
        toast.error('An error occurred while setting up 2FA.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleVerify2FA = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`
        },
        body: JSON.stringify({ token: verificationCode })
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        toast.error(data.message || 'Invalid code. Please try again.')
      } else {
        toast.success('Two-Factor Authentication enabled successfully!')
        setIs2FAEnabled(true)
        setUser({ ...user, twoFA_enabled: true })
        setShow2FAModal(false)
        setVerificationCode('')
        setOtpAuthUrl('')
      }
    } catch (error) {
      console.error('2FA verification error:', error)
      toast.error('An error occurred during verification.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/DeleteUserById/${user.id_user}`, {
        method: 'DELETE'
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

  // TabButton component remains here as it controls the parent's state
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

  const getProfileImageUrl = () => {
    if (previewImage) {
      return previewImage
    }
    const currentImg = user.profile_img || process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMG
    if (currentImg && currentImg.startsWith('/uploads/')) {
      return `${process.env.NEXT_PUBLIC_BACK_API}${currentImg}`
    }
    return currentImg
  }

  // --- NEW: Define the tabs object ---
  const tabs: Record<string, React.ReactNode> = {
    profile: (
      <ProfileTab
        user={user}
        formData={formData}
        handleInputChange={handleInputChange}
        languages={languages}
        isPasswordAuth={isPasswordAuth}
        handleImageClick={handleImageClick}
        getProfileImageUrl={getProfileImageUrl}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        handleSaveProfile={handleSaveProfile}
        isLoading={isLoading}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />
    ),
    security: (
      <SecurityTab
        formData={formData}
        handleInputChange={handleInputChange}
        isPasswordAuth={isPasswordAuth}
        authMethod={authMethod}
        is2FAEnabled={is2FAEnabled}
        handleToggle2FA={handleToggle2FA}
        handleSaveSecurity={handleSaveSecurity}
        isLoading={isLoading}
      />
    ),
    help: <HelpTab />
  }

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
          {/* --- DYNAMIC TAB CONTENT --- */}
          {/* This line renders the component associated with the activeTab */}
          {tabs[activeTab]}
        </div>
      </div>

      {/* --- MODALS ARE RENDERED AT THE ROOT LEVEL --- */}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />

      {/* 2FA Setup Modal */}
      <TwoFAModal
        isOpen={show2FAModal}
        onClose={() => {
          setShow2FAModal(false)
          setIsLoading(false) // Stop loading if user cancels
        }}
        onSubmit={handleVerify2FA}
        otpAuthUrl={otpAuthUrl}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ProfileSettingsPage