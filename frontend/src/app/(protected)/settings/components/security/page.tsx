'use client'
import React from 'react'
import { Lock, Shield } from 'lucide-react'
import SwitchButton from '../SwitchButton'

interface SecurityTabProps {
  formData: any
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
  return (
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
          <div className={`flex items-center justify-between p-2 border border-gray-500 rounded-xl `}>
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
              onChange={() =>  handleToggle2FA()}
            />
          </div>
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
  )
}

export default SecurityTab