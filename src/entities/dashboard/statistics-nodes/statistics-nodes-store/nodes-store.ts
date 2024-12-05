import { GetNodesStatisticsCommand } from '@remnawave/backend-contract'
import { devtools } from 'zustand/middleware'
import { AxiosError } from 'axios'

import { create } from '@shared/hocs/store-wrapper'
import { instance } from '@shared/api'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    isNodeStatsLoading: false,
    nodesStats: null
}

export const useStatisticsNodesStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getNodesStats: async (): Promise<boolean> => {
                    try {
                        set({ isNodeStatsLoading: true })

                        const response = await instance.get<GetNodesStatisticsCommand.Response>(
                            GetNodesStatisticsCommand.url
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({
                            nodesStats: dataResponse
                        })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        setTimeout(() => {
                            set({ isNodeStatsLoading: false })
                        }, 300)
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
            name: 'nodesStore',
            anonymousActionType: 'nodesStore'
        }
    )
)

export const useStatisticsNodesStoreIsNodeStatsLoading = () =>
    useStatisticsNodesStore((store) => store.isNodeStatsLoading)
export const useStatisticsNodesStoreNodesStats = () =>
    useStatisticsNodesStore((state) => state.nodesStats)
export const useStatisticsNodesStoreActions = () =>
    useStatisticsNodesStore((store) => store.actions)
