import { HOSTS_VIEW_MODE, INBOUNDS_VIEW_MODE, NODES_VIEW_MODE } from './enums'

export interface IActions {
    actions: {
        resetState: () => void
        setHostsActiveTag: (tag: null | string) => void
        setHostsViewMode: (mode: HOSTS_VIEW_MODE) => void
        setNodesActiveTag: (tag: null | string) => void
        setNodesViewMode: (mode: NODES_VIEW_MODE) => void
        setInboundsViewMode: (mode: INBOUNDS_VIEW_MODE) => void
        toggleLayoutStyle: () => void
    }
}
