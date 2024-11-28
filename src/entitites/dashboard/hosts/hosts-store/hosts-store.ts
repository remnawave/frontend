import { GetAllHostsCommand, ReorderHostCommand } from '@remnawave/backend-contract'
import { instance } from '@shared/api'
import { AxiosError } from 'axios'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IActions, IState } from './interfaces'

const initialState: IState = {
    isHostsLoading: false,
    hosts: null
}

export const useDashboardStore = create<IState & IActions>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getHosts: async (): Promise<boolean> => {
                    try {
                        set({ isHostsLoading: true })

                        const response = await instance.get<GetAllHostsCommand.Response>(
                            GetAllHostsCommand.url
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({
                            hosts: dataResponse
                        })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        set({ isHostsLoading: false })
                    }
                },
                reorderHosts: async (
                    hosts: ReorderHostCommand.Request['hosts']
                ): Promise<boolean> => {
                    try {
                        set({ isHostsLoading: true })

                        const response = await instance.post<ReorderHostCommand.Response>(
                            ReorderHostCommand.url,
                            {
                                hosts
                            }
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        if (dataResponse.isUpdated) {
                            return true
                        }

                        return false
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        set({ isHostsLoading: false })
                    }
                },

                resetState: async () => {
                    set({ ...initialState })
                }
            }
        }),
        {
            name: 'hostsStore',
            anonymousActionType: 'hostsStore'
        }
    )
)

export const useHostsStoreIsLoading = () => useDashboardStore((store) => store.isHostsLoading)
export const useHostsStoreHosts = () => useDashboardStore((state) => state.hosts)
export const useHostsStoreActions = () => useDashboardStore((store) => store.actions)
