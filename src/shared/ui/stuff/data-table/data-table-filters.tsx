import { forwardRef } from 'react'

import { Button, CardSection, Group, Pill, Text, type GroupProps } from '@mantine/core'
import { PiTrashBold as ClearIcon } from 'react-icons/pi'

type FilterValue = string | number | boolean

export interface DataTableFilter {
    name: string
    label: string
    value?: FilterValue | FilterValue[]
    valueLabel?: string | string[]
    onRemove: () => void
}

export interface DataTableFiltersProps extends Omit<GroupProps, 'children'> {
    filters: Record<string, DataTableFilter>
    onClear?: () => void
}

export const DataTableFilters = forwardRef<HTMLDivElement, DataTableFiltersProps>(
    ({ filters, onClear, py = 'md', ...props }, ref) => {
        const filtersArray = Object.entries(filters)

        if (filtersArray.length === 0) {
            return null
        }

        return (
            <CardSection inheritPadding withBorder ref={ref}>
                <Group py={py} {...props}>
                    {filtersArray.map(([name, filter]) => {
                        const label = filter.valueLabel || filter.value

                        return (
                            <Text fz="sm" c="dimmed" key={name}>
                                {filter.label}:
                                <Pill ml="0.25rem" withRemoveButton onRemove={filter.onRemove}>
                                    {Array.isArray(label) ? label.join(', ') : label}
                                </Pill>
                            </Text>
                        )
                    })}

                    {onClear && (
                        <Button
                            variant="subtle"
                            size="compact-xs"
                            color="red"
                            leftSection={<ClearIcon size="1rem" />}
                            onClick={onClear}
                        >
                            Clear
                        </Button>
                    )}
                </Group>
            </CardSection>
        )
    }
)
