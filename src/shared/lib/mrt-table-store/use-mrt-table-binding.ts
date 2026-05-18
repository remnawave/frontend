import type { StoreApi, UseBoundStore } from 'zustand'

import { useShallow } from 'zustand/react/shallow'

import type { MrtTableStore } from './create-mrt-table-store'

export const useMrtTableBinding = (useStore: UseBoundStore<StoreApi<MrtTableStore>>) => {
    const state = useStore(
        useShallow((s) => ({
            columnFilters: s.columnFilter,
            columnOrder: s.columnOrder,
            columnPinning: s.columnPinning,
            columnSizing: s.columnSize,
            columnVisibility: s.columnVisibility,
            pagination: s.paginationState,
            showColumnFilters: s.showColumnFilters
        }))
    )
    const actions = useStore((s) => s.actions)

    return {
        state,
        handlers: {
            onColumnFiltersChange: actions.setColumnFilter,
            onColumnOrderChange: actions.setColumnOrder,
            onColumnPinningChange: actions.setColumnPinning,
            onColumnSizingChange: actions.setColumnSize,
            onColumnVisibilityChange: actions.setColumnVisibility,
            onPaginationChange: actions.setPaginationState,
            onShowColumnFiltersChange: actions.setShowColumnFilters
        }
    }
}
