'use client'

import React from 'react'
import { HelpCircle } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext';


const HelpTab = () => {
  const {t} = useTranslation();
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('settings.help')}</h2>
        <p className="text-gray-500">{t('settings.getSupportAndFindAnswers')}</p>
      </div>

      <div className="p-4 bg-black border-2 border-gray-400 rounded-xl">
        <p className="text-sm text-gray-500 flex items-start gap-2">
          <HelpCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            {t('settings.connectionTrouble')}
          </span>
        </p>
      </div>
    </div>
  )
}

export default HelpTab
