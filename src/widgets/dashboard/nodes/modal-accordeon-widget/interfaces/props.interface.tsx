import { GetOneNodeCommand } from '@remnawave/backend-contract'

export interface IProps {
    node: GetOneNodeCommand.Response['response']
}
