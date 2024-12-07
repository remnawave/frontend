import { GetOneNodeCommand } from '@remnawave/backend-contract'

export interface IProps {
    handleClose: () => void
    node: GetOneNodeCommand.Response['response']
}
