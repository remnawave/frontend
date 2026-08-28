import type { ISshSessionHandle, ISshSessionStatus, ISshTab } from '../ssh-terminal.types'

import { GetNodeCommand } from '@remnawave/backend-contract'
import { createContext, use } from 'react'
import { createStore, useStore } from 'zustand'

export const MAX_TABS = 10

export type TOpenTabResult = 'focused' | 'opened' | 'rejected'

interface IState {
    activeId: string
    statuses: Record<string, ISshSessionStatus | undefined>
    tabs: ISshTab[]
}

interface IActions {
    actions: {
        closeTab: (id: string) => void
        dropSessions: () => void
        getHandle: (id: string) => ISshSessionHandle | undefined
        getStatuses: () => Record<string, ISshSessionStatus | undefined>
        openTab: (node: GetNodeCommand.Response['response']) => TOpenTabResult
        registerHandle: (id: string, handle: ISshSessionHandle | null) => void
        selectTab: (id: string) => void
        setStatus: (id: string, status: ISshSessionStatus) => void
    }
}

export type TSshTabsStore = ReturnType<typeof createSshTabsStore>

export function createSshTabsStore(initial?: GetNodeCommand.Response['response']) {
    const handles = new Map<string, ISshSessionHandle>()

    return createStore<IActions & IState>()((set, get) => ({
        activeId: initial?.uuid ?? '',
        statuses: {},
        tabs: initial ? [{ id: initial.uuid, node: initial }] : [],

        actions: {
            closeTab: (id) => {
                handles.delete(id)

                const { activeId, statuses, tabs } = get()
                const index = tabs.findIndex((tab) => tab.id === id)
                const rest = tabs.filter((tab) => tab.id !== id)

                set({
                    activeId:
                        id === activeId
                            ? ((rest[index] ?? rest[index - 1] ?? rest[0])?.id ?? '')
                            : activeId,
                    statuses: { ...statuses, [id]: undefined },
                    tabs: rest
                })
            },

            dropSessions: () => {
                for (const handle of handles.values()) handle.showSettings()

                handles.clear()
                set({ activeId: '', statuses: {}, tabs: [] })
            },

            getHandle: (id) => handles.get(id),

            getStatuses: () => get().statuses,

            openTab: (node) => {
                const { tabs } = get()

                if (tabs.some((tab) => tab.id === node.uuid)) {
                    set({ activeId: node.uuid })

                    return 'focused'
                }

                if (tabs.length >= MAX_TABS) return 'rejected'

                set({ activeId: node.uuid, tabs: [...tabs, { id: node.uuid, node }] })

                return 'opened'
            },

            registerHandle: (id, handle) => {
                if (handle) handles.set(id, handle)
                else handles.delete(id)
            },

            selectTab: (id) => set({ activeId: id }),

            setStatus: (id, status) => set({ statuses: { ...get().statuses, [id]: status } })
        }
    }))
}

const SshTabsContext = createContext<null | TSshTabsStore>(null)

export const SshTabsProvider = SshTabsContext.Provider

export function useSshTabsStore<T>(selector: (state: IActions & IState) => T): T {
    const store = use(SshTabsContext)

    if (!store) throw new Error('useSshTabsStore must be used inside the SSH window')

    return useStore(store, selector)
}

export const useSshTabsActions = () => useSshTabsStore((state) => state.actions)
export const useSshTabs = () => useSshTabsStore((state) => state.tabs)
export const useSshActiveTabId = () => useSshTabsStore((state) => state.activeId)
export const useSshStatuses = () => useSshTabsStore((state) => state.statuses)
export const useSshActiveStatus = () => useSshTabsStore((state) => state.statuses[state.activeId])
