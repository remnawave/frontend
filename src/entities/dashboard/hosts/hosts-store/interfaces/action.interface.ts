import { UpdateHostCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        resetSelectedInboundTag: () => void
        resetState: () => Promise<void>
        setHost: (host: UpdateHostCommand.Response['response']) => void
        setSelectedInboundTag: (tag: string) => void
        toggleCreateModal: (isOpen: boolean) => void
        toggleEditModal: (isOpen: boolean) => void
    }
}
