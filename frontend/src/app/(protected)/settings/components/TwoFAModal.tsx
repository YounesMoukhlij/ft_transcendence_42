'use client'
import React from 'react'
import { QRCodeSVG } from 'qrcode.react' // QRcode generator

interface TwoFAModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  otpAuthUrl: string
  verificationCode: string
  setVerificationCode: (code: string) => void
  isLoading: boolean
}

const TwoFAModal = ({
  isOpen,
  onClose,
  onSubmit,
  otpAuthUrl,
  verificationCode,
  setVerificationCode,
  isLoading
}: TwoFAModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-black rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Set Up Two-Factor Authentication
          </h2>
          <p className="text-gray-400 text-center leading-relaxed">
            1. Scan the QR code below with your Google Authenticator app.
          </p>
        </div>

        <div className="flex justify-center items-center p-6 bg-white rounded-lg m-8">
          {otpAuthUrl ? (
            <QRCodeSVG value={otpAuthUrl} size={200} />
          ) : (
            <p className="text-black">Loading QR Code...</p>
          )}
        </div>

        <div className="px-8 pb-6">
          <p className="text-gray-400 text-center leading-relaxed">
            2. Enter the 6-digit code from your app to verify.
          </p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            placeholder="XXXXXX"
            className="w-full bg-black border-2 border-gray-600 rounded-xl p-3 text-white text-center text-2xl tracking-widest my-4 focus:border-white"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border border-gray-500 text-gray-300 hover:bg-gray-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || verificationCode.length < 6}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border border-white hover:bg-gray-500 hover:text-white disabled:bg-gray-600 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Verifying...' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwoFAModal