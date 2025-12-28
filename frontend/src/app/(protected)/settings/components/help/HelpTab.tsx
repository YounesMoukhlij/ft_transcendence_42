'use client'

import React from 'react'
import { HelpCircle } from 'lucide-react'

const HelpTab = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Help</h2>
        <p className="text-gray-500">Get support and find answers</p>
      </div>

      <div className="p-4 bg-black border-2 border-gray-400 rounded-xl">
        <p className="text-sm text-gray-500 flex items-start gap-2">
          <HelpCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            If you’re having trouble, please check your connection and try again.
          </span>
        </p>
      </div>
    </div>
  )
}

export default HelpTab
