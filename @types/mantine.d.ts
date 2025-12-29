import { ThemeIconVariant } from '@mantine/core'

type ExtendedThemeIconVariant =
    | 'gradient-blue'
    | 'gradient-cyan'
    | 'gradient-gray'
    | 'gradient-red'
    | 'gradient-teal'
    | 'gradient-violet'
    | 'gradient-yellow'
    | ThemeIconVariant

declare module '@mantine/core' {
    export interface ThemeIconProps {
        variant?: ExtendedThemeIconVariant
    }
}
