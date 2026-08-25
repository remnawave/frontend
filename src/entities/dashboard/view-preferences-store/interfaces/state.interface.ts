import { HOSTS_VIEW_MODE, NODES_VIEW_MODE } from './enums'

export interface IExperimentalFeatures {
    legacyLayoutStyle: boolean
    nodeIntegrations: boolean
    sshTerminal: boolean
}

export interface IState {
    experimental: IExperimentalFeatures
    hostsActiveTag: null | string
    hostsViewMode: HOSTS_VIEW_MODE
    nodesActiveTag: null | string
    nodesViewMode: NODES_VIEW_MODE
}
