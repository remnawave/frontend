import { GetNodeCommand } from '@remnawave/backend-contract'

export interface IProps {
    node: GetNodeCommand.Response['response']
}
