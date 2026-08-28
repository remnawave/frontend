import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import {
    DEFAULT_QUICK_LINKS,
    sanitizeLauncherColumns,
    sanitizeLauncherPosition,
    sanitizeQuickLinks
} from '@shared/ui/quick-launcher/quick-links.types'

import {
    HOSTS_VIEW_MODE,
    IActions,
    IExperimentalFeatures,
    IState,
    NODES_VIEW_MODE
} from './interfaces'

const LEGACY_LAYOUT_STYLE = 'sidebar'

const initialExperimental: IExperimentalFeatures = {
    legacyLayoutStyle: false,
    quickLauncher: false,
    nodeIntegrations: false,
    sshTerminal: false
}

const initialState: IState = {
    experimental: initialExperimental,
    launcherPosition: null,
    launcherColumns: null,
    quickLinks: DEFAULT_QUICK_LINKS,
    nodesViewMode: NODES_VIEW_MODE.CARDS,
    nodesActiveTag: null,
    hostsViewMode: HOSTS_VIEW_MODE.CARDS,
    hostsActiveTag: null,
    sectionActiveTags: {}
}

type PersistedState = IState & { layoutStyle?: string }

const migrateState = (persistedState: unknown, version: number): IState => {
    const { layoutStyle, ...state } = (persistedState ?? {}) as Partial<PersistedState>

    if (version >= 2) {
        return { ...initialState, ...state }
    }

    return {
        ...initialState,
        ...state,
        experimental: {
            ...initialExperimental,
            ...state.experimental,
            legacyLayoutStyle: layoutStyle === LEGACY_LAYOUT_STYLE
        }
    }
}

export const useViewPreferencesStore = create<IActions & IState>()(
    persist(
        devtools(
            (set) => ({
                ...initialState,
                actions: {
                    setNodesViewMode: (mode) => set({ nodesViewMode: mode }),
                    setSectionActiveTag: (section, tag) =>
                        set((state) => ({
                            sectionActiveTags: { ...state.sectionActiveTags, [section]: tag }
                        })),
                    setNodesActiveTag: (tag) => set({ nodesActiveTag: tag }),
                    setHostsViewMode: (mode) => set({ hostsViewMode: mode }),
                    setHostsActiveTag: (tag) => set({ hostsActiveTag: tag }),
                    setLauncherPosition: (position) => set({ launcherPosition: position }),
                    setLauncherColumns: (columns) => set({ launcherColumns: columns }),
                    setQuickLinks: (links) => set({ quickLinks: sanitizeQuickLinks(links) }),
                    setExperimentalFeature: (feature, enabled) =>
                        set((state) => ({
                            experimental: { ...state.experimental, [feature]: enabled }
                        })),
                    resetState: () => set({ ...initialState })
                }
            }),
            { name: 'viewPreferencesStore', anonymousActionType: 'viewPreferencesStore' }
        ),
        {
            name: 'viewPreferencesStore',
            version: 2,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                experimental: state.experimental,
                launcherPosition: state.launcherPosition,
                launcherColumns: state.launcherColumns,
                quickLinks: state.quickLinks,
                nodesViewMode: state.nodesViewMode,
                nodesActiveTag: state.nodesActiveTag,
                hostsViewMode: state.hostsViewMode,
                hostsActiveTag: state.hostsActiveTag,
                sectionActiveTags: state.sectionActiveTags
            }),
            migrate: migrateState,
            merge: (persistedState, currentState) => {
                const state = (persistedState ?? {}) as Partial<IState>

                return {
                    ...currentState,
                    ...state,
                    experimental: { ...currentState.experimental, ...state.experimental },
                    launcherColumns: sanitizeLauncherColumns(state.launcherColumns),
                    launcherPosition: sanitizeLauncherPosition(state.launcherPosition),
                    quickLinks: state.quickLinks
                        ? sanitizeQuickLinks(state.quickLinks)
                        : currentState.quickLinks
                }
            }
        }
    )
)

export const useNodesViewMode = () => useViewPreferencesStore((state) => state.nodesViewMode)
export const useNodesActiveTag = () => useViewPreferencesStore((state) => state.nodesActiveTag)
export const useViewPreferencesStoreActions = () =>
    useViewPreferencesStore((state) => state.actions)
export const useHostsViewMode = () => useViewPreferencesStore((state) => state.hostsViewMode)
export const useHostsActiveTag = () => useViewPreferencesStore((state) => state.hostsActiveTag)
export const useLauncherPosition = () => useViewPreferencesStore((state) => state.launcherPosition)
export const useLauncherColumns = () => useViewPreferencesStore((state) => state.launcherColumns)
export const useQuickLinks = () => useViewPreferencesStore((state) => state.quickLinks)

export const useSectionActiveTag = (section: string) =>
    useViewPreferencesStore((state) => state.sectionActiveTags[section] ?? null)
export const useExperimentalFeatures = () => useViewPreferencesStore((state) => state.experimental)
export const useExperimentalFeature = (feature: keyof IExperimentalFeatures) =>
    useViewPreferencesStore((state) => state.experimental[feature])
