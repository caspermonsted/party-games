import { createContext, useContext, useState } from 'react'
import { translations } from './translations.js'

const LanguageContext = createContext()

function getSavedLang() {
  try { return localStorage.getItem('pg_lang') || 'en' } catch { return 'en' }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getSavedLang)

  function toggleLang() {
    const next = lang === 'en' ? 'da' : 'en'
    try { localStorage.setItem('pg_lang', next) } catch {}
    setLang(next)
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
