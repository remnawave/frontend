import { FindAllApiTokensCommand } from '@remnawave/backend-contract'

export interface IProps {
    apiTokens: FindAllApiTokensCommand.Response['response']['apiKeys'] | undefined
}
