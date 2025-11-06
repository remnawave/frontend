/* eslint-disable camelcase */

import {
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
    MRT_ColumnSizingState,
    MRT_PaginationState,
    MRT_VisibilityState
} from 'mantine-react-table'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { IActions, IState } from './interfaces'

const DEFAULT_VISIBILITY: MRT_VisibilityState = {
    shortUuid: false,
    createdAt: false,
    subRevokedAt: false,
    totalUsedBytes: false,
    onlineAt: false,
    subLastUserAgent: false,
    lifetimeUsedTrafficBytes: false,
    description: false,
    telegramId: false,
    email: false,
    subLastOpenedAt: false,
    uuid: false,
    externalSquadUuid: false
}

const DEFAULT_COLUMN_SIZE: MRT_ColumnSizingState = {
    shortUuid: 100,
    createdAt: 100,
    subRevokedAt: 100,
    totalUsedBytes: 100,
    onlineAt: 100
}

// 'mrt-row-select'
const DEFAULT_PINNING: MRT_ColumnPinningState = {
    left: [],
    right: []
}

const DEFAULT_PAGINATION_STATE: MRT_PaginationState = {
    pageIndex: 0,
    pageSize: 25
}

const DEFAULT_COLUMN_FILTER: MRT_ColumnFiltersState = []

const initialState: IState = {
    columnVisibility: DEFAULT_VISIBILITY,
    columnPinning: DEFAULT_PINNING,
    showColumnFilters: false,
    columnFilter: DEFAULT_COLUMN_FILTER,
    columnSize: DEFAULT_COLUMN_SIZE,
    paginationState: DEFAULT_PAGINATION_STATE
}

export const useUsersTableStore = create<IActions & IState>()(
    persist(
        (set) => ({
            ...initialState,
            actions: {
                setColumnVisibility: (visibility) =>
                    set((state) => ({
                        columnVisibility:
                            typeof visibility === 'function'
                                ? visibility(state.columnVisibility)
                                : visibility
                    })),

                setColumnPinning: (pinning) =>
                    set((state) => ({
                        columnPinning:
                            typeof pinning === 'function' ? pinning(state.columnPinning) : pinning
                    })),

                setShowColumnFilters: (show) =>
                    set((state) => ({
                        showColumnFilters:
                            typeof show === 'function' ? show(state.showColumnFilters) : show
                    })),

                setColumnFilter: (filter) =>
                    set((state) => ({
                        columnFilter:
                            typeof filter === 'function' ? filter(state.columnFilter) : filter
                    })),

                resetState: () => set({ ...initialState }),

                setColumnSize: (size) =>
                    set((state) => ({
                        columnSize: typeof size === 'function' ? size(state.columnSize) : size
                    })),

                setPaginationState: (pagination) =>
                    set((state) => ({
                        paginationState:
                            typeof pagination === 'function'
                                ? pagination(state.paginationState)
                                : pagination
                    }))
            }
        }),

        {
            name: 'x-rmnw-users-table',
            version: 4,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                columnVisibility: state.columnVisibility,
                columnPinning: state.columnPinning,
                showColumnFilters: state.showColumnFilters,
                columnFilter: state.columnFilter,
                columnSize: state.columnSize,
                paginationState: state.paginationState
            }),
            migrate: () => {
                return {
                    columnVisibility: DEFAULT_VISIBILITY,
                    columnPinning: DEFAULT_PINNING,
                    showColumnFilters: false,
                    columnFilter: DEFAULT_COLUMN_FILTER,
                    columnSize: DEFAULT_COLUMN_SIZE,
                    paginationState: DEFAULT_PAGINATION_STATE
                }
            }
        }
    )
)

export const useUsersTableStoreActions = () => useUsersTableStore((store) => store.actions)
export const useUsersTableStoreColumnVisibility = () =>
    useUsersTableStore((store) => store.columnVisibility)
export const useUsersTableStoreColumnPinning = () =>
    useUsersTableStore((store) => store.columnPinning)
export const useUsersTableStoreShowColumnFilters = () =>
    useUsersTableStore((store) => store.showColumnFilters)
export const useUsersTableStoreColumnFilter = () =>
    useUsersTableStore((store) => store.columnFilter)
export const useUsersTableStoreColumnSize = () => useUsersTableStore((store) => store.columnSize)
export const useUsersTableStorePagination = () =>
    useUsersTableStore((store) => store.paginationState)
