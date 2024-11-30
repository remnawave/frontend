import { UpdateXrayConfigCommand } from '@remnawave/backend-contract'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        getConfig: () => Promise<boolean>
        updateConfig: (config: UpdateXrayConfigCommand.Request) => Promise<boolean>
        setConfig: (config: string) => void
        getInitialState: () => IState
        resetState: () => Promise<void>
    }
}
