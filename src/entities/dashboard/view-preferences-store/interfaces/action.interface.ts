import { CONFIG_PROFILES_VIEW_MODE, NODES_VIEW_MODE } from './enums'

export interface IActions {
    actions: {
        resetState: () => void
        setConfigProfilesViewMode: (mode: CONFIG_PROFILES_VIEW_MODE) => void
        setNodesViewMode: (mode: NODES_VIEW_MODE) => void
    }
}
