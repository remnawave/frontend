import {
    DeleteUserCommand,
    DisableUserCommand,
    EnableUserCommand,
    GetUserByUuidCommand,
    RevokeUserSubscriptionCommand,
    UpdateUserCommand,
    USERS_STATUS
} from '@remnawave/backend-contract'
import { instance } from '@shared/api'
import { AxiosError } from 'axios'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IActions, IState } from './interfaces'

const initialState: IState = {
    isLoading: false,
    isModalOpen: false,
    userUuid: null,
    user: null
}

export const useUserModalStore = create<IState & IActions>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getUser: async (): Promise<boolean> => {
                    try {
                        set({ isLoading: true })

                        const userUuid = getState().userUuid

                        if (!userUuid) {
                            throw new Error('User UUID is required')
                        }

                        const response = await instance.get<GetUserByUuidCommand.Response>(
                            GetUserByUuidCommand.url(userUuid)
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ user: dataResponse })

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
                updateUser: async (body: UpdateUserCommand.Request): Promise<boolean> => {
                    try {
                        set({ isLoading: true })
                        const response = await instance.patch<UpdateUserCommand.Response>(
                            UpdateUserCommand.url,
                            body
                        )
                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ user: dataResponse })

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

                disableUser: async (): Promise<boolean> => {
                    try {
                        const userUuid = getState().userUuid

                        if (!userUuid) {
                            throw new Error('User UUID is required')
                        }

                        const response = await instance.patch<DisableUserCommand.Response>(
                            DisableUserCommand.url(userUuid)
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ user: dataResponse })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                enableUser: async (): Promise<boolean> => {
                    try {
                        const userUuid = getState().userUuid

                        if (!userUuid) {
                            throw new Error('User UUID is required')
                        }

                        const response = await instance.patch<EnableUserCommand.Response>(
                            EnableUserCommand.url(userUuid)
                        )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ user: dataResponse })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                deleteUser: async (): Promise<boolean> => {
                    try {
                        const userUuid = getState().userUuid

                        if (!userUuid) {
                            throw new Error('User UUID is required')
                        }

                        await instance.delete<DeleteUserCommand.Response>(
                            DeleteUserCommand.url(userUuid)
                        )

                        getState().actions.resetState()

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                reveokeSubscription: async (): Promise<boolean> => {
                    try {
                        const userUuid = getState().userUuid

                        if (!userUuid) {
                            throw new Error('User UUID is required')
                        }

                        const response =
                            await instance.patch<RevokeUserSubscriptionCommand.Response>(
                                RevokeUserSubscriptionCommand.url(userUuid)
                            )

                        const {
                            data: { response: dataResponse }
                        } = response

                        set({ user: dataResponse })

                        return true
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e
                        }
                        return false
                    }
                },
                changeModalState: (modalState: boolean) => {
                    set((state) => ({ isModalOpen: modalState }))
                    if (!modalState) {
                        getState().actions.resetState()
                    }
                },
                setUserUuid: async (userUuid: string): Promise<void> => {
                    set((state) => ({ userUuid }))
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
export const useUserModalStoreUser = () => useUserModalStore((state) => state.user)
