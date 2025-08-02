import { IAppConfig, ISubscriptionPageAppConfig, TAdditionalLocales } from './types'

interface OldLocalizedText {
    en: string
    fa: string
    ru: string
}

interface OldButton {
    buttonLink: string
    buttonText: OldLocalizedText
}

interface OldAppConfig {
    additionalAfterAddSubscriptionStep?: {
        buttons: OldButton[]
        description: OldLocalizedText
        title: OldLocalizedText
    }
    additionalBeforeAddSubscriptionStep?: {
        buttons: OldButton[]
        description: OldLocalizedText
        title: OldLocalizedText
    }
    addSubscriptionStep: {
        description: OldLocalizedText
    }
    connectAndUseStep: {
        description: OldLocalizedText
    }
    id: string
    installationStep: {
        buttons: OldButton[]
        description: OldLocalizedText
    }
    isFeatured: boolean
    isNeedBase64Encoding?: boolean
    name: string
    urlScheme: string
}

interface OldPlatformConfig {
    android: OldAppConfig[]
    ios: OldAppConfig[]
    pc: OldAppConfig[]
}

export const isOldFormat = (config: unknown): config is OldPlatformConfig => {
    if (!config || typeof config !== 'object' || config === null) {
        return false
    }

    const configObj = config as Record<string, unknown>

    return (
        Array.isArray(configObj.ios) &&
        Array.isArray(configObj.android) &&
        Array.isArray(configObj.pc) &&
        !configObj.config &&
        !configObj.platforms
    )
}

const migrateLocalizedText = (oldText: OldLocalizedText) => {
    return {
        en: oldText.en,
        fa: oldText.fa,
        ru: oldText.ru
    }
}

const migrateButton = (oldButton: OldButton) => {
    return {
        buttonLink: oldButton.buttonLink,
        buttonText: migrateLocalizedText(oldButton.buttonText)
    }
}

const migrateAppConfig = (oldApp: OldAppConfig): IAppConfig => {
    const newApp: IAppConfig = {
        id: oldApp.id.toLowerCase(),
        name: oldApp.name,
        isFeatured: oldApp.isFeatured,
        urlScheme: oldApp.urlScheme,
        installationStep: {
            buttons: oldApp.installationStep.buttons.map(migrateButton),
            description: migrateLocalizedText(oldApp.installationStep.description)
        },
        addSubscriptionStep: {
            description: migrateLocalizedText(oldApp.addSubscriptionStep.description)
        },
        connectAndUseStep: {
            description: migrateLocalizedText(oldApp.connectAndUseStep.description)
        }
    }

    if (oldApp.isNeedBase64Encoding !== undefined) {
        newApp.isNeedBase64Encoding = oldApp.isNeedBase64Encoding
    }

    if (oldApp.additionalBeforeAddSubscriptionStep) {
        newApp.additionalBeforeAddSubscriptionStep = {
            title: migrateLocalizedText(oldApp.additionalBeforeAddSubscriptionStep.title),
            description: migrateLocalizedText(
                oldApp.additionalBeforeAddSubscriptionStep.description
            ),
            buttons: oldApp.additionalBeforeAddSubscriptionStep.buttons.map(migrateButton)
        }
    }

    if (oldApp.additionalAfterAddSubscriptionStep) {
        newApp.additionalAfterAddSubscriptionStep = {
            title: migrateLocalizedText(oldApp.additionalAfterAddSubscriptionStep.title),
            description: migrateLocalizedText(
                oldApp.additionalAfterAddSubscriptionStep.description
            ),
            buttons: oldApp.additionalAfterAddSubscriptionStep.buttons.map(migrateButton)
        }
    }

    return newApp
}

export const migrateOldConfig = (oldConfig: OldPlatformConfig): ISubscriptionPageAppConfig => {
    const additionalLocales: TAdditionalLocales[] = ['fa', 'ru']

    const newConfig: ISubscriptionPageAppConfig = {
        config: {
            additionalLocales
        },
        platforms: {
            android: oldConfig.android.map(migrateAppConfig),
            ios: oldConfig.ios.map(migrateAppConfig),
            linux: [],
            macos: oldConfig.pc.map(migrateAppConfig),
            windows: oldConfig.pc.map(migrateAppConfig),
            androidTV: [],
            appleTV: []
        }
    }

    return newConfig
}

export const autoMigrateConfig = (config: unknown): ISubscriptionPageAppConfig => {
    if (isOldFormat(config)) {
        return migrateOldConfig(config)
    }

    return config as ISubscriptionPageAppConfig
}
