/* eslint-disable camelcase */
import { MRT_ColumnPinningState, MRT_VisibilityState } from 'mantine-react-table'

export interface IState {
    columnPinning: MRT_ColumnPinningState
    columnVisibility: MRT_VisibilityState
    showColumnFilters: boolean
}
