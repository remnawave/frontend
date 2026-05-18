/* eslint-disable camelcase */

import { MRT_RowSelectionState } from '@kastov/mantine-react-table-open'

export interface IActions {
    actions: {
        getUuidLength: () => number
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
