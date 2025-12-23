'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUserStore } from '../store/userStore'
import en from '../messages/en.json'
import es from '../messages/es.json'
import fr from '../messages/fr.json'
import tz from '../messages/tz.json'

type Language = 'en' | 'es' | 'fr' | 'tz'
type Messages = typeof en

const messages: Record<Language, Messages> = {
  en,
  es,
  fr,
  tz,
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const hasHydrated = useUserStore((state) => state._hasHydrated)

  // Get language from user store, default to 'en'
  const userLanguage = (user?.languages || 'en') as Language
  const [language, setLanguageState] = useState<Language>(userLanguage)

  // Sync with user store when user changes
  useEffect(() => {
    if (hasHydrated && user?.languages) {
      const lang = (user.languages as Language) || 'en'
      setLanguageState(lang)
    }
  }, [user?.languages, hasHydrated])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Update user store if user exists
    if (user) {
      const updatedUser = { ...user, languages: lang }
      setUser(updatedUser)
    }
  }

  // Translation function with nested key support and parameter replacement
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: unknown = messages[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = messages.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found even in English
          }
        }
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

