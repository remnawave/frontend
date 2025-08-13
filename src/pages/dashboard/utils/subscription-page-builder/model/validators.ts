/* eslint-disable @typescript-eslint/no-explicit-any, no-use-before-define */

import { ISubscriptionPageAppConfig, TPlatform } from './types'

interface ValidationResult {
    errors: string[]
    valid: boolean
}

export function isSubscriptionPageAppConfig(obj: any): obj is ISubscriptionPageAppConfig {
    const result = validateSubscriptionPageAppConfig(obj)
    return result.valid
}

export function validateSubscriptionPageAppConfig(config: any): ValidationResult {
    const errors: string[] = []

    if (!config || typeof config !== 'object') {
        return { valid: false, errors: ['Configuration must be an object'] }
    }

    if (!config.config || typeof config.config !== 'object') {
        errors.push('config.config: must be an object')
    } else {
        if (!Array.isArray(config.config.additionalLocales)) {
            errors.push('config.config.additionalLocales: must be an array')
        } else {
            config.config.additionalLocales.forEach((locale: any, index: number) => {
                if (typeof locale !== 'string' || !['fa', 'ru', 'zh'].includes(locale)) {
                    errors.push(
                        `config.config.additionalLocales[${index}]: must be one of 'fa', 'ru', 'zh'`
                    )
                }
            })
        }

        if (config.config.branding !== undefined) {
            if (typeof config.config.branding !== 'object' || config.config.branding === null) {
                errors.push('config.config.branding: must be an object')
            } else {
                const { branding } = config.config

                if (branding.name !== undefined && typeof branding.name !== 'string') {
                    errors.push('config.config.branding.name: must be a string')
                }

                if (branding.logoUrl !== undefined) {
                    if (typeof branding.logoUrl !== 'string') {
                        errors.push('config.config.branding.logoUrl: must be a string')
                    } else if (branding.logoUrl && !isValidUrl(branding.logoUrl)) {
                        errors.push('config.config.branding.logoUrl: must be a valid URL')
                    }
                }

                if (branding.supportUrl !== undefined) {
                    if (typeof branding.supportUrl !== 'string') {
                        errors.push('config.config.branding.supportUrl: must be a string')
                    } else if (branding.supportUrl && !isValidUrl(branding.supportUrl)) {
                        errors.push('config.config.branding.supportUrl: must be a valid URL')
                    }
                }
            }
        }
    }

    if (!config.platforms || typeof config.platforms !== 'object') {
        errors.push('config.platforms: must be an object')
    } else {
        const supportedPlatforms: TPlatform[] = [
            'android',
            'ios',
            'linux',
            'macos',
            'windows',
            'androidTV',
            'appleTV'
        ]

        supportedPlatforms.forEach((platform) => {
            if (!Array.isArray(config.platforms[platform])) {
                errors.push(`config.platforms.${platform}: must be an array`)
            } else {
                config.platforms[platform].forEach((app: any, index: number) => {
                    errors.push(
                        ...validateAppConfig(
                            app,
                            `config.platforms.${platform}[${index}]`,
                            config.config?.additionalLocales || []
                        )
                    )
                })
            }
        })
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

function validateAppConfig(app: any, path: string, additionalLocales: string[]): string[] {
    const errors: string[] = []

    if (!app || typeof app !== 'object') {
        return [`${path}: must be an object`]
    }

    if (typeof app.id !== 'string') {
        errors.push(`${path}.id: must be a string`)
    } else if (app.id === '') {
        errors.push(`${path}.id: cannot be empty`)
    }

    if (typeof app.name !== 'string') errors.push(`${path}.name: must be a string`)
    if (typeof app.isFeatured !== 'boolean') errors.push(`${path}.isFeatured: must be a boolean`)
    if (typeof app.urlScheme !== 'string') errors.push(`${path}.urlScheme: must be a string`)

    if (app.isNeedBase64Encoding !== undefined && typeof app.isNeedBase64Encoding !== 'boolean') {
        errors.push(`${path}.isNeedBase64Encoding: must be a boolean`)
    }

    if (!app.installationStep || typeof app.installationStep !== 'object') {
        errors.push(`${path}.installationStep: must be an object`)
    } else {
        errors.push(
            ...validateLocalizedText(
                app.installationStep.description,
                `${path}.installationStep.description`,
                additionalLocales
            )
        )
        errors.push(
            ...validateButtons(
                app.installationStep.buttons,
                `${path}.installationStep.buttons`,
                additionalLocales
            )
        )
    }

    if (!app.addSubscriptionStep) {
        errors.push(`${path}.addSubscriptionStep: required field is missing`)
    } else {
        errors.push(
            ...validateStep(
                app.addSubscriptionStep,
                `${path}.addSubscriptionStep`,
                additionalLocales
            )
        )
    }

    if (!app.connectAndUseStep) {
        errors.push(`${path}.connectAndUseStep: required field is missing`)
    } else {
        errors.push(
            ...validateStep(app.connectAndUseStep, `${path}.connectAndUseStep`, additionalLocales)
        )
    }

    if (app.additionalBeforeAddSubscriptionStep) {
        errors.push(
            ...validateTitleStep(
                app.additionalBeforeAddSubscriptionStep,
                `${path}.additionalBeforeAddSubscriptionStep`,
                additionalLocales
            )
        )
    }

    if (app.additionalAfterAddSubscriptionStep) {
        errors.push(
            ...validateTitleStep(
                app.additionalAfterAddSubscriptionStep,
                `${path}.additionalAfterAddSubscriptionStep`,
                additionalLocales
            )
        )
    }

    return errors
}

function validateButton(button: any, path: string, additionalLocales: string[]): string[] {
    const errors: string[] = []

    if (!button || typeof button !== 'object') {
        return [`${path}: button must be an object`]
    }

    if (typeof button.buttonLink !== 'string') {
        errors.push(`${path}.buttonLink: must be a string`)
    } else if (button.buttonLink === '') {
        errors.push(`${path}.buttonLink: can't be empty`)
    }

    errors.push(
        ...validateLocalizedText(button.buttonText, `${path}.buttonText`, additionalLocales)
    )

    return errors
}

function validateButtons(buttons: any, path: string, additionalLocales: string[]): string[] {
    const errors: string[] = []

    if (!Array.isArray(buttons)) {
        return [`${path}: must be an array of buttons`]
    }

    buttons.forEach((button, index) => {
        errors.push(...validateButton(button, `${path}[${index}]`, additionalLocales))
    })

    return errors
}

function validateLocalizedText(text: any, path: string, additionalLocales: string[]): string[] {
    const errors: string[] = []

    if (!text || typeof text !== 'object') {
        return [`${path}: must be an object with translations`]
    }

    if (typeof text.en !== 'string') {
        errors.push(`${path}.en: must be a string`)
    } else if (text.en === '') {
        errors.push(`${path}.en: can't be empty`)
    }

    additionalLocales.forEach((locale) => {
        if (text[locale] !== undefined) {
            if (typeof text[locale] !== 'string') {
                errors.push(`${path}.${locale}: must be a string`)
            } else if (text[locale] === '') {
                errors.push(`${path}.${locale}: can't be empty`)
            }
        } else {
            errors.push(`${path}.${locale}: required for selected locale`)
        }
    })

    return errors
}

function validateStep(step: any, path: string, additionalLocales: string[]): string[] {
    const errors: string[] = []

    if (!step || typeof step !== 'object') {
        return [`${path}: must be an object`]
    }

    errors.push(
        ...validateLocalizedText(step.description, `${path}.description`, additionalLocales)
    )

    return errors
}

function validateTitleStep(step: any, path: string, additionalLocales: string[]): string[] {
    const errors: string[] = []

    if (!step || typeof step !== 'object') {
        return [`${path}: must be an object`]
    }

    errors.push(...validateLocalizedText(step.title, `${path}.title`, additionalLocales))
    errors.push(
        ...validateLocalizedText(step.description, `${path}.description`, additionalLocales)
    )
    errors.push(...validateButtons(step.buttons, `${path}.buttons`, additionalLocales))

    return errors
}

function isValidUrl(url: string): boolean {
    try {
        // eslint-disable-next-line no-new
        new URL(url)
        return true
    } catch {
        return false
    }
}
