import {
    alpha,
    ElementProps,
    RingProgress,
    RingProgressProps,
    Text,
    TextProps
} from '@mantine/core'

import { match } from '@shared/utils/misc'

interface MetricRingProgressProps
    extends ElementProps<'div', keyof RingProgressProps>,
        Omit<RingProgressProps, 'label' | 'rootColor'> {
    baseColor?: string
    label?: string
    labelProps?: Omit<TextProps, 'fw' | 'ta'>
}

export function MetricCardRingProgress({
    label,
    baseColor,
    labelProps,
    sections,
    ...props
}: MetricRingProgressProps) {
    const color = match(
        [!!baseColor, alpha(baseColor!, 0.1)],
        [sections.length === 1, alpha(sections[0].color, 0.1)],
        [true, alpha('var(--rp-curve-root-color)', 0.6)]
    )

    return (
        <RingProgress
            label={
                <Text fw={700} ta="center" {...labelProps}>
                    {label}
                </Text>
            }
            rootColor={color}
            sections={sections}
            {...props}
        />
    )
}
