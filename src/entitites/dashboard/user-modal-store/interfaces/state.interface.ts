import { GetUserByUuidCommand } from '@remnawave/backend-contract'

export interface IState {
    isLoading: boolean
    isModalOpen: boolean
    user: GetUserByUuidCommand.Response['response'] | null
    userUuid: null | string
}
