import { UpdateXrayConfigCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        getConfig: () => Promise<boolean>
        getInitialState: () => IState
        resetState: () => Promise<void>
        setConfig: (config: string) => void
        updateConfig: (config: UpdateXrayConfigCommand.Request) => Promise<boolean>
    }
}
