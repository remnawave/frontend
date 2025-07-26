import { GetStatusCommand } from '@remnawave/backend-contract'

export interface IProps {
    oauth2: GetStatusCommand.Response['response']['oauth2']
}
