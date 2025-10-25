import { GetStatusCommand } from '@remnawave/backend-contract'

export interface IProps {
    authentication: NonNullable<GetStatusCommand.Response['response']['authentication']>
}
