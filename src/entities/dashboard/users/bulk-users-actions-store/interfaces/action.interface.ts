/* eslint-disable camelcase */

import { MRT_RowSelectionState } from 'mantine-react-table'

export interface IActions {
    actions: {
        getUuidLenght: () => number
        getUuids: () => string[]
        resetState: () => void
        setIsDrawerOpen: (isDrawerOpen: boolean) => void
        setTableSelection: (
            tableSelectionOrUpdater:
                | ((prev: MRT_RowSelectionState) => MRT_RowSelectionState)
                | MRT_RowSelectionState
        ) => void
    }
}
