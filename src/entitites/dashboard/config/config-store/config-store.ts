import { GetXrayConfigCommand, UpdateXrayConfigCommand } from '@remnawave/backend-contract'
import { instance } from '@shared/api'
import { create } from '@shared/hocs/store-wrapper'
import { AxiosError } from 'axios'
import { devtools } from 'zustand/middleware'
import { IActions, IState } from './interfaces'

const initialState: IState = {
    isConfigLoading: false,
    config: null
}

export const useConfigStore = create<IState & IActions>()(
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
                setConfig: (config: string) => {
                    set({ config })
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
            name: 'configStore',
            anonymousActionType: 'configStore'
        }
    )
)

export const useConfigStoreIsConfigLoading = () => useConfigStore((store) => store.isConfigLoading)
export const useConfigStoreConfig = () => useConfigStore((state) => state.config)
export const useConfigStoreActions = () => useConfigStore((store) => store.actions)
