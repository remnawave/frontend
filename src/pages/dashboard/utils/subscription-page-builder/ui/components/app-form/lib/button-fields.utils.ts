import { IAppConfig, IButton, ILocalizedText, TAdditionalLocales } from '../../../../model/types'
import { emptyLocalizedText } from '../../../../model/config'

export type ButtonSection =
    | 'additionalAfterAddSubscriptionStep'
    | 'additionalBeforeAddSubscriptionStep'
    | 'installationStep'

export const addButton = (
    localApp: IAppConfig,
    section: ButtonSection,
    updateApp: (data: Partial<IAppConfig>) => void,
    additionalLocales: TAdditionalLocales[]
) => {
    const buttonText: ILocalizedText = { ...emptyLocalizedText }
    additionalLocales.forEach((locale) => {
        buttonText[locale] = 'Button Text'
    })

    const newButton: IButton = {
        buttonLink: '',
        buttonText
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
    localApp: IAppConfig,
    section: ButtonSection,
    index: number,
    updateApp: (data: Partial<IAppConfig>) => void
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
    localApp: IAppConfig,
    section: ButtonSection,
    index: number,
    field: keyof IButton,
    value: string,
    updateApp: (data: Partial<IAppConfig>) => void
) => {
    let buttons

    if (section === 'installationStep') {
        buttons = [...localApp.installationStep.buttons]
        if (field === 'buttonLink') {
            buttons[index] = { ...buttons[index], buttonLink: value }
        } else if (field === 'buttonText') {
            buttons[index] = {
                ...buttons[index],
                buttonText: value as unknown as ILocalizedText
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
                buttonText: value as unknown as ILocalizedText
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
                buttonText: value as unknown as ILocalizedText
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
    localApp: IAppConfig,
    section: ButtonSection,
    index: number,
    lang: keyof ILocalizedText,
    value: string,
    updateApp: (data: Partial<IAppConfig>) => void
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
