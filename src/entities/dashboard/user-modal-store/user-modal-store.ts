import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'
import { QueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    isDetailedUserInfoDrawerOpen: false,
    isModalOpen: false,
    userUuid: null,
    drawerUserUuid: null
}

export const useUserModalStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                changeModalState: async (modalState: boolean) => {
                    set(() => ({ isModalOpen: modalState }))
                },
                clearModalState: async () => {
                    set(() => ({
                        isModalOpen: false,
                        userUuid: null
                    }))

                    queryClient.refetchQueries({
                        queryKey: QueryKeys.users.getAllUsers._def
                    })
                    queryClient.refetchQueries({ queryKey: QueryKeys.system._def })

                    getState().actions.resetState()
                },
                changeDetailedUserInfoDrawerState: (detailedUserInfoDrawerState: boolean) => {
                    set(() => ({ isDetailedUserInfoDrawerOpen: detailedUserInfoDrawerState }))
                    if (!detailedUserInfoDrawerState) {
                        set(() => ({
                            isDetailedUserInfoDrawerOpen: false
                        }))

                        setTimeout(() => {
                            set(() => ({
                                userUuid: null
                            }))
                            getState().actions.resetState()
                        }, 300)
                    }
                },
                setUserUuid: async (userUuid: string): Promise<void> => {
                    set(() => ({ userUuid }))
                },
                setDrawerUserUuid: async (userUuid: string): Promise<void> => {
                    set(() => ({ drawerUserUuid: userUuid }))
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
            name: 'userModalStore',
            anonymousActionType: 'userModalStore'
        }
    )
)

export const useUserModalStoreIsModalOpen = () => useUserModalStore((state) => state.isModalOpen)
export const useUserModalStoreIsDetailedUserInfoDrawerOpen = () =>
    useUserModalStore((state) => state.isDetailedUserInfoDrawerOpen)
export const useUserModalStoreActions = () => useUserModalStore((store) => store.actions)
export const useUserModalStoreUserUuid = () => useUserModalStore((state) => state.userUuid)
export const useUserModalStoreDrawerUserUuid = () =>
    useUserModalStore((state) => state.drawerUserUuid)
