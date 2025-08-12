import { IAppConfig, ILocalizedText, ISubscriptionPageAppConfig, TAdditionalLocales } from './types'

export const cleanupLocalizedText = (
    text: ILocalizedText,
    enabledLocales: TAdditionalLocales[]
): ILocalizedText => {
    const cleanedText: ILocalizedText = { en: text.en }

    enabledLocales.forEach((locale) => {
        if (text[locale] !== undefined) {
            cleanedText[locale] = text[locale]
        }
    })

    return cleanedText
}

export const cleanupAppConfig = (
    app: IAppConfig,
    enabledLocales: TAdditionalLocales[]
): IAppConfig => {
    const cleanedApp: IAppConfig = {
        ...app,
        installationStep: {
            ...app.installationStep,
            description: cleanupLocalizedText(app.installationStep.description, enabledLocales),
            buttons: app.installationStep.buttons.map((button) => ({
                ...button,
                buttonText: cleanupLocalizedText(button.buttonText, enabledLocales)
            }))
        },
        addSubscriptionStep: {
            ...app.addSubscriptionStep,
            description: cleanupLocalizedText(app.addSubscriptionStep.description, enabledLocales)
        },
        connectAndUseStep: {
            ...app.connectAndUseStep,
            description: cleanupLocalizedText(app.connectAndUseStep.description, enabledLocales)
        }
    }

    if (app.additionalBeforeAddSubscriptionStep) {
        cleanedApp.additionalBeforeAddSubscriptionStep = {
            ...app.additionalBeforeAddSubscriptionStep,
            title: cleanupLocalizedText(
                app.additionalBeforeAddSubscriptionStep.title,
                enabledLocales
            ),
            description: cleanupLocalizedText(
                app.additionalBeforeAddSubscriptionStep.description,
                enabledLocales
            ),
            buttons: app.additionalBeforeAddSubscriptionStep.buttons.map((button) => ({
                ...button,
                buttonText: cleanupLocalizedText(button.buttonText, enabledLocales)
            }))
        }
    }

    if (app.additionalAfterAddSubscriptionStep) {
        cleanedApp.additionalAfterAddSubscriptionStep = {
            ...app.additionalAfterAddSubscriptionStep,
            title: cleanupLocalizedText(
                app.additionalAfterAddSubscriptionStep.title,
                enabledLocales
            ),
            description: cleanupLocalizedText(
                app.additionalAfterAddSubscriptionStep.description,
                enabledLocales
            ),
            buttons: app.additionalAfterAddSubscriptionStep.buttons.map((button) => ({
                ...button,
                buttonText: cleanupLocalizedText(button.buttonText, enabledLocales)
            }))
        }
    }

    return cleanedApp
}

export const cleanupSubscriptionPageConfig = (
    config: ISubscriptionPageAppConfig
): ISubscriptionPageAppConfig => {
    const enabledLocales = config.config.additionalLocales

    const cleanedConfig: ISubscriptionPageAppConfig = {
        ...config,
        config: {
            ...config.config,
            ...(config.config.branding && { branding: config.config.branding })
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

    Object.keys(config.platforms).forEach((platform) => {
        const platformKey = platform as keyof typeof config.platforms
        cleanedConfig.platforms[platformKey] = config.platforms[platformKey].map((app) =>
            cleanupAppConfig(app, enabledLocales)
        )
    })

    return cleanedConfig
}
