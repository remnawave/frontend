import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { IActions, IState } from './interfaces'

export const useMiscStore = create<IActions & IState>()(
    persist(
        devtools(
            (set) => ({
                mobileWarningClosed: false,
                actions: {
                    setMobileWarningClosed: (closed: boolean) => {
                        set({ mobileWarningClosed: closed })
                    },
                    setSrrAdvancedModalClosed: (closed: boolean) => {
                        set({ srrAdvancedModalClosed: closed })
                    }
                }
            }),
            { name: 'miscStore', anonymousActionType: 'miscStore' }
        ),
        {
            name: 'miscStore',
            partialize: (state) => ({
                mobileWarningClosed: state.mobileWarningClosed,
                srrAdvancedModalClosed: state.srrAdvancedModalClosed
            }),
            migrate: (persistedState: unknown, version: number) => {
                if (version === 1) {
                    return {
                        mobileWarningClosed:
                            (persistedState as IState).mobileWarningClosed ?? false,
                        srrAdvancedModalClosed: false
                    }
                }
                return persistedState
            },
            storage: createJSONStorage(() => localStorage),
            version: 2
        }
    )
)

export const useMobileWarningClosed = () => useMiscStore((state) => state.mobileWarningClosed)
export const useSrrAdvancedModalClosed = () => useMiscStore((state) => state.srrAdvancedModalClosed)
export const useMiscStoreActions = () => useMiscStore((state) => state.actions)
