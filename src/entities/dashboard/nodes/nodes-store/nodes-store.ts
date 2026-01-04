import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    createModal: {
        isOpen: false,
        isLoading: false
    }
}

export const useNodesStore = create<IActions & IState>()(
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
                            createModal: { ...state.createModal, isLoading: false }
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
            name: 'nodesStore',
            anonymousActionType: 'nodesStore'
        }
    )
)

export const useNodesStoreActions = () => useNodesStore((store) => store.actions)

// Create Modal
export const useNodesStoreCreateModalIsOpen = () =>
    useNodesStore((state) => state.createModal.isOpen)
export const useNodesStoreCreateModalIsLoading = () =>
    useNodesStore((state) => state.createModal.isLoading)
