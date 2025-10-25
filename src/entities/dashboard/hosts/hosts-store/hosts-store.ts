import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    filters: {
        configProfileUuid: null,
        inboundUuid: null,
        hostTag: null
    }
}

export const useHostsStore = create<IActions & IState>()(
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
                setConfigProfileFilter: (configProfileUuid: null | string) => {
                    set((state) => ({
                        filters: { ...state.filters, configProfileUuid, inboundUuid: null }
                    }))
                },
                setInboundFilter: (inboundUuid: null | string) => {
                    set((state) => ({
                        filters: { ...state.filters, inboundUuid }
                    }))
                },
                resetFilters: () => {
                    set({ filters: { configProfileUuid: null, inboundUuid: null, hostTag: null } })
                },
                setHostTagFilter: (hostTag: null | string) => {
                    set((state) => ({
                        filters: { ...state.filters, hostTag }
                    }))
                }
            }
        }),
        {
            name: 'hostsStore',
            anonymousActionType: 'hostsStore'
        }
    )
)

export const useHostsStoreActions = () => useHostsStore((store) => store.actions)

export const useHostsStoreFilters = () => useHostsStore((state) => state.filters)

export const useHostsStoreConfigProfileFilter = () =>
    useHostsStore((state) => state.filters.configProfileUuid)

export const useHostsStoreInboundFilter = () => useHostsStore((state) => state.filters.inboundUuid)

export const useHostsStoreHostTagFilter = () => useHostsStore((state) => state.filters.hostTag)
