import {
    CreateHostCommand,
    DeleteHostCommand,
    GetAllHostsCommand,
    ReorderHostCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { devtools } from 'zustand/middleware'
import { AxiosError } from 'axios'

import { create } from '@shared/hocs/store-wrapper'
import { instance } from '@shared/api'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    isHostsLoading: false,
    hosts: null,
    selectedInboundTag: 'ALL',
    editModal: {
        isOpen: false,
        host: null,
        isLoading: false
    },
    createModal: {
        isOpen: false,
        isLoading: false
    }
}

export const useHostsStore = create<IActions & IState>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getHosts: async (): Promise<boolean> => {
                    try {
                        set({ isHostsLoading: true })

                        const response = await instance.get<GetAllHostsCommand.Response>(
                            GetAllHostsCommand.url
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({
                            hosts: dataResponse
                        })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    } finally {
                        setTimeout(() => {
                            set({ isHostsLoading: false })
                        }, 300)
                    }
                },
                reorderHosts: async (
                    hosts: ReorderHostCommand.Request['hosts']
                ): Promise<boolean> => {
                    try {
                        const response = await instance.post<ReorderHostCommand.Response>(
                            ReorderHostCommand.url,
                            {
                                hosts
                            }
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        if (dataResponse.isUpdated) {
                            return true
                        }

                        return false
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                deleteHost: async (uuid: string): Promise<boolean> => {
                    try {
                        await instance.delete<DeleteHostCommand.Response>(
                            DeleteHostCommand.url(uuid)
                        )

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                updateHost: async (host: UpdateHostCommand.Request): Promise<boolean> => {
                    try {
                        await instance.post<UpdateHostCommand.Response>(UpdateHostCommand.url, host)

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                createHost: async (host: CreateHostCommand.Request): Promise<boolean> => {
                    try {
                        await instance.post<CreateHostCommand.Response>(CreateHostCommand.url, host)

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
                        getState().actions.getHosts()
                        set((state) => ({
                            editModal: { ...state.editModal, host: null, isLoading: false }
                        }))
                    }
                },
                toggleCreateModal: (isOpen: boolean) => {
                    set((state) => ({
                        createModal: { ...state.createModal, isOpen }
                    }))
                    if (!isOpen) {
                        getState().actions.getHosts()
                        set((state) => ({
                            createModal: { ...state.createModal, isLoading: false }
                        }))
                    }
                },
                setHost: (host: UpdateHostCommand.Response['response']) => {
                    set((state) => ({
                        editModal: { ...state.editModal, host }
                    }))
                },
                getInitialState: () => {
                    return initialState
                },
                resetState: async () => {
                    set({ ...initialState })
                },
                setSelectedInboundTag: (tag: string) => {
                    set({ selectedInboundTag: tag })
                },
                resetSelectedInboundTag: () => {
                    set({ selectedInboundTag: 'ALL' })
                }
            }
        }),
        {
            name: 'hostsStore',
            anonymousActionType: 'hostsStore'
        }
    )
)

export const useHostsStoreIsHostsLoading = () => useHostsStore((store) => store.isHostsLoading)
export const useHostsStoreHosts = () => useHostsStore((state) => state.hosts)
export const useHostsStoreActions = () => useHostsStore((store) => store.actions)

export const useHostsStoreSelectedInboundTag = () =>
    useHostsStore((state) => state.selectedInboundTag)

// Edit Modal
export const useHostsStoreEditModalIsOpen = () => useHostsStore((state) => state.editModal.isOpen)
export const useHostsStoreEditModalHost = () => useHostsStore((state) => state.editModal.host)
export const useHostsStoreEditModalIsLoading = () =>
    useHostsStore((state) => state.editModal.isLoading)

// Create Modal
export const useHostsStoreCreateModalIsOpen = () =>
    useHostsStore((state) => state.createModal.isOpen)
export const useHostsStoreCreateModalIsLoading = () =>
    useHostsStore((state) => state.createModal.isLoading)
