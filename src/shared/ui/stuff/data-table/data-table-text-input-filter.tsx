import { TextInput, type TextInputProps } from '@mantine/core'

import type { UseDataTableReturn } from './use-data-table'

interface DataTableTextInputFilterProps
    extends Omit<TextInputProps, 'onChange' | 'value'>,
        Pick<UseDataTableReturn, 'filters'> {
    label: string
    name: string
}

export function DataTableTextInputFilter({
    name,
    label,
    filters,
    ...props
}: DataTableTextInputFilterProps) {
    return (
        <TextInput
            {...props}
            onChange={(e) => filters.change({ name, label, value: e.currentTarget.value })}
            value={filters.filters[name]?.value as string}
        />
    )
}
