/* eslint-disable no-use-before-define */
import { Button, CardSection, Group, type GroupProps, Pill, Text } from '@mantine/core'
import { PiTrashBold as ClearIcon } from 'react-icons/pi'
import { forwardRef } from 'react'

export interface DataTableFilter {
    label: string
    name: string
    onRemove: () => void
    value?: FilterValue | FilterValue[]
    valueLabel?: string | string[]
}

export interface DataTableFiltersProps extends Omit<GroupProps, 'children'> {
    filters: Record<string, DataTableFilter>
    onClear?: () => void
}

type FilterValue = boolean | number | string

export const DataTableFilters = forwardRef<HTMLDivElement, DataTableFiltersProps>(
    ({ filters, onClear, py = 'md', ...props }, ref) => {
        const filtersArray = Object.entries(filters)

        if (filtersArray.length === 0) {
            return null
        }

        return (
            <CardSection inheritPadding ref={ref} withBorder>
                <Group py={py} {...props}>
                    {filtersArray.map(([name, filter]) => {
                        const label = filter.valueLabel || filter.value

                        return (
                            <Text c="dimmed" fz="sm" key={name}>
                                {filter.label}:
                                <Pill ml="0.25rem" onRemove={filter.onRemove} withRemoveButton>
                                    {Array.isArray(label) ? label.join(', ') : label}
                                </Pill>
                            </Text>
                        )
                    })}

                    {onClear && (
                        <Button
                            color="red"
                            leftSection={<ClearIcon size="1rem" />}
                            onClick={onClear}
                            size="compact-xs"
                            variant="subtle"
                        >
                            Clear
                        </Button>
                    )}
                </Group>
            </CardSection>
        )
    }
)
