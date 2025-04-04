/* eslint-disable camelcase */
import {
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
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
        setColumnVisibility: (
            visibility: ((prev: MRT_VisibilityState) => MRT_VisibilityState) | MRT_VisibilityState
        ) => void
        setShowColumnFilters: (show: ((prev: boolean) => boolean) | boolean) => void
    }
}
