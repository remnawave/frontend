import { createMrtTableStore } from '@shared/lib/mrt-table-store'

export const useTbReportsTableStore = createMrtTableStore({
    name: 'x-rmnw-tb-reports-table',
    version: 1
})

export const useTbReportsTableStoreActions = () =>
    useTbReportsTableStore((store) => store.actions)
