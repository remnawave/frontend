import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        getNodes: () => Promise<boolean>
        getNodeByUuid: (uuid: string) => Promise<boolean>
        setNode: (node: UpdateNodeCommand.Response['response']) => void
        deleteNode: (uuid: string) => Promise<boolean>
        updateNode: (node: UpdateNodeCommand.Request) => Promise<boolean>
        createNode: (node: CreateNodeCommand.Request) => Promise<boolean>
        toggleCreateModal: (isOpen: boolean) => void
        toggleEditModal: (isOpen: boolean) => void
        getPubKey: () => Promise<boolean>
        getInitialState: () => IState
        resetState: () => Promise<void>
        enableNode: (uuid: string) => Promise<boolean>
        disableNode: (uuid: string) => Promise<boolean>
    }
}
