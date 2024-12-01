import {
    CreateNodeCommand,
    DeleteNodeCommand,
    DisableNodeCommand,
    EnableNodeCommand,
    GetAllNodesCommand,
    GetOneNodeCommand,
    GetPubKeyCommand,
    RestartAllNodesCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { devtools } from 'zustand/middleware'
import { AxiosError } from 'axios'

import { create } from '@shared/hocs/store-wrapper'
import { instance } from '@shared/api'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    isNodesLoading: false,
    nodes: null,
    editModal: {
        isOpen: false,
        node: null,
        isLoading: false
    },
    createModal: {
        isOpen: false,
        isLoading: false
    },
    pubKey: null
}

export const useNodesStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getNodes: async (): Promise<boolean> => {
                    try {
                        set({ isNodesLoading: true })

                        const response = await instance.get<GetAllNodesCommand.Response>(
                            GetAllNodesCommand.url
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({
                            nodes: dataResponse
                        })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        setTimeout(() => {
                            set({ isNodesLoading: false })
                        }, 300)
                    }
                },

                deleteNode: async (uuid: string): Promise<boolean> => {
                    try {
                        await instance.delete<DeleteNodeCommand.Response>(
                            DeleteNodeCommand.url(uuid)
                        )

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                enableNode: async (uuid: string): Promise<boolean> => {
                    try {
                        const response = await instance.patch<EnableNodeCommand.Response>(
                            EnableNodeCommand.url(uuid)
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        getState().actions.setNode(dataResponse)

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                disableNode: async (uuid: string): Promise<boolean> => {
                    try {
                        const response = await instance.patch<DisableNodeCommand.Response>(
                            DisableNodeCommand.url(uuid)
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        getState().actions.setNode(dataResponse)

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                updateNode: async (node: UpdateNodeCommand.Request): Promise<boolean> => {
                    try {
                        await instance.patch<UpdateNodeCommand.Response>(
                            UpdateNodeCommand.url,
                            node
                        )

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                getNodeByUuid: async (uuid: string): Promise<boolean> => {
                    try {
                        const response = await instance.get<GetOneNodeCommand.Response>(
                            GetOneNodeCommand.url(uuid)
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set((state) => ({
                            editModal: { ...state.editModal, node: dataResponse }
                        }))

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                createNode: async (node: CreateNodeCommand.Request): Promise<boolean> => {
                    try {
                        await instance.post<CreateNodeCommand.Response>(CreateNodeCommand.url, node)

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                restartAllNodes: async (): Promise<boolean> => {
                    try {
                        await instance.get<RestartAllNodesCommand.Response>(
                            RestartAllNodesCommand.url
                        )

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                getPubKey: async (): Promise<boolean> => {
                    try {
                        const response = await instance.get<GetPubKeyCommand.Response>(
                            GetPubKeyCommand.url
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ pubKey: dataResponse })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                toggleEditModal: (isOpen: boolean) => {
                    set((state) => ({
                        editModal: { ...state.editModal, isOpen }
                    }))
                    if (!isOpen) {
                        getState().actions.getNodes()
                        set((state) => ({
                            editModal: { ...state.editModal, node: null, isLoading: false }
                        }))
                    }
                },
                toggleCreateModal: (isOpen: boolean) => {
                    set((state) => ({
                        createModal: { ...state.createModal, isOpen }
                    }))
                    if (!isOpen) {
                        getState().actions.getNodes()
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

export const useNodesStoreIsNodesLoading = () => useNodesStore((store) => store.isNodesLoading)
export const useNodesStoreNodes = () => useNodesStore((state) => state.nodes)
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

// Pub Key
export const useNodesStorePubKey = () => useNodesStore((state) => state.pubKey)
