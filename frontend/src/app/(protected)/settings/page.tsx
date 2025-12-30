'use client'
import React, { useState, useRef, useEffect } from 'react'
import { User, Shield, HelpCircle, ChevronDown } from 'lucide-react'
import { useUserStore } from '../../../store/userStore'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import axios from 'axios' 
import api from '@/lib/api' 

// Helper components
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog'
import TwoFAModal from './components/TwoFAModal'
import ProfileTab from './components/profile/ProfileTab'
import SecurityTab from './components/security/SecurityTab'
import HelpTab from './components/help/HelpTab'
import Loading from '@/components/Loading/page'

const ProfileSettingsPage = () => {
  const {user} = useUserStore();
  const setUser = useUserStore((state) => state.setUser)
  const hasHydrated = useUserStore((state) => state._hasHydrated)
  
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Profile Image State
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Modal States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  
  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [otpAuthUrl, setOtpAuthUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  // Form Data State
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

  // Static Data
  const tabItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ]

  const languages = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'tz', label: 'Tamazight', flag: '🇲🇦' },
    { id: 'fr', label: 'French', flag: '🇫🇷' }
  ]

  const authMethod = user?.auth_method || 0
  const isPasswordAuth = authMethod === 0

  // --- EFFECTS ---
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

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageClick = () => fileInputRef.current?.click()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // const getProfileImageUrl = () => {
  //   if (previewImage) return previewImage
  //   const currentImg = user.profile_img ;
  //   if (currentImg && currentImg.startsWith('/uploads/')) {
  //     return `${process.env.NEXT_PUBLIC_BACK_API}${currentImg}`
  //   }
  //   return currentImg
  // }

  // 1. SAVE PROFILE (Axios)
  const handleSaveProfile = async () => {
    setIsLoading(true)
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
      if (formData.username.length < 3 || formData.username.length > 20) {
        toast.error('Username must be between 3 and 20 characters')
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

      // Axios automatically sets the Content-Type to multipart/form-data when passed FormData
      const response = await api.post(`${process.env.NEXT_PUBLIC_BACK_API}/api/updateUserInfo`, dataToSave, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      })
      const data = response.data
      if (!data.success) {
        toast.error(data.message || 'Failed to update profile')
        return
      }

      toast.success('Profile updated successfully!')
      // Update global store
      const updatedUser = { ...user, ...data.user }
      setUser(updatedUser)
      
      // Reset image states
      setPreviewImage(null)
      setImageFile(null)

    } catch (error) {
      console.error('Profile update error:', error)
      const msg = error.response?.data?.message || 'An unexpected error occurred while updating profile.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. SAVE SECURITY (Axios)
  const handleSaveSecurity = async () => {
    setIsLoading(true)

    // Validation checks
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_API}/api/updateUserPassword`, 
          {
            current_password: formData.currentPassword,
            new_password: formData.newPassword
          },
          {
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        )

        const data = response.data
        if (!data.success) {
          toast.error(data.message || 'Failed to update password')
          return
        }
        toast.success('Password updated successfully!')
        
        // Reset password fields
        setFormData((prev) => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }))
      } else {
        toast.error('No new password entered. Skipping password update.')
      }
    } catch (error) {
      console.error('Security update error:', error)
      const msg = error.response?.data?.message || 'An unexpected error occurred while updating security settings'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // 3. TOGGLE 2FA (Axios)
  const handleToggle2FA = async () => {
    setIsLoading(true)
    if (is2FAEnabled) {
      // Disable 2FA
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_API}/api/update2FA`, 
          { twofa: false },
          {
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        )

        const data = response.data
        if (!data.success) {
          toast.error(data.message || 'Failed to disable 2FA')
        } else {
          setIs2FAEnabled(false)
          setUser({ ...user, twoFA_enabled: false, twoFA_secret: null })
          toast.success('Two-Factor Authentication disabled.')
        }
      } catch (error) {
        console.error('2FA disable error:', error)
        const msg = error.response?.data?.message || 'An error occurred while disabling 2FA.'
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Enable 2FA (Step 1: Generate)
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_API}/api/2fa/generate`, 
          {}, // Empty body
          {
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        )

        const data = response.data
        if (!data.success) {
          toast.error(data.message || 'Failed to generate 2FA secret')
        } else {
          setOtpAuthUrl(data.otpauth)
          setVerificationCode('')
          setShow2FAModal(true)
        }
      } catch (error) {
        console.error('2FA generate error:', error)
        const msg = error.response?.data?.message || 'An error occurred while setting up 2FA.'
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // 4. VERIFY 2FA (Axios)
  const handleVerify2FA = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_API}/api/2fa/verify`, 
        { token: verificationCode },
        {
          headers: { Authorization: `Bearer ${user.access_token}` }
        }
      )

      const data = response.data
      if (!data.success) {
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
      const msg = error.response?.data?.message || 'An error occurred during verification.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // 5. DELETE ACCOUNT (Axios)
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
     await axios.delete(`${process.env.NEXT_PUBLIC_BACK_API}/api/DeleteAccount`, {
        headers: { Authorization: `Bearer ${user.access_token}` }
      })
      toast.success('Account deleted successfully!')
      setUser(null)
      setIsDeleteDialogOpen(false)
      router.push('/signIn')
    } catch (error) {
      console.error('Account deletion error:', error)
      const msg = error.response?.data?.message || 'An unexpected error occurred while deleting the account'
      toast.error(msg)
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // --- RENDER HELPERS ---
  const activeTabInfo = tabItems.find(t => t.id === activeTab)

  const getButtonStyle = (isActive: boolean) => {
    return isActive
      ? 'bg-white text-black' 
      : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }

  const tabs: Record<string, React.ReactNode> = {
    profile: (
      <ProfileTab
        user={user}
        formData={formData}
        handleInputChange={handleInputChange}
        languages={languages}
        isPasswordAuth={isPasswordAuth}
        handleImageClick={handleImageClick}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        handleSaveProfile={handleSaveProfile}
        isLoading={isLoading}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        previewImage={previewImage}
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

  // Loading Screen if no user data
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className=" w-full bg-black text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your profile and preferences</p>
        </div>

        {/* --- 1. MOBILE MENU (Phone only - Dropdown Design) --- */}
        <div className="block sm:hidden relative mb-6 z-20 w-1/2 mx-auto">
          {/* Trigger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between bg-black border border-gray-700 p-3 rounded-xl text-white hover:border-gray-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              {activeTabInfo && <activeTabInfo.icon size={18} />}
              <span className="font-medium text-sm">{activeTabInfo?.label}</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Options */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-700 rounded-xl overflow-hidden p-1 shadow-xl ">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg mb-1 last:mb-0 transition-colors ${getButtonStyle(activeTab === tab.id)} hover:cursor-pointer`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- 2. DESKTOP MENU (Tablet/Laptop/iMac) --- */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-6">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-3 py-3 rounded-xl font-medium sm:w-1/4 transition-all ${getButtonStyle(activeTab === tab.id)} hover:cursor-pointer`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="border border-gray-700 rounded-2xl bg-black relative z-10 shadow-lg">
          {tabs[activeTab]}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />

      <TwoFAModal
        isOpen={show2FAModal}
        onClose={() => { setShow2FAModal(false); setIsLoading(false) }}
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