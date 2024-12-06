/* eslint-disable camelcase */
import {
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_PaginationState,
    MRT_SortingState
} from 'mantine-react-table'

export interface UsersTableFilters {
    filterModes: MRT_ColumnFilterFnsState
    filters: MRT_ColumnFiltersState
    size: number
    sorting: MRT_SortingState
    start: number
}
