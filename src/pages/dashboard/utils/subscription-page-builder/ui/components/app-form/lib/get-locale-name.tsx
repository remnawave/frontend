import { TFunction } from 'i18next'

export const getLocaleName = (locale: string, t: TFunction): string => {
    switch (locale) {
        case 'en':
            return t('language-selector.component.english')
        case 'fa':
            return t('language-selector.component.persian')
        case 'fr':
            return t('language-selector.component.french')
        case 'ru':
            return t('language-selector.component.russian')
        case 'zh':
            return t('language-selector.component.chinese')
        default:
            return locale
    }
}
