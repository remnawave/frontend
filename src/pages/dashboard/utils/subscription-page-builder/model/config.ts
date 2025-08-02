import {
    IAppConfig,
    ILocalizedText,
    IStep,
    ISubscriptionPageAppConfig,
    ITitleStep,
    TPlatform
} from './types'

export const emptyLocalizedText: ILocalizedText = {
    en: ''
}

export const emptyStep: IStep = {
    description: { ...emptyLocalizedText }
}

export const emptyTitleStep: ITitleStep = {
    description: { ...emptyLocalizedText },
    title: { ...emptyLocalizedText },
    buttons: []
}

export const createEmptyApp = (
    platform: TPlatform,
    additionalLocales: string[] = []
): IAppConfig => {
    const createLocalizedTextWithLocales = (): ILocalizedText => {
        const text: ILocalizedText = { ...emptyLocalizedText }
        additionalLocales.forEach((locale) => {
            text[locale as keyof ILocalizedText] = ''
        })
        return text
    }

    return {
        id: `new-app-${platform}-${Date.now()}`.toLowerCase(),
        name: 'New App',
        isFeatured: false,
        urlScheme: '',
        installationStep: {
            buttons: [],
            description: createLocalizedTextWithLocales()
        },
        addSubscriptionStep: {
            description: createLocalizedTextWithLocales()
        },
        connectAndUseStep: {
            description: createLocalizedTextWithLocales()
        }
    }
}

export const emptyConfig: ISubscriptionPageAppConfig = {
    config: {
        additionalLocales: []
    },
    platforms: {
        android: [],
        ios: [],
        linux: [],
        macos: [],
        windows: [],
        androidTV: [],
        appleTV: []
    }
}
