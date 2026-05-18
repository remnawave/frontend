/* eslint-disable camelcase */
import { MRT_RowSelectionState } from '@kastov/mantine-react-table-open'

export interface IState {
    isDrawerOpen: boolean
    tableSelection: MRT_RowSelectionState
    uuids: string[]
}
