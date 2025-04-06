import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { devtools } from 'zustand/middleware'

import { create } from '@shared/hocs/store-wrapper'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    editModal: {
        isOpen: false,
        node: null,
        isLoading: false
    },
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
                toggleEditModal: (isOpen: boolean) => {
                    set((state) => ({
                        editModal: { ...state.editModal, isOpen }
                    }))
                },
                clearEditModal: () => {
                    set((state) => ({
                        editModal: { ...state.editModal, node: null, isLoading: false }
                    }))
                },
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
                setNode: (node: UpdateNodeCommand.Response['response']) => {
                    set((state) => ({
                        editModal: { ...state.editModal, node }
                    }))
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

// Edit Modal
export const useNodesStoreEditModalIsOpen = () => useNodesStore((state) => state.editModal.isOpen)
export const useNodesStoreEditModalNode = () => useNodesStore((state) => state.editModal.node)
export const useNodesStoreEditModalIsLoading = () =>
    useNodesStore((state) => state.editModal.isLoading)

// Create Modal
export const useNodesStoreCreateModalIsOpen = () =>
    useNodesStore((state) => state.createModal.isOpen)
export const useNodesStoreCreateModalIsLoading = () =>
    useNodesStore((state) => state.createModal.isLoading)
