import type { ISetTokenAction } from './set-token-action.interface.ts'

export interface IActions {
    actions: {
        removeToken: () => void
        setToken: (dto: ISetTokenAction) => void
    }
}
