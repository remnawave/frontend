import {
    alpha,
    ElementProps,
    RingProgress,
    RingProgressProps,
    Text,
    TextProps,
} from '@mantine/core';
import { match } from '@/shared/utils/match';

interface MetricRingProgressProps
    extends Omit<RingProgressProps, 'label' | 'rootColor'>,
        ElementProps<'div', keyof RingProgressProps> {
    label?: string;
    labelProps?: Omit<TextProps, 'ta' | 'fw'>;
    baseColor?: string;
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
    );

    return (
        <RingProgress
            rootColor={color}
            sections={sections}
            label={
                <Text fw={700} ta="center" {...labelProps}>
                    {label}
                </Text>
            }
            {...props}
        />
    );
}
