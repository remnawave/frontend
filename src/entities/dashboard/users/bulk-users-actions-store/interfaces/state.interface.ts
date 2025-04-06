/* eslint-disable camelcase */
import { MRT_RowSelectionState } from 'mantine-react-table'

export interface IState {
    isDrawerOpen: boolean
    tableSelection: MRT_RowSelectionState
    uuids: string[]
}
