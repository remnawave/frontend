/* eslint-disable @typescript-eslint/no-explicit-any, no-use-before-define */

import { PlatformConfig } from './types'

interface ValidationResult {
    errors: string[]
    valid: boolean
}

export function isPlatformConfig(obj: any): obj is PlatformConfig {
    const result = validatePlatformConfig(obj)
    return result.valid
}

export function validatePlatformConfig(config: any): ValidationResult {
    const errors: string[] = []

    if (!config || typeof config !== 'object') {
        return { valid: false, errors: ['Configuration must be an object'] }
    }

    if (!Array.isArray(config.ios)) {
        errors.push('config.ios: must be an array')
    } else {
        config.ios.forEach((app: any, index: number) => {
            errors.push(...validateAppConfig(app, `config.ios[${index}]`))
        })
    }

    if (!Array.isArray(config.android)) {
        errors.push('config.android: must be an array of applications')
    } else {
        config.android.forEach((app: any, index: number) => {
            errors.push(...validateAppConfig(app, `config.android[${index}]`))
        })
    }

    if (!Array.isArray(config.pc)) {
        errors.push('config.pc: must be an array of applications')
    } else {
        config.pc.forEach((app: any, index: number) => {
            errors.push(...validateAppConfig(app, `config.pc[${index}]`))
        })
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

function validateAppConfig(app: any, path: string): string[] {
    const errors: string[] = []

    if (!app || typeof app !== 'object') {
        return [`${path}: must be an object`]
    }

    if (typeof app.id !== 'string') {
        errors.push(`${path}.id: must be a lowercase string`)
    } else if (app.id === '') {
        errors.push(`${path}.id: cannot be empty`)
    } else if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(app.id) && app.id.length > 1) {
        errors.push(
            `${path}.id: must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens`
        )
    } else if (!/^[a-z]$/.test(app.id) && app.id.length === 1) {
        errors.push(`${path}.id: single character must be a lowercase letter`)
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
                `${path}.installationStep.description`
            )
        )
        errors.push(
            ...validateButtons(app.installationStep.buttons, `${path}.installationStep.buttons`)
        )
    }

    if (!app.addSubscriptionStep) {
        errors.push(`${path}.addSubscriptionStep: required field is missing`)
    } else {
        errors.push(...validateStep(app.addSubscriptionStep, `${path}.addSubscriptionStep`))
    }

    if (!app.connectAndUseStep) {
        errors.push(`${path}.connectAndUseStep: required field is missing`)
    } else {
        errors.push(...validateStep(app.connectAndUseStep, `${path}.connectAndUseStep`))
    }

    if (app.additionalBeforeAddSubscriptionStep) {
        errors.push(
            ...validateTitleStep(
                app.additionalBeforeAddSubscriptionStep,
                `${path}.additionalBeforeAddSubscriptionStep`
            )
        )
    }

    if (app.additionalAfterAddSubscriptionStep) {
        errors.push(
            ...validateTitleStep(
                app.additionalAfterAddSubscriptionStep,
                `${path}.additionalAfterAddSubscriptionStep`
            )
        )
    }

    return errors
}

function validateButton(button: any, path: string): string[] {
    const errors: string[] = []

    if (!button || typeof button !== 'object') {
        return [`${path}: button must be an object`]
    }

    if (typeof button.buttonLink !== 'string') {
        errors.push(`${path}.buttonLink: must be a string`)
    } else if (button.buttonLink === '') {
        errors.push(`${path}.buttonLink: can't be empty`)
    }

    errors.push(...validateLocalizedText(button.buttonText, `${path}.buttonText`))

    return errors
}

function validateButtons(buttons: any, path: string): string[] {
    const errors: string[] = []

    if (!Array.isArray(buttons)) {
        return [`${path}: must be an array of buttons`]
    }

    buttons.forEach((button, index) => {
        errors.push(...validateButton(button, `${path}[${index}]`))
    })

    return errors
}

function validateLocalizedText(text: any, path: string): string[] {
    const errors: string[] = []

    if (!text || typeof text !== 'object') {
        return [`${path}: must be an object with translations`]
    }

    if (typeof text.en !== 'string') errors.push(`${path}.en: must be a string`)
    if (typeof text.fa !== 'string') errors.push(`${path}.fa: must be a string`)
    if (typeof text.ru !== 'string') errors.push(`${path}.ru: must be a string`)

    if (typeof text.en === 'string' && text.en === '') errors.push(`${path}.en: can't be empty`)
    if (typeof text.fa === 'string' && text.fa === '') errors.push(`${path}.fa: can't be empty`)
    if (typeof text.ru === 'string' && text.ru === '') errors.push(`${path}.ru: can't be empty`)

    return errors
}

function validateStep(step: any, path: string): string[] {
    const errors: string[] = []

    if (!step || typeof step !== 'object') {
        return [`${path}: must be an object`]
    }

    errors.push(...validateLocalizedText(step.description, `${path}.description`))

    return errors
}

function validateTitleStep(step: any, path: string): string[] {
    const errors: string[] = []

    if (!step || typeof step !== 'object') {
        return [`${path}: must be an object`]
    }

    errors.push(...validateLocalizedText(step.title, `${path}.title`))
    errors.push(...validateLocalizedText(step.description, `${path}.description`))
    errors.push(...validateButtons(step.buttons, `${path}.buttons`))

    return errors
}
