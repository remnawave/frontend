import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'

export interface IState {
    desktopSidebarOpen: boolean
}

interface IActions {
    actions: {
        getInitialState: () => IState
        hideDesktopSidebar: () => void
        resetState: () => Promise<void>
        showDesktopSidebar: () => void
        toggleDesktopSidebar: () => void
    }
}

const initialState: IState = {
    desktopSidebarOpen: true
}

export const useAppshellStore = create<IActions & IState>()(
    devtools(
        (set) => ({
            ...initialState,
            actions: {
                getInitialState: () => {
                    return initialState
                },
                resetState: async () => {
                    set({ ...initialState })
                },
                toggleDesktopSidebar: () => {
                    set((state) => ({
                        desktopSidebarOpen: !state.desktopSidebarOpen
                    }))
                },
                hideDesktopSidebar: () => {
                    set({ desktopSidebarOpen: false })
                },
                showDesktopSidebar: () => {
                    set({ desktopSidebarOpen: true })
                }
            }
        }),
        {
            name: 'appshellStore',
            anonymousActionType: 'appshellStore'
        }
    )
)

export const useAppshellStoreActions = () => useAppshellStore((store) => store.actions)

export const useAppshellStoreDesktopSidebarOpen = () =>
    useAppshellStore((state) => state.desktopSidebarOpen)
