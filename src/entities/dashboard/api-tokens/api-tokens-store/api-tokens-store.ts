import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    createModal: {
        isOpen: false
    }
}

export const useApiTokensStore = create<IActions & IState>()(
    devtools(
        (set) => ({
            ...initialState,
            actions: {
                toggleCreateModal: (isOpen: boolean) => {
                    set((state) => ({
                        createModal: { ...state.createModal, isOpen }
                    }))
                    if (!isOpen) {
                        set((state) => ({
                            createModal: { ...state.createModal }
                        }))
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
            name: 'apiTokensStore',
            anonymousActionType: 'apiTokensStore'
        }
    )
)

export const useApiTokensStoreActions = () => useApiTokensStore((store) => store.actions)
export const useApiTokensStoreCreateModalIsOpen = () =>
    useApiTokensStore((state) => state.createModal.isOpen)
