import { DataTableSortStatus } from 'mantine-datatable'

import { DataTableFilter } from '@/shared/ui/stuff/data-table/data-table-filters'
import { DataTableTabsProps } from '@/shared/ui/stuff/data-table/data-table-tabs'

export type DataTableReturn<SortableFields> = {
    readonly filters: {
        readonly change: (filter: Omit<DataTableFilter, 'onRemove'>) => void
        readonly clear: () => void
        readonly filters: Record<string, DataTableFilter>
        readonly query: Record<string, unknown>
        readonly remove: (name: string) => void
    }
    readonly sort: {
        readonly change: (status: DataTableSortStatus<SortableFields>) => void
        readonly column: keyof SortableFields
        readonly direction: 'asc' | 'desc'
        readonly query: `${string}:${'asc' | 'desc'}`
        readonly status: DataTableSortStatus<SortableFields>
    }
    readonly tabs: {
        readonly change: (value: string) => void
        readonly tabs: DataTableTabsProps['tabs']
        readonly value: string | undefined
    }
}
