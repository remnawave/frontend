import { UpdateNodeCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        clearEditModal: () => void
        getInitialState: () => IState
        resetState: () => Promise<void>
        setNode: (node: UpdateNodeCommand.Response['response']) => void
        toggleCreateModal: (isOpen: boolean) => void
        toggleEditModal: (isOpen: boolean) => void
    }
}
