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
                    }
                }
            }),
            { name: 'miscStore', anonymousActionType: 'miscStore' }
        ),
        {
            name: 'miscStore',
            partialize: (state) => ({
                mobileWarningClosed: state.mobileWarningClosed
            }),
            storage: createJSONStorage(() => localStorage),
            version: 1
        }
    )
)

export const useMobileWarningClosed = () => useMiscStore((state) => state.mobileWarningClosed)
export const useMiscStoreActions = () => useMiscStore((state) => state.actions)
