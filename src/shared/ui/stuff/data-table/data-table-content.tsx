import { CardSection, CardSectionProps, ElementProps } from '@mantine/core'
import { forwardRef } from 'react'

export const DataTableContent = forwardRef<
    HTMLDivElement,
    CardSectionProps & ElementProps<'div', keyof CardSectionProps>
>(({ children }, ref) => <CardSection ref={ref}>{children}</CardSection>)
