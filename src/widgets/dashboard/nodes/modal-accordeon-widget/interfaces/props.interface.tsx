import { GetOneNodeCommand } from '@remnawave/backend-contract'

export interface IProps {
    fetchedNode: GetOneNodeCommand.Response['response'] | undefined
    node: GetOneNodeCommand.Response['response'] | null
}
