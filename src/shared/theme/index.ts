import { createTheme } from '@mantine/core'
import components from './overrides'

export const theme = createTheme({
    components,
    cursorType: 'pointer',
    fontFamily: 'Inter, sans-serif',
    breakpoints: {
        xs: '30em',
        sm: '40em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        '3xl': '120em',
        '4xl': '160em'
    },
    colors: {
        dark: [
            '#A3B3C9',
            '#8494AD',
            '#677A96',
            '#4B5D7A',
            '#364563',
            '#252F47',
            '#1A2437',
            '#111827',
            '#0A101C',
            '#050913'
        ]
    }
})
