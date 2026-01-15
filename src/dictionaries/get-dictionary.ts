import 'server-only'

const dictionaries = {
    es: () => import('./es').then((module) => module.default),
    en: () => import('./en').then((module) => module.default),
}

export const getDictionary = async (locale: 'es' | 'en') => dictionaries[locale]()
