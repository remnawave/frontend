/* eslint-disable no-use-before-define */

export interface AppConfig {
    additionalAfterAddSubscriptionStep?: TitleStep
    additionalBeforeAddSubscriptionStep?: TitleStep
    addSubscriptionStep: Step
    connectAndUseStep: Step
    id: `${Lowercase<string>}`
    installationStep: {
        buttons: Button[]
        description: LocalizedText
    }
    isFeatured: boolean
    isNeedBase64Encoding?: boolean
    name: string
    urlScheme: string
    viewPosition?: number
}

export interface Button {
    buttonLink: string
    buttonText: LocalizedText
}

export interface LocalizedText {
    en: string
    fa: string
    ru: string
}

export interface PlatformConfig {
    android: AppConfig[]
    ios: AppConfig[]
    pc: AppConfig[]
}

export interface Step {
    description: LocalizedText
}

export interface TitleStep extends Step {
    buttons: Button[]
    title: LocalizedText
}
