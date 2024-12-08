import { FindAllApiTokensCommand } from '@remnawave/backend-contract'

export interface IProps {
    apiToken: FindAllApiTokensCommand.Response['response'][number]
}
