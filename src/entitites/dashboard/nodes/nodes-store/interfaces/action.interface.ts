import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        createNode: (node: CreateNodeCommand.Request) => Promise<boolean>
        deleteNode: (uuid: string) => Promise<boolean>
        disableNode: (uuid: string) => Promise<boolean>
        enableNode: (uuid: string) => Promise<boolean>
        getInitialState: () => IState
        getNodeByUuid: (uuid: string) => Promise<boolean>
        getNodes: () => Promise<boolean>
        getPubKey: () => Promise<boolean>
        resetState: () => Promise<void>
        restartAllNodes: () => Promise<boolean>
        setNode: (node: UpdateNodeCommand.Response['response']) => void
        toggleCreateModal: (isOpen: boolean) => void
        toggleEditModal: (isOpen: boolean) => void
        updateNode: (node: UpdateNodeCommand.Request) => Promise<boolean>
    }
}
