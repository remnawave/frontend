/* eslint-disable camelcase */
import {
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_SortingState
} from '@kastov/mantine-react-table-open'

export interface UsersTableFilters {
    filterModes: MRT_ColumnFilterFnsState
    filters: MRT_ColumnFiltersState
    size: number
    sorting: MRT_SortingState
    start: number
}
