import { BadgeVariant, ThemeIconVariant } from '@mantine/core'

type ExtendedThemeIconVariant =
    | 'gradient-blue'
    | 'gradient-cyan'
    | 'gradient-gray'
    | 'gradient-green'
    | 'gradient-indigo'
    | 'gradient-lime'
    | 'gradient-orange'
    | 'gradient-pink'
    | 'gradient-red'
    | 'gradient-teal'
    | 'gradient-violet'
    | 'gradient-yellow'
    | ThemeIconVariant

type ExtendedBadgeVariant =
    | 'gradient-blue'
    | 'gradient-cyan'
    | 'gradient-gray'
    | 'gradient-green'
    | 'gradient-indigo'
    | 'gradient-lime'
    | 'gradient-orange'
    | 'gradient-pink'
    | 'gradient-red'
    | 'gradient-teal'
    | 'gradient-violet'
    | 'gradient-yellow'
    | BadgeVariant

declare module '@mantine/core' {
    export interface ThemeIconProps {
        variant?: ExtendedThemeIconVariant
    }

    export interface BadgeProps {
        variant?: ExtendedBadgeVariant
    }
}
