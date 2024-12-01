import {
    CreateHostCommand,
    ReorderHostCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        createHost: (host: CreateHostCommand.Request) => Promise<boolean>
        deleteHost: (uuid: string) => Promise<boolean>
        getHosts: () => Promise<boolean>
        getInitialState: () => IState
        reorderHosts: (hosts: ReorderHostCommand.Request['hosts']) => Promise<boolean>
        resetSelectedInboundTag: () => void
        resetState: () => Promise<void>
        setHost: (host: UpdateHostCommand.Response['response']) => void
        setSelectedInboundTag: (tag: string) => void
        toggleCreateModal: (isOpen: boolean) => void
        toggleEditModal: (isOpen: boolean) => void
        updateHost: (host: UpdateHostCommand.Request) => Promise<boolean>
    }
}
