// settings/components/SwitchButton.tsx
'use client'
import React from 'react'

interface SwitchButtonProps {
  label: string
  checked: boolean
  onChange: () => void
}

const SwitchButton = ({ label, checked, onChange }: SwitchButtonProps) => {
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

export default SwitchButton