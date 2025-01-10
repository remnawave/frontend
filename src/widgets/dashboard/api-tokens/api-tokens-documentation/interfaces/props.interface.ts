import { FindAllApiTokensCommand } from '@remnawave/backend-contract'

export interface IProps {
    docs: FindAllApiTokensCommand.Response['response']['docs'] | undefined
}
