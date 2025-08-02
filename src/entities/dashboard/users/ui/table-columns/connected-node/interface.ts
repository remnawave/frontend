import { GetAllUsersCommand } from '@remnawave/backend-contract'

export interface IProps {
    lastConnectedNode: GetAllUsersCommand.Response['response']['users'][number]['lastConnectedNode']
}
