import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import {
    HOSTS_VIEW_MODE,
    IActions,
    INBOUNDS_VIEW_MODE,
    IState,
    LAYOUT_STYLE,
    NODES_VIEW_MODE
} from './interfaces'

const initialState: IState = {
    nodesViewMode: NODES_VIEW_MODE.CARDS,
    nodesActiveTag: null,
    hostsViewMode: HOSTS_VIEW_MODE.CARDS,
    hostsActiveTag: null,
    inboundsViewMode: INBOUNDS_VIEW_MODE.TABLE,
    layoutStyle: LAYOUT_STYLE.COMPACT
}

export const useViewPreferencesStore = create<IActions & IState>()(
    persist(
        devtools(
            (set) => ({
                ...initialState,
                actions: {
                    setNodesViewMode: (mode) => set({ nodesViewMode: mode }),
                    setNodesActiveTag: (tag) => set({ nodesActiveTag: tag }),
                    setHostsViewMode: (mode) => set({ hostsViewMode: mode }),
                    setHostsActiveTag: (tag) => set({ hostsActiveTag: tag }),
                    setInboundsViewMode: (mode) => set({ inboundsViewMode: mode }),
                    toggleLayoutStyle: () =>
                        set((state) => ({
                            layoutStyle:
                                state.layoutStyle === LAYOUT_STYLE.SIDEBAR
                                    ? LAYOUT_STYLE.COMPACT
                                    : LAYOUT_STYLE.SIDEBAR
                        })),
                    resetState: () => set({ ...initialState })
                }
            }),
            { name: 'viewPreferencesStore', anonymousActionType: 'viewPreferencesStore' }
        ),
        {
            name: 'viewPreferencesStore',
            version: 1,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                nodesViewMode: state.nodesViewMode,
                nodesActiveTag: state.nodesActiveTag,
                hostsViewMode: state.hostsViewMode,
                hostsActiveTag: state.hostsActiveTag,
                inboundsViewMode: state.inboundsViewMode,
                layoutStyle: state.layoutStyle
            }),
            migrate: () => initialState
        }
    )
)

export const useNodesViewMode = () => useViewPreferencesStore((state) => state.nodesViewMode)
export const useNodesActiveTag = () => useViewPreferencesStore((state) => state.nodesActiveTag)
export const useViewPreferencesStoreActions = () =>
    useViewPreferencesStore((state) => state.actions)
export const useHostsViewMode = () => useViewPreferencesStore((state) => state.hostsViewMode)
export const useHostsActiveTag = () => useViewPreferencesStore((state) => state.hostsActiveTag)
export const useInboundsViewMode = () => useViewPreferencesStore((state) => state.inboundsViewMode)
export const useLayoutStyle = () => useViewPreferencesStore((state) => state.layoutStyle)
export const useToggleLayoutStyleAction = () =>
    useViewPreferencesStore((state) => state.actions.toggleLayoutStyle)
