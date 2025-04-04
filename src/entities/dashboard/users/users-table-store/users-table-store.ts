/* eslint-disable camelcase */

import {
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
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
    email: false
}

const DEFAULT_PINNING: MRT_ColumnPinningState = {
    left: ['mrt-row-actions', 'mrt-row-select', 'username'],
    right: []
}

const DEFAULT_COLUMN_FILTER: MRT_ColumnFiltersState = []

const initialState: IState = {
    columnVisibility: DEFAULT_VISIBILITY,
    columnPinning: DEFAULT_PINNING,
    showColumnFilters: false,
    columnFilter: DEFAULT_COLUMN_FILTER
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

                resetState: () => set({ ...initialState })
            }
        }),

        {
            name: 'rmnw-users-table-store',
            version: 1,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                columnVisibility: state.columnVisibility,
                columnPinning: state.columnPinning,
                showColumnFilters: state.showColumnFilters,
                columnFilter: state.columnFilter
            })
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
