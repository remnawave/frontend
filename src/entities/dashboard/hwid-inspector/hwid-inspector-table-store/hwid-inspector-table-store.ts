import { createMrtTableStore } from '@shared/lib/mrt-table-store'

export const useHwidInspectorTableStore = createMrtTableStore({
    name: 'x-rmnw-hwid-inspector-table',
    version: 1
})

export const useHwidInspectorTableStoreActions = () =>
    useHwidInspectorTableStore((store) => store.actions)
