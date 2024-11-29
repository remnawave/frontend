import {
    CreateHostCommand,
    ReorderHostCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        getHosts: () => Promise<boolean>
        reorderHosts: (hosts: ReorderHostCommand.Request['hosts']) => Promise<boolean>
        getInitialState: () => IState
        resetState: () => Promise<void>
        setSelectedInboundTag: (tag: string) => void
        resetSelectedInboundTag: () => void
        toggleEditModal: (isOpen: boolean) => void
        setHost: (host: UpdateHostCommand.Response['response']) => void
        deleteHost: (uuid: string) => Promise<boolean>
        updateHost: (host: UpdateHostCommand.Request) => Promise<boolean>
        createHost: (host: CreateHostCommand.Request) => Promise<boolean>
        toggleCreateModal: (isOpen: boolean) => void
    }
}
