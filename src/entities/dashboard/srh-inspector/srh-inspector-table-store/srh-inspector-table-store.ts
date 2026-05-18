import { createMrtTableStore } from '@shared/lib/mrt-table-store'

export const useSrhInspectorTableStore = createMrtTableStore({
    name: 'x-rmnw-srh-inspector-table',
    version: 1
})

export const useSrhInspectorTableStoreActions = () =>
    useSrhInspectorTableStore((store) => store.actions)
