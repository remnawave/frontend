import {
    GetAllUsersCommand,
    GetInboundsCommand,
    GetStatsCommand,
    GetUserByUuidCommand
} from '@remnawave/backend-contract'

export interface IState {
    isLoading: boolean
    isModalOpen: boolean
    userUuid: string | null
    user: GetUserByUuidCommand.Response['response'] | null
}
