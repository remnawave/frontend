export type TAdditionalLocales = 'fa' | 'ru' | 'zh'
export type TEnabledLocales = 'en' | TAdditionalLocales
export type TPlatform = 'android' | 'androidTV' | 'appleTV' | 'ios' | 'linux' | 'macos' | 'windows'

export interface ILocalizedText {
    en: string
    fa?: string
    ru?: string
    zh?: string
}

export interface IStep {
    description: ILocalizedText
}

export interface IButton {
    buttonLink: string
    buttonText: ILocalizedText
}
export interface ITitleStep extends IStep {
    buttons: IButton[]
    title: ILocalizedText
}

export interface IAppConfig {
    additionalAfterAddSubscriptionStep?: ITitleStep
    additionalBeforeAddSubscriptionStep?: ITitleStep
    addSubscriptionStep: IStep
    connectAndUseStep: IStep
    id: string
    installationStep: {
        buttons: IButton[]
        description: ILocalizedText
    }
    isFeatured: boolean
    isNeedBase64Encoding?: boolean
    name: string
    urlScheme: string
}

export interface ISubscriptionPageConfiguration {
    additionalLocales: TAdditionalLocales[]
}

export interface ISubscriptionPageAppConfig {
    config: ISubscriptionPageConfiguration
    platforms: Record<TPlatform, IAppConfig[]>
}
