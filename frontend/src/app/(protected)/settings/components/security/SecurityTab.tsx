'use client'
import React from 'react'
import { Lock, Shield } from 'lucide-react'
import SwitchButton from '../SwitchButton'
import { useTranslation } from '@/contexts/LanguageContext';


interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityTabProps {
  formData: SecurityFormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isPasswordAuth: boolean
  authMethod: number
  is2FAEnabled: boolean
  handleToggle2FA: () => void
  handleSaveSecurity: () => void
  isLoading: boolean
}

const SecurityTab = ({
  formData,
  handleInputChange,
  isPasswordAuth,
  authMethod,
  is2FAEnabled,
  handleToggle2FA,
  handleSaveSecurity,
  isLoading
}: SecurityTabProps) => {
  const {t} = useTranslation();
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('settings.securitySettings')}</h2>
        <p className="text-gray-500">{t('settings.securitySubtitle')}</p>
      </div>

      {!isPasswordAuth && (
        <div className='mb-6 p-4 bg-black border-2 border-gray-400 rounded-xl'>
          <p className='text-sm text-gray-500 flex items-start gap-2'>
            <Lock size={16} className='mt-0.5 flex-shrink-0' />
            <span>
              {t('settings.youSignedWith')} <strong className='text-white'>{authMethod === 1 ? 'Google' : '42'}</strong>. {t('settings.passwordManagmentNotAvailable')}
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {isPasswordAuth && (
          <>
            <div className="md:col-span-2">
              <label htmlFor="currentPassword" className='flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2'>
                <Lock size={16} />
                {t('settings.currentPassword')}
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className='w-full p-3 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm hover:border-white placeholder-gray-500'
                placeholder={t('settings.currentPasswordPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className='flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2'>
                <Lock size={16} />
                {t('settings.newPassword')}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className='w-full p-3 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm hover:border-white placeholder-gray-500'
                placeholder={t('settings.newPasswordPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className='flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2'>
                <Lock size={16} />
                {t('settings.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className='w-full p-3 border-2 border-gray-400 bg-black rounded-xl focus:ring-2 focus:ring-white focus:border-white transition-all outline-none text-white text-sm hover:border-white placeholder-gray-500'
                placeholder={t('settings.confirmPasswordPlaceholder')}
              />
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-700 w-full md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">{t('settings.securityPreferences')}</h3>

          <div className={`flex items-center justify-between p-2 border border-gray-500 rounded-xl `}>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-400" />
              <div>
                <p className="font-medium">{t('settings.twoFactorAuth')}</p>
                <p className="text-sm text-gray-400">{t('settings.twoFactorAuthDesc')}</p>
              </div>
            </div>
            <SwitchButton
              label={is2FAEnabled ? t('settings.enabled') : t('settings.disabled')}
              checked={is2FAEnabled}
              onChange={() =>  handleToggle2FA()}
            />
          </div>
        </div>
      </div>

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
          {isLoading ? t('settings.saving') : t('settings.updateSecuritySettings')}
        </button>
      </div>
    </div>
  )
}

export default SecurityTab