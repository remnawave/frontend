import {
    GetAllUsersV2Command,
    GetBandwidthStatsCommand,
    GetInboundsCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'
import { devtools } from 'zustand/middleware'
import { AxiosError } from 'axios'

import { IInboundsHashMap } from '@entities/dashboard/dashboard-store/interfaces/inbounds-hash-map.interface'
import { getUserTimezoneUtil } from '@shared/utils/time-utils'
import { create } from '@shared/hocs/store-wrapper'
import { instance } from '@shared/api'

import { GetUsersV2Params } from './interfaces/get-users-v2.interface'
import { IActions, IState } from './interfaces'

const initialState: IState = {
    bandwidthStats: null,
    isLoading: false,
    isUsersLoading: false,
    systemInfo: null,
    inbounds: null,
    isInboundsLoading: false,
    inboundsHashMap: null
}

export const useDashboardStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getSystemInfo: async (): Promise<boolean> => {
                    try {
                        set({ isLoading: true })

                        const params: GetStatsCommand.Request = {
                            tz: getUserTimezoneUtil()
                        }

                        const response = await instance.get<GetStatsCommand.Response>(
                            GetStatsCommand.url,
                            {
                                params
                            }
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ systemInfo: dataResponse })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        set({ isLoading: false })
                    }
                },
                getBandwidthStats: async (): Promise<boolean> => {
                    try {
                        set({ isLoading: true })

                        const params: GetBandwidthStatsCommand.Request = {
                            tz: getUserTimezoneUtil()
                        }

                        const response = await instance.get<GetBandwidthStatsCommand.Response>(
                            GetBandwidthStatsCommand.url,
                            {
                                params
                            }
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ bandwidthStats: dataResponse })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        set({ isLoading: false })
                    }
                },
                getUsersV2: async (
                    params: GetUsersV2Params
                ): Promise<GetAllUsersV2Command.Response['response'] | null> => {
                    try {
                        const response = await instance.get<GetAllUsersV2Command.Response>(
                            GetAllUsersV2Command.url,
                            {
                                params
                            }
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        return dataResponse
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return null
                    }
                },
                getInbounds: async (): Promise<boolean> => {
                    try {
                        set({ isInboundsLoading: true })
                        const response = await instance.get<GetInboundsCommand.Response>(
                            GetInboundsCommand.url
                        )
                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ inbounds: dataResponse })

                        const inboundsHashMap = new Map<string, IInboundsHashMap>(
                            dataResponse.map((inbound) => [
                                inbound.uuid,
                                {
                                    tag: inbound.tag,
                                    type: inbound.type
                                }
                            ])
                        )

                        set({ inboundsHashMap })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        set({ isInboundsLoading: false })
                    }
                },
                getInitialState: () => {
                    return initialState
                },
                resetState: async () => {
                    set({ ...initialState })
                }
            }
        }),
        {
            name: 'dashboardStore',
            anonymousActionType: 'dashboardStore'
        }
    )
)

export const useDashboardStoreIsLoading = () => useDashboardStore((store) => store.isLoading)
export const useDashboardStoreUsersLoading = () =>
    useDashboardStore((store) => store.isUsersLoading)
export const useDashboardStoreSystemInfo = () => useDashboardStore((state) => state.systemInfo)
export const useDashboardStoreActions = () => useDashboardStore((store) => store.actions)

// Inbounds
export const useDSInbounds = () => useDashboardStore((state) => state.inbounds)
export const useDSInboundsLoading = () => useDashboardStore((state) => state.isInboundsLoading)
export const useDSInboundsHashMap = () => useDashboardStore((state) => state.inboundsHashMap)

// Bandwidth
export const useDSBandwidthStats = () => useDashboardStore((state) => state.bandwidthStats)
