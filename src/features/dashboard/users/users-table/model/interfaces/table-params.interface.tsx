/* eslint-disable camelcase */
import {
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_PaginationState,
    MRT_SortingState
} from 'mantine-react-table'

export interface TableParams {
    columnFilterFns: MRT_ColumnFilterFnsState
    columnFilters: MRT_ColumnFiltersState
    pagination: MRT_PaginationState
    sorting: MRT_SortingState
}
