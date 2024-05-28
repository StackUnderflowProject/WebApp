import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(HttpApi) // Load translations using http (default public/assets/locate)
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass the i18n instance to react-i18next
    .init({
        supportedLngs: ['sl', 'en'], // Supported languages
        fallbackLng: 'en', // Fallback language if detected language is not available
        detection: {
            order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
            caches: ['cookie']
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json' // Path where translations get loaded from
        },
        react: {
            useSuspense: false // Set to true if you are using Suspense
        }
    })

export default i18n