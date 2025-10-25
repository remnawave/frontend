import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        resetFilters: () => void
        resetState: () => Promise<void>
        setConfigProfileFilter: (configProfileUuid: null | string) => void
        setHostTagFilter: (hostTag: null | string) => void
        setInboundFilter: (inboundUuid: null | string) => void
    }
}
