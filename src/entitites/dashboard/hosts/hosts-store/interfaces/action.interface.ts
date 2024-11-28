import { ReorderHostCommand } from '@remnawave/backend-contract'

export interface IActions {
    actions: {
        getHosts: () => Promise<boolean>
        reorderHosts: (hosts: ReorderHostCommand.Request['hosts']) => Promise<boolean>
        resetState: () => Promise<void>
    }
}
