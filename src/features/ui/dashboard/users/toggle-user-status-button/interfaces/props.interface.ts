import { GetUserByUuidCommand } from '@remnawave/backend-contract'

export interface IProps {
    user: GetUserByUuidCommand.Response['response']
}
