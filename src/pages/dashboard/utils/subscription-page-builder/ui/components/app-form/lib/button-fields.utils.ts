import { AppConfig, Button as ConfigButton, LocalizedText } from '../../../../model/types'
import { emptyLocalizedText } from '../../../../model/config'

export type ButtonSection =
    | 'additionalAfterAddSubscriptionStep'
    | 'additionalBeforeAddSubscriptionStep'
    | 'installationStep'

export const addButton = (
    localApp: AppConfig,
    section: ButtonSection,
    updateApp: (data: Partial<AppConfig>) => void
) => {
    const newButton: ConfigButton = {
        buttonLink: '',
        buttonText: { ...emptyLocalizedText }
    }

    if (section === 'installationStep') {
        const buttons = [...localApp.installationStep.buttons, newButton]
        updateApp({
            installationStep: {
                ...localApp.installationStep,
                buttons
            }
        })
    } else if (
        section === 'additionalBeforeAddSubscriptionStep' &&
        localApp.additionalBeforeAddSubscriptionStep
    ) {
        const buttons = [...localApp.additionalBeforeAddSubscriptionStep.buttons, newButton]
        updateApp({
            additionalBeforeAddSubscriptionStep: {
                ...localApp.additionalBeforeAddSubscriptionStep,
                buttons
            }
        })
    } else if (
        section === 'additionalAfterAddSubscriptionStep' &&
        localApp.additionalAfterAddSubscriptionStep
    ) {
        const buttons = [...localApp.additionalAfterAddSubscriptionStep.buttons, newButton]
        updateApp({
            additionalAfterAddSubscriptionStep: {
                ...localApp.additionalAfterAddSubscriptionStep,
                buttons
            }
        })
    }
}

export const removeButton = (
    localApp: AppConfig,
    section: ButtonSection,
    index: number,
    updateApp: (data: Partial<AppConfig>) => void
) => {
    if (section === 'installationStep') {
        const buttons = [...localApp.installationStep.buttons]
        buttons.splice(index, 1)
        updateApp({
            installationStep: {
                ...localApp.installationStep,
                buttons
            }
        })
    } else if (
        section === 'additionalBeforeAddSubscriptionStep' &&
        localApp.additionalBeforeAddSubscriptionStep
    ) {
        const buttons = [...localApp.additionalBeforeAddSubscriptionStep.buttons]
        buttons.splice(index, 1)
        updateApp({
            additionalBeforeAddSubscriptionStep: {
                ...localApp.additionalBeforeAddSubscriptionStep,
                buttons
            }
        })
    } else if (
        section === 'additionalAfterAddSubscriptionStep' &&
        localApp.additionalAfterAddSubscriptionStep
    ) {
        const buttons = [...localApp.additionalAfterAddSubscriptionStep.buttons]
        buttons.splice(index, 1)
        updateApp({
            additionalAfterAddSubscriptionStep: {
                ...localApp.additionalAfterAddSubscriptionStep,
                buttons
            }
        })
    }
}

export const updateButtonField = (
    localApp: AppConfig,
    section: ButtonSection,
    index: number,
    field: keyof ConfigButton,
    value: string,
    updateApp: (data: Partial<AppConfig>) => void
) => {
    let buttons

    if (section === 'installationStep') {
        buttons = [...localApp.installationStep.buttons]
        if (field === 'buttonLink') {
            buttons[index] = { ...buttons[index], buttonLink: value }
        } else if (field === 'buttonText') {
            buttons[index] = {
                ...buttons[index],
                buttonText: value as unknown as LocalizedText
            }
        }

        updateApp({
            installationStep: {
                ...localApp.installationStep,
                buttons
            }
        })
    } else if (
        section === 'additionalBeforeAddSubscriptionStep' &&
        localApp.additionalBeforeAddSubscriptionStep
    ) {
        buttons = [...localApp.additionalBeforeAddSubscriptionStep.buttons]
        if (field === 'buttonLink') {
            buttons[index] = { ...buttons[index], buttonLink: value }
        } else if (field === 'buttonText') {
            buttons[index] = {
                ...buttons[index],
                buttonText: value as unknown as LocalizedText
            }
        }

        updateApp({
            additionalBeforeAddSubscriptionStep: {
                ...localApp.additionalBeforeAddSubscriptionStep,
                buttons
            }
        })
    } else if (
        section === 'additionalAfterAddSubscriptionStep' &&
        localApp.additionalAfterAddSubscriptionStep
    ) {
        buttons = [...localApp.additionalAfterAddSubscriptionStep.buttons]
        if (field === 'buttonLink') {
            buttons[index] = { ...buttons[index], buttonLink: value }
        } else if (field === 'buttonText') {
            buttons[index] = {
                ...buttons[index],
                buttonText: value as unknown as LocalizedText
            }
        }

        updateApp({
            additionalAfterAddSubscriptionStep: {
                ...localApp.additionalAfterAddSubscriptionStep,
                buttons
            }
        })
    }
}

export const updateButtonText = (
    localApp: AppConfig,
    section: ButtonSection,
    index: number,
    lang: keyof LocalizedText,
    value: string,
    updateApp: (data: Partial<AppConfig>) => void
) => {
    let buttons

    if (section === 'installationStep') {
        buttons = [...localApp.installationStep.buttons]
        buttons[index] = {
            ...buttons[index],
            buttonText: {
                ...buttons[index].buttonText,
                [lang]: value
            }
        }

        updateApp({
            installationStep: {
                ...localApp.installationStep,
                buttons
            }
        })
    } else if (
        section === 'additionalBeforeAddSubscriptionStep' &&
        localApp.additionalBeforeAddSubscriptionStep
    ) {
        buttons = [...localApp.additionalBeforeAddSubscriptionStep.buttons]
        buttons[index] = {
            ...buttons[index],
            buttonText: {
                ...buttons[index].buttonText,
                [lang]: value
            }
        }

        updateApp({
            additionalBeforeAddSubscriptionStep: {
                ...localApp.additionalBeforeAddSubscriptionStep,
                buttons
            }
        })
    } else if (
        section === 'additionalAfterAddSubscriptionStep' &&
        localApp.additionalAfterAddSubscriptionStep
    ) {
        buttons = [...localApp.additionalAfterAddSubscriptionStep.buttons]
        buttons[index] = {
            ...buttons[index],
            buttonText: {
                ...buttons[index].buttonText,
                [lang]: value
            }
        }

        updateApp({
            additionalAfterAddSubscriptionStep: {
                ...localApp.additionalAfterAddSubscriptionStep,
                buttons
            }
        })
    }
}
