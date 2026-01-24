'use client'
import React, { useState, useRef, useEffect } from 'react'
import { User, Shield, HelpCircle, ChevronDown } from 'lucide-react'
import { useUserStore } from '../../../store/userStore'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import api from '@/lib/api' 
import { useTranslation } from '@/contexts/LanguageContext';

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
  
  const {t} = useTranslation();

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  

  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [otpAuthUrl, setOtpAuthUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')


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


  const tabItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ]

  const languages = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', label: 'French', flag: '🇫🇷' }
  ]

  const authMethod = user?.auth_method || 0
  const isPasswordAuth = authMethod === 0


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



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageClick = () => fileInputRef.current?.click()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(t('settings.imageInvalid'))
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
        toast.error(t('settings.usernameRequired'))
        return
      }
      if (!formData.email.trim()) {
        toast.error(t('settings.emailRequired'))
        return
      }
      if (formData.username.length < 3 || formData.username.length > 20) {
        toast.error(t('settings.usernameLengthError'))
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

      const response = await api.post(`${process.env.NEXT_PUBLIC_BACK_API}/api/updateUserInfo`, dataToSave, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      })
      const data = response.data
      if (!data.success) {
        toast.error(data.message || t('settings.errors.updateFailed'))
        return
      }

      toast.success(t('settings.profileUpdated'))
      const updatedUser = { ...user, ...data.user }
      setUser(updatedUser)
      
      setPreviewImage(null)
      setImageFile(null)

    } catch (error) {
      console.log('Profile update error:', error)
      const msg = error.response?.data?.message || t('settings.errors.unexpectedError')
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSaveSecurity = async () => {
    setIsLoading(true)

    if (is2FAEnabled && !formData.currentPassword.trim()) {
        toast.error(t('settings.currentPasswordRequired'))
        setIsLoading(false)
        return
    }

    if (isPasswordAuth) {
        if (formData.newPassword.trim() !== '' && formData.currentPassword.trim() === '') {
            toast.error(t('settings.currentPasswordRequiredForNew'))
            setIsLoading(false)
            return
        }
        if (formData.newPassword.trim() !== '') {
            if (formData.newPassword.length < 8) {
                toast.error(t('settings.passwordMinLength'))
                setIsLoading(false)
                return
            }
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error(t('settings.passwordMismatch'))
                setIsLoading(false)
                return
            }
        }
    }

    try {
      if (formData.newPassword.trim() !== '') {
        const response = await api.post(`/api/updateUserPassword`, 
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
          toast.error(data.message || t('settings.errors.passwordUpdateFailed'))
          return
        }
        toast.success(t('settings.passwordUpdated'))
        
        setFormData((prev) => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }))
      } else {
        toast.error(t('settings.errors.noNewPasswordEntered'))
      }
    } catch (error) {
      console.log('Security update error:', error)
      const msg = error.response?.data?.message || t('settings.errors.unexpectedError')
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsLoading(true)
    if (is2FAEnabled) {
      try {
        const response = await api.post(`/api/update2FA`, 
          { twofa: false },
          {
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        )

        const data = response.data
        if (!data.success) {
          toast.error(data.message || t('settings.errors.disable2FAFailed'))
        } else {
          setIs2FAEnabled(false)
          setUser({ ...user, twoFA_enabled: false, twoFA_secret: null })
          toast.success(t('settings.twoFactorDisabled'))
        }
      } catch (error) {
        console.log('2FA disable error:', error)
        const msg = error.response?.data?.message || t('settings.errors.unexpectedError')
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        const response = await api.post(`/api/2fa/generate`, 
          {},
          {
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        )

        const data = response.data
        if (!data.success) {
          toast.error(data.message || t('settings.generate2FASecretFailed'))
        } else {
          setOtpAuthUrl(data.otpauth)
          setVerificationCode('')
          setShow2FAModal(true)
        }
      } catch (error) {
        console.log('2FA generate error:', error)
        const msg = error.response?.data?.message || t('settings.errors.unexpectedError')
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleVerify2FA = async () => {
    setIsLoading(true)
    try {
      const response = await api.post(`/api/2fa/verify`, 
        { token: verificationCode },
        {
          headers: { Authorization: `Bearer ${user.access_token}` }
        }
      )

      const data = response.data
      if (!data.success) {
        toast.error(data.message || t('settings.invalidCode'))
      } else {
        toast.success(t('settings.twoFactorEnabled'))
        setIs2FAEnabled(true)
        setUser({ ...user, twoFA_enabled: true })
        setShow2FAModal(false)
        setVerificationCode('')
        setOtpAuthUrl('')
      }
    } catch (error) {
      console.log('2FA verification error:', error)
      const msg = error.response?.data?.message || t('settings.errors.unexpectedError')
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
     await api.post(`/api/DeleteAccount`, {
        headers: { Authorization: `Bearer ${user.access_token}` }
      })
      toast.success(t('settings.accountDeletedSuccess'))
      setUser(null)
      setIsDeleteDialogOpen(false)
      router.push('/signIn')
    } catch (error) {
      console.log('Account deletion error:', error)
      const msg = error.response?.data?.message || t('settings.errors.deleteFailed')
      toast.error(msg)
    } finally {
      setIsDeletingAccount(false)
    }
  }

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
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('settings.title')}</h1>
          <p className="text-gray-500 text-sm sm:text-base">{t('settings.subtitle')}</p>
        </div>

        <div className="block sm:hidden relative mb-6 z-20 w-1/2 mx-auto">
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

        <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-6">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-3 py-3 rounded-xl font-medium sm:w-1/4 transition-all ${getButtonStyle(activeTab === tab.id)} hover:cursor-pointer`}
            >
              <tab.icon size={20} />
              <span>{tab.label === "Profile" ? t('settings.profile') : tab.label === "Help" ? t('settings.help') : t('settings.security')}</span>
            </button>
          ))}
        </div>

        <div className="border border-gray-700 rounded-2xl bg-black relative z-10 shadow-lg">
          {tabs[activeTab]}
        </div>
      </div>

      
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