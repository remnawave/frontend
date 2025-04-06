/* eslint-disable camelcase */
import {
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
    MRT_VisibilityState
} from 'mantine-react-table'

export interface IState {
    columnFilter: MRT_ColumnFiltersState
    columnPinning: MRT_ColumnPinningState
    columnVisibility: MRT_VisibilityState
    showColumnFilters: boolean
}
