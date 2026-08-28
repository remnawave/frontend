import type { INodeOrder, ISavedConnection } from './saved-connections.overlay'

import { useMemo } from 'react'

import type { IConnectionProfile } from '@entities/ssh-vault'

import { useSshActiveTabId, useSshStatuses, useSshTabs } from '../tabs/ssh-tabs.store'
import { buildSavedConnections } from './saved-connections.overlay'

export function useSavedConnections(
    nodes: INodeOrder[] | undefined,
    profiles: IConnectionProfile[] | null
): ISavedConnection[] | null {
    const tabs = useSshTabs()
    const activeId = useSshActiveTabId()
    const statuses = useSshStatuses()

    return useMemo(() => {
        if (!profiles) return null

        return buildSavedConnections(
            nodes ?? [],
            profiles,
            activeId,
            Object.fromEntries(tabs.map((tab) => [tab.id, Boolean(statuses[tab.id]?.isConnected)]))
        )
    }, [nodes, profiles, activeId, tabs, statuses])
}
