import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { LANGUAGES } from '@/shared/config/i18next/constants.ts'
import { en } from '@/shared/config/i18next/translations/en.ts'
import { uk } from '@/shared/config/i18next/translations/uk.ts'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

const resources = {
  [LANGUAGES.EN[0]]: {
    translation: en,
  },
  [LANGUAGES.UA[0]]: {
    translation: uk,
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    pluralSeparator: '_',
    compatibilityJSON: 'v3', // ensures older plural rule support
  })

export default i18n
