import {
    ActionIconVariant,
    BadgeVariant,
    DefaultMantineColor,
    MantineColorsTuple,
    ThemeIconVariant
} from '@mantine/core'

type ExtendedThemeIconVariant = 'soft' | ThemeIconVariant
type ExtendedActionIconVariant = 'soft' | ActionIconVariant
type ExtendedBadgeVariant = 'soft' | BadgeVariant
type ExtendedCustomColors = 'shaded-gray' | DefaultMantineColor

declare module '@mantine/core' {
    export interface ThemeIconProps {
        variant?: ExtendedThemeIconVariant
    }

    export interface BadgeProps {
        variant?: ExtendedBadgeVariant
    }

    export interface ActionIconProps {
        variant?: ExtendedActionIconVariant
    }

    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>
    }
}
