import { defaultVariantColorsResolver, VariantColorsResolver } from '@mantine/core'

export const variantColorResolver: VariantColorsResolver = (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input)

    if (input.variant === 'gradient-cyan') {
        return {
            background:
                'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            color: 'var(--mantine-color-cyan-4)',
            hover: 'linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-teal') {
        return {
            background:
                'linear-gradient(135deg, rgba(18, 184, 134, 0.15) 0%, rgba(12, 166, 120, 0.1) 100%)',
            border: '1px solid rgba(18, 184, 134, 0.3)',
            color: 'var(--mantine-color-teal-4)',
            hover: 'linear-gradient(135deg, rgba(18, 184, 134, 0.25) 0%, rgba(12, 166, 120, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-violet') {
        return {
            background:
                'linear-gradient(135deg, rgba(151, 117, 250, 0.15) 0%, rgba(132, 94, 247, 0.1) 100%)',
            border: '1px solid rgba(151, 117, 250, 0.3)',
            color: 'var(--mantine-color-violet-4)',
            hover: 'linear-gradient(135deg, rgba(151, 117, 250, 0.25) 0%, rgba(132, 94, 247, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-yellow') {
        return {
            background:
                'linear-gradient(135deg, rgba(250, 176, 5, 0.15) 0%, rgba(245, 159, 0, 0.1) 100%)',
            border: '1px solid rgba(250, 176, 5, 0.3)',
            color: 'var(--mantine-color-yellow-4)',
            hover: 'linear-gradient(135deg, rgba(250, 176, 5, 0.25) 0%, rgba(245, 159, 0, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-blue') {
        return {
            background:
                'linear-gradient(135deg, rgba(34, 139, 230, 0.15) 0%, rgba(28, 126, 214, 0.1) 100%)',
            border: '1px solid rgba(34, 139, 230, 0.3)',
            color: 'var(--mantine-color-blue-4)',
            hover: 'linear-gradient(135deg, rgba(34, 139, 230, 0.25) 0%, rgba(28, 126, 214, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-red') {
        return {
            background:
                'linear-gradient(135deg, rgba(250, 82, 82, 0.15) 0%, rgba(224, 49, 49, 0.1) 100%)',
            border: '1px solid rgba(250, 82, 82, 0.3)',
            color: 'var(--mantine-color-red-4)',
            hover: 'linear-gradient(135deg, rgba(250, 82, 82, 0.25) 0%, rgba(224, 49, 49, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-gray') {
        return {
            background:
                'linear-gradient(135deg, rgba(128, 128, 128, 0.15) 0%, rgba(160, 160, 160, 0.1) 100%)',
            border: '1px solid rgba(128, 128, 128, 0.3)',
            color: 'var(--mantine-color-gray-6)',
            hover: 'linear-gradient(135deg, rgba(128, 128, 128, 0.25) 0%, rgba(160, 160, 160, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-green') {
        return {
            background:
                'linear-gradient(135deg, rgba(64, 192, 87, 0.15) 0%, rgba(55, 178, 77, 0.1) 100%)',
            border: '1px solid rgba(64, 192, 87, 0.3)',
            color: 'var(--mantine-color-green-4)',
            hover: 'linear-gradient(135deg, rgba(64, 192, 87, 0.25) 0%, rgba(55, 178, 77, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-orange') {
        return {
            background:
                'linear-gradient(135deg, rgba(255, 146, 43, 0.15) 0%, rgba(253, 126, 20, 0.1) 100%)',
            border: '1px solid rgba(255, 146, 43, 0.3)',
            color: 'var(--mantine-color-orange-4)',
            hover: 'linear-gradient(135deg, rgba(255, 146, 43, 0.25) 0%, rgba(253, 126, 20, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-pink') {
        return {
            background:
                'linear-gradient(135deg, rgba(250, 82, 82, 0.15) 0%, rgba(224, 49, 49, 0.1) 100%)',
            border: '1px solid rgba(250, 82, 82, 0.3)',
            color: 'var(--mantine-color-pink-4)',
            hover: 'linear-gradient(135deg, rgba(250, 82, 82, 0.25) 0%, rgba(224, 49, 49, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-indigo') {
        return {
            background:
                'linear-gradient(135deg, rgba(151, 117, 250, 0.15) 0%, rgba(132, 94, 247, 0.1) 100%)',
            border: '1px solid rgba(151, 117, 250, 0.3)',
            color: 'var(--mantine-color-indigo-4)',
            hover: 'linear-gradient(135deg, rgba(151, 117, 250, 0.25) 0%, rgba(132, 94, 247, 0.2) 100%)'
        }
    }

    if (input.variant === 'gradient-lime') {
        return {
            background:
                'linear-gradient(135deg, rgba(64, 192, 87, 0.15) 0%, rgba(55, 178, 77, 0.1) 100%)',
            border: '1px solid rgba(64, 192, 87, 0.3)',
            color: 'var(--mantine-color-lime-4)',
            hover: 'linear-gradient(135deg, rgba(64, 192, 87, 0.25) 0%, rgba(55, 178, 77, 0.2) 100%)'
        }
    }

    return defaultResolvedColors
}
