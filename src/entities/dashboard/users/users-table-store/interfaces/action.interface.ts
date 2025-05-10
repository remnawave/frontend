/* eslint-disable camelcase */
import {
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
    MRT_ColumnSizingState,
    MRT_PaginationState,
    MRT_VisibilityState
} from 'mantine-react-table'

export interface IActions {
    actions: {
        resetState: () => void
        setColumnFilter: (
            filter:
                | ((prev: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)
                | MRT_ColumnFiltersState
        ) => void
        setColumnPinning: (
            pinning:
                | ((prev: MRT_ColumnPinningState) => MRT_ColumnPinningState)
                | MRT_ColumnPinningState
        ) => void
        setColumnSize: (
            size: ((prev: MRT_ColumnSizingState) => MRT_ColumnSizingState) | MRT_ColumnSizingState
        ) => void
        setColumnVisibility: (
            visibility: ((prev: MRT_VisibilityState) => MRT_VisibilityState) | MRT_VisibilityState
        ) => void
        setPaginationState: (
            pagination: ((prev: MRT_PaginationState) => MRT_PaginationState) | MRT_PaginationState
        ) => void
        setShowColumnFilters: (show: ((prev: boolean) => boolean) | boolean) => void
    }
}
