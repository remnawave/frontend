import { AppConfig, LocalizedText, PlatformConfig, Step, TitleStep } from './types'

/**
 * Пустые шаблоны для создания новых объектов
 */

export const emptyLocalizedText: LocalizedText = {
    en: '',
    fa: '',
    ru: ''
}

export const emptyStep: Step = {
    description: { ...emptyLocalizedText }
}

export const emptyTitleStep: TitleStep = {
    description: { ...emptyLocalizedText },
    title: { ...emptyLocalizedText },
    buttons: []
}

/**
 * Создает пустое приложение для указанной платформы
 */
export const createEmptyApp = (platform: 'android' | 'ios' | 'pc'): AppConfig => ({
    id: `new-app-${platform}-${Date.now()}`.toLowerCase() as `${Lowercase<string>}`,
    name: 'New App',
    isFeatured: false,
    urlScheme: '',
    installationStep: {
        buttons: [],
        description: { ...emptyLocalizedText }
    },
    addSubscriptionStep: { ...emptyStep },
    connectAndUseStep: { ...emptyStep }
})

/**
 * Пустая конфигурация платформ
 */
export const emptyConfig: PlatformConfig = {
    ios: [],
    android: [],
    pc: []
}
