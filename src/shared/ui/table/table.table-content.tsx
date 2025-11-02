import { CardSection, CardSectionProps, ElementProps } from '@mantine/core'
import { forwardRef } from 'react'

export const DataTableContent = forwardRef<
    HTMLDivElement,
    CardSectionProps & ElementProps<'div', keyof CardSectionProps>
>(({ children }, ref) => (
    <CardSection bg="var(--mantine-color-body)" ref={ref}>
        {children}
    </CardSection>
))
