import type { ILauncherPosition, TQuickLink } from '@shared/ui/quick-launcher/quick-links.types'

import { HOSTS_VIEW_MODE, NODES_VIEW_MODE } from './enums'

export interface IExperimentalFeatures {
    legacyLayoutStyle: boolean
    quickLauncher: boolean
    nodeIntegrations: boolean
    sshTerminal: boolean
}

export interface IState {
    experimental: IExperimentalFeatures
    launcherPosition: ILauncherPosition | null
    launcherColumns: null | number
    quickLinks: TQuickLink[]
    hostsActiveTag: null | string
    hostsViewMode: HOSTS_VIEW_MODE
    nodesActiveTag: null | string
    nodesViewMode: NODES_VIEW_MODE
    sectionActiveTags: Record<string, null | string>
}
