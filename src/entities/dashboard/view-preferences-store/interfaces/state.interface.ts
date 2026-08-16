import { HOSTS_VIEW_MODE, LAYOUT_STYLE, NODES_VIEW_MODE } from './enums'

export interface IState {
    hostsActiveTag: null | string
    hostsViewMode: HOSTS_VIEW_MODE
    nodesActiveTag: null | string
    nodesViewMode: NODES_VIEW_MODE
    layoutStyle: LAYOUT_STYLE
}
