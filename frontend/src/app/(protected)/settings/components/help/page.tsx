'use client'
import React from 'react'
import { HelpCircle } from 'lucide-react'

const HelpTab = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Help & Support</h2>
        <p className="text-gray-500">Get help with your account and application</p>
      </div>

      <div className="space-y-6">
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
            <p className="text-white">📧 Email: zmoumni@support.com</p>
            <p className="text-white">🕒 Response Time: 24-48 hours</p>
            <p className='text-white'>📞 Phone: (+212) 684 255 367 (abechcha)</p>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-black rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Application Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Version</p>
              <p className="text-white">1.0.1</p>
            </div>
            <div>
              <p className="text-gray-400">Last Updated</p>
              <p className="text-white">November 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpTab