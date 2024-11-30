import { AxiosError } from 'axios'
import { instance } from '@shared/api'
import { devtools } from 'zustand/middleware'
import { create } from '@shared/hocs/store-wrapper'
import { GetXrayConfigCommand, UpdateXrayConfigCommand } from '@remnawave/backend-contract'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    config: null,
    isConfigLoading: false
}

export const useConfigStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getConfig: async (): Promise<boolean> => {
                    try {
                        const response = await instance.get<GetXrayConfigCommand.Response>(
                            GetXrayConfigCommand.url
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ config: dataResponse.config })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                updateConfig: async (config: UpdateXrayConfigCommand.Request) => {
                    try {
                        const response = await instance.put<UpdateXrayConfigCommand.Response>(
                            UpdateXrayConfigCommand.url,
                            config
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ config: dataResponse.config })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                getInitialState: () => {
                    return initialState
                },
                setConfig: (config: string) => {
                    set({ config })
                },
                resetState: async () => {
                    set({ ...initialState })
                }
            }
        }),
        {
            anonymousActionType: 'configStore',
            name: 'configStore'
        }
    )
)

export const useConfigStoreIsConfigLoading = () => useConfigStore((store) => store.isConfigLoading)
export const useConfigStoreConfig = () => useConfigStore((state) => state.config)
export const useConfigStoreActions = () => useConfigStore((store) => store.actions)
