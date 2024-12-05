import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    isModalOpen: false,
    userUuid: null
}

export const useUserModalStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                changeModalState: (modalState: boolean) => {
                    set(() => ({ isModalOpen: modalState }))
                    if (!modalState) {
                        set(() => ({
                            userUuid: null,
                            isModalOpen: false
                        }))

                        getState().actions.resetState()
                    }
                },
                setUserUuid: async (userUuid: string): Promise<void> => {
                    set(() => ({ userUuid }))
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
export const useUserModalStoreActions = () => useUserModalStore((store) => store.actions)
export const useUserModalStoreUserUuid = () => useUserModalStore((state) => state.userUuid)
