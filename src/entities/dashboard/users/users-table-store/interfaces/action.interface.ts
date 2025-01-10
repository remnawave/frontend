/* eslint-disable camelcase */
import { MRT_ColumnPinningState, MRT_VisibilityState } from 'mantine-react-table'

export interface IActions {
    actions: {
        resetState: () => void
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
