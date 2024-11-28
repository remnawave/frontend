import { DataTableSortStatus } from 'mantine-datatable'
import { DataTableFilter } from '@/shared/ui/stuff/data-table/data-table-filters'
import { DataTableTabsProps } from '@/shared/ui/stuff/data-table/data-table-tabs'

export type DataTableReturn<SortableFields> = {
    readonly tabs: {
        readonly value: string | undefined
        readonly change: (value: string) => void
        readonly tabs: DataTableTabsProps['tabs']
    }
    readonly filters: {
        readonly filters: Record<string, DataTableFilter>
        readonly clear: () => void
        readonly change: (filter: Omit<DataTableFilter, 'onRemove'>) => void
        readonly remove: (name: string) => void
        readonly query: Record<string, unknown>
    }
    readonly sort: {
        readonly change: (status: DataTableSortStatus<SortableFields>) => void
        readonly column: keyof SortableFields
        readonly direction: 'asc' | 'desc'
        readonly status: DataTableSortStatus<SortableFields>
        readonly query: `${string}:${'asc' | 'desc'}`
    }
}
