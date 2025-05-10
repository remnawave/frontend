/* eslint-disable camelcase */
import {
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
    MRT_ColumnSizingState,
    MRT_PaginationState,
    MRT_VisibilityState
} from 'mantine-react-table'

export interface IState {
    columnFilter: MRT_ColumnFiltersState
    columnPinning: MRT_ColumnPinningState
    columnSize: MRT_ColumnSizingState
    columnVisibility: MRT_VisibilityState
    paginationState: MRT_PaginationState
    showColumnFilters: boolean
}
