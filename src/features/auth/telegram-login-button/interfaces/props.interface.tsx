import { GetStatusCommand } from '@remnawave/backend-contract'

export interface IProps {
    tgAuth: GetStatusCommand.Response['response']['tgAuth']
}
