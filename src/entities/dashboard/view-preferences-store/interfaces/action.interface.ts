import type { ILauncherPosition, TQuickLink } from '@shared/ui/quick-launcher/quick-links.types'

import { HOSTS_VIEW_MODE, NODES_VIEW_MODE } from './enums'
import { IExperimentalFeatures } from './state.interface'

export interface IActions {
    actions: {
        resetState: () => void
        setExperimentalFeature: (feature: keyof IExperimentalFeatures, enabled: boolean) => void
        setHostsActiveTag: (tag: null | string) => void
        setLauncherPosition: (position: ILauncherPosition) => void
        setLauncherColumns: (columns: null | number) => void
        setHostsViewMode: (mode: HOSTS_VIEW_MODE) => void
        setNodesActiveTag: (tag: null | string) => void
        setNodesViewMode: (mode: NODES_VIEW_MODE) => void
        setQuickLinks: (links: TQuickLink[]) => void
        setSectionActiveTag: (section: string, tag: null | string) => void
    }
}
