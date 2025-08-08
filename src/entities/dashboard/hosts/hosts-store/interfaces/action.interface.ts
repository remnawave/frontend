import { UpdateHostCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        resetFilters: () => void
        resetState: () => Promise<void>
        setConfigProfileFilter: (configProfileUuid: null | string) => void
        setHost: (host: UpdateHostCommand.Response['response']) => void
        setHostTagFilter: (hostTag: null | string) => void
        setInboundFilter: (inboundUuid: null | string) => void
        toggleCreateModal: (isOpen: boolean) => void
        toggleEditModal: (isOpen: boolean) => void
    }
}
