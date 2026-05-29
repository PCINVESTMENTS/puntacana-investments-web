import 'server-only'

const dictionaries = {
    es: () => import('./es').then((module) => module.default),
    en: () => import('./en').then((module) => module.default),
    fr: () => import('./fr').then((module) => module.default),
}

export const getDictionary = async (locale: 'es' | 'en' | 'fr') => dictionaries[locale]()
