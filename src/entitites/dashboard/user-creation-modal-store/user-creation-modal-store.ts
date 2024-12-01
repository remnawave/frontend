import { CreateUserCommand } from '@remnawave/backend-contract'
import { devtools } from 'zustand/middleware'
import { AxiosError } from 'axios'

import { create } from '@shared/hocs/store-wrapper'
import { instance } from '@shared/api'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    isLoading: false,
    isModalOpen: false
}

export const useUserCreationModalStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                createUser: async (body: CreateUserCommand.Request): Promise<boolean> => {
                    try {
                        set({ isLoading: true })
                        await instance.post<CreateUserCommand.Response>(CreateUserCommand.url, body)

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
                changeModalState: async (modalState: boolean) => {
                    set((state) => ({ isModalOpen: modalState }))
                    if (!modalState) {
                        await getState().actions.resetState()
                    }
                },
                getInitialState: () => {
                    return initialState
                },
                resetState: async (): Promise<void> => {
                    set({ ...initialState })
                }
            }
        }),
        {
            name: 'userCreationModalStore',
            anonymousActionType: 'userCreationModalStore'
        }
    )
)

export const useUserCreationModalStoreIsModalOpen = () =>
    useUserCreationModalStore((state) => state.isModalOpen)
export const useUserCreationModalStoreActions = () =>
    useUserCreationModalStore((store) => store.actions)
