/* eslint-disable camelcase */
import {
    MRT_ColumnFiltersState,
    MRT_ColumnOrderState,
    MRT_ColumnPinningState,
    MRT_ColumnSizingState,
    MRT_PaginationState,
    MRT_VisibilityState
} from '@kastov/mantine-react-table-open'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

export interface MrtTableState {
    columnFilter: MRT_ColumnFiltersState
    columnOrder: MRT_ColumnOrderState
    columnPinning: MRT_ColumnPinningState
    columnSize: MRT_ColumnSizingState
    columnVisibility: MRT_VisibilityState
    paginationState: MRT_PaginationState
    showColumnFilters: boolean
}

type Updater<T> = ((prev: T) => T) | T

export interface MrtTableActions {
    resetState: () => void
    setColumnFilter: (updater: Updater<MRT_ColumnFiltersState>) => void
    setColumnOrder: (updater: Updater<MRT_ColumnOrderState>) => void
    setColumnPinning: (updater: Updater<MRT_ColumnPinningState>) => void
    setColumnSize: (updater: Updater<MRT_ColumnSizingState>) => void
    setColumnVisibility: (updater: Updater<MRT_VisibilityState>) => void
    setPaginationState: (updater: Updater<MRT_PaginationState>) => void
    setShowColumnFilters: (updater: Updater<boolean>) => void
}

export type MrtTableStore = MrtTableState & { actions: MrtTableActions }

export const DEFAULT_PAGINATION_STATE = { pageIndex: 0, pageSize: 25 } as const

const BASE_DEFAULTS: MrtTableState = {
    columnFilter: [],
    columnOrder: [],
    columnPinning: { left: [], right: [] },
    columnSize: {},
    columnVisibility: {},
    paginationState: { ...DEFAULT_PAGINATION_STATE },
    showColumnFilters: false
}

const apply = <T,>(updater: Updater<T>, prev: T): T =>
    typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater

export interface CreateMrtTableStoreConfig {
    defaults?: Partial<MrtTableState>
    name: string
    version: number
}

export const createMrtTableStore = ({
    name,
    version,
    defaults
}: CreateMrtTableStoreConfig) => {
    const initial: MrtTableState = { ...BASE_DEFAULTS, ...defaults }

    return create<MrtTableStore>()(
        persist(
            (set) => ({
                ...initial,
                actions: {
                    resetState: () => set({ ...initial }),
                    setColumnFilter: (u) =>
                        set((s) => ({ columnFilter: apply(u, s.columnFilter) })),
                    setColumnOrder: (u) =>
                        set((s) => ({ columnOrder: apply(u, s.columnOrder) })),
                    setColumnPinning: (u) =>
                        set((s) => ({ columnPinning: apply(u, s.columnPinning) })),
                    setColumnSize: (u) => set((s) => ({ columnSize: apply(u, s.columnSize) })),
                    setColumnVisibility: (u) =>
                        set((s) => ({ columnVisibility: apply(u, s.columnVisibility) })),
                    setPaginationState: (u) =>
                        set((s) => ({ paginationState: apply(u, s.paginationState) })),
                    setShowColumnFilters: (u) =>
                        set((s) => ({ showColumnFilters: apply(u, s.showColumnFilters) }))
                }
            }),
            {
                name,
                version,
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    columnFilter: state.columnFilter,
                    columnOrder: state.columnOrder,
                    columnPinning: state.columnPinning,
                    columnSize: state.columnSize,
                    columnVisibility: state.columnVisibility,
                    paginationState: state.paginationState,
                    showColumnFilters: state.showColumnFilters
                }),
                migrate: () => initial
            }
        )
    )
}
