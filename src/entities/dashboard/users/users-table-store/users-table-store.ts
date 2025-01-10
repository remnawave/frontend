/* eslint-disable camelcase */

import { MRT_ColumnPinningState, MRT_VisibilityState } from 'mantine-react-table'
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
    lifetimeUsedTrafficBytes: false
}

const DEFAULT_PINNING: MRT_ColumnPinningState = {
    left: ['mrt-row-actions', 'username'],
    right: []
}

const initialState: IState = {
    columnVisibility: DEFAULT_VISIBILITY,
    columnPinning: DEFAULT_PINNING,
    showColumnFilters: false
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

                resetState: () => set({ ...initialState })
            }
        }),

        {
            name: 'users-table-storage',
            version: 1,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                columnVisibility: state.columnVisibility,
                columnPinning: state.columnPinning,
                showColumnFilters: state.showColumnFilters
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
