import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'
import { QueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

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
                changeModalState: async (modalState: boolean) => {
                    set(() => ({ isModalOpen: modalState }))
                    if (!modalState) {
                        await getState().actions.resetState()
                    }
                },
                getInitialState: () => {
                    return initialState
                },
                resetState: async (): Promise<void> => {
                    await queryClient.refetchQueries({
                        queryKey: QueryKeys.users.getAllUsers._def
                    })
                    await queryClient.refetchQueries({ queryKey: QueryKeys.system._def })

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
