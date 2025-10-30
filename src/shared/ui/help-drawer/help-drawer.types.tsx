export const HELP_DRAWER_AVAILABLE_SCREENS = {
    TEMPLATES_JSON: 'TEMPLATES_JSON'
} as const

export type THelpDrawerAvailableScreen =
    (typeof HELP_DRAWER_AVAILABLE_SCREENS)[keyof typeof HELP_DRAWER_AVAILABLE_SCREENS]
