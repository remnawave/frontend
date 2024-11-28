import type { ISetTokenAction } from './set-token-action.interface.ts'

export interface IActions {
    actions: {
        setToken: (dto: ISetTokenAction) => void
        removeToken: () => void
    }
}
