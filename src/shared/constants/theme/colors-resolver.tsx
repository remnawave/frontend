import {
    defaultVariantColorsResolver,
    parseThemeColor,
    rgba,
    VariantColorsResolver
} from '@mantine/core'

export const variantColorResolver: VariantColorsResolver = (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input)

    if (input.variant === 'soft') {
        const parsed = parseThemeColor({
            color: input.color || 'gray',
            theme: input.theme,
            colorScheme: 'dark'
        })
        const c1 = input.theme.colors[parsed.color][6]
        const c2 = input.theme.colors[parsed.color][7]
        return {
            background: `linear-gradient(135deg, ${rgba(c1, 0.15)} 0%, ${rgba(c2, 0.1)} 100%)`,
            border: `1px solid ${rgba(c1, 0.3)}`,
            color: `var(--mantine-color-${parsed.color}-4)`,
            hover: `linear-gradient(135deg, ${rgba(c1, 0.25)} 0%, ${rgba(c2, 0.2)} 100%)`
        }
    }

    return defaultResolvedColors
}
