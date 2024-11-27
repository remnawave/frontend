import {
    GetAllUsersCommand,
    GetInboundsCommand,
    GetStatsCommand,
} from '@remnawave/backend-contract';
import { instance } from '@shared/api';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { notifications } from '@mantine/notifications';
import { IActions, IState, IUsersParams } from './interfaces';

const initialState: IState = {
    isLoading: false,
    systemInfo: null,
    users: null,
    usersParams: {
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
        orderDir: 'desc',
    },
    totalUsers: 0,
    inbounds: null,
    isInboundsLoading: false,
};

export const useDashboardStore = create<IState & IActions>()(
    devtools(
        (set, getState) => ({
            ...initialState,
            actions: {
                getSystemInfo: async (): Promise<boolean> => {
                    try {
                        set({ isLoading: true });
                        const response = await instance.get<GetStatsCommand.Response>(
                            GetStatsCommand.url
                        );
                        const {
                            data: { response: dataResponse },
                        } = response;

                        set({ systemInfo: dataResponse });

                        return true;
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e;
                        }
                        return false;
                    } finally {
                        set({ isLoading: false });
                    }
                },
                getUsers: async (params?: Partial<IUsersParams>): Promise<boolean> => {
                    try {
                        set({ isLoading: true });
                        const currentParams = getState().usersParams;
                        const newParams = { ...currentParams, ...params };

                        const response = await instance.get<GetAllUsersCommand.Response>(
                            GetAllUsersCommand.url,
                            {
                                params: {
                                    limit: newParams.limit,
                                    offset: newParams.offset,
                                    orderBy: newParams.orderBy,
                                    orderDir: newParams.orderDir,
                                    search: newParams.search,
                                    searchBy: newParams.searchBy,
                                },
                            }
                        );

                        const {
                            data: { response: dataResponse },
                        } = response;

                        set({
                            users: dataResponse.users,
                            totalUsers: dataResponse.total,
                            usersParams: newParams,
                        });

                        return true;
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e;
                        }
                        return false;
                    } finally {
                        set({ isLoading: false });
                    }
                },
                getInbounds: async (): Promise<boolean> => {
                    try {
                        set({ isInboundsLoading: true });
                        const response = await instance.get<GetInboundsCommand.Response>(
                            GetInboundsCommand.url
                        );
                        const {
                            data: { response: dataResponse },
                        } = response;

                        set({ inbounds: dataResponse });

                        return true;
                    } catch (e) {
                        if (e instanceof AxiosError) {
                            throw e;
                        }
                        return false;
                    } finally {
                        set({ isInboundsLoading: false });
                    }
                },
                resetState: async () => {
                    set({ ...initialState });
                },
            },
        }),
        {
            name: 'dashboardStore',
            anonymousActionType: 'dashboardStore',
        }
    )
);

export const useDashboardStoreIsLoading = () => useDashboardStore((store) => store.isLoading);
export const useDashboardStoreSystemInfo = () => useDashboardStore((state) => state.systemInfo);
export const useDashboardStoreActions = () => useDashboardStore((store) => store.actions);
export const useDashboardStoreUsers = () => useDashboardStore((state) => state.users);
export const useDashboardStoreTotalUsers = () => useDashboardStore((state) => state.totalUsers);
export const useDashboardStoreParams = () => useDashboardStore((state) => state.usersParams);

// Inbounds
export const useDSInbounds = () => useDashboardStore((state) => state.inbounds);
export const useDSInboundsLoading = () => useDashboardStore((state) => state.isInboundsLoading);
