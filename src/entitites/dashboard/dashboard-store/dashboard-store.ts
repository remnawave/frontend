import {
    GetAllUsersCommand,
    GetInboundsCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'
import { instance } from '@shared/api'
import { create } from '@shared/hocs/store-wrapper'
import { AxiosError } from 'axios'
import { devtools } from 'zustand/middleware'
import { IInboundsHashMap } from '@/entitites/dashboard/dashboard-store/interfaces/inbounds-hash-map.interface'
import { getUserTimezoneUtil } from '@/shared/utils/time-utils'
import { IActions, IState, IUsersParams } from './interfaces'

const initialState: IState = {
    isLoading: false,
    isUsersLoading: false,
    systemInfo: null,
    users: null,
    usersParams: {
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
        orderDir: 'desc'
    },
    totalUsers: 0,
    inbounds: null,
    isInboundsLoading: false,
    inboundsHashMap: null
}

export const useDashboardStore = create<IState & IActions>()(
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
                getUsers: async (params?: Partial<IUsersParams>): Promise<boolean> => {
                    try {
                        set({ isUsersLoading: true })
                        const currentParams = getState().usersParams
                        const newParams = { ...currentParams, ...params }

                        const response = await instance.get<GetAllUsersCommand.Response>(
                            GetAllUsersCommand.url,
                            {
                                params: {
                                    limit: newParams.limit,
                                    offset: newParams.offset,
                                    orderBy: newParams.orderBy,
                                    orderDir: newParams.orderDir,
                                    search: newParams.search,
                                    searchBy: newParams.searchBy
                                }
                            }
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({
                            users: dataResponse.users,
                            totalUsers: dataResponse.total,
                            usersParams: newParams
                        })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        set({ isUsersLoading: false })
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
                    console.log('resetState')
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
export const useDashboardStoreUsers = () => useDashboardStore((state) => state.users)
export const useDashboardStoreTotalUsers = () => useDashboardStore((state) => state.totalUsers)
export const useDashboardStoreParams = () => useDashboardStore((state) => state.usersParams)

// Inbounds
export const useDSInbounds = () => useDashboardStore((state) => state.inbounds)
export const useDSInboundsLoading = () => useDashboardStore((state) => state.isInboundsLoading)
export const useDSInboundsHashMap = () => useDashboardStore((state) => state.inboundsHashMap)
