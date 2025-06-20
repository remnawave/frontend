import { GetInternalSquadsCommand } from '@remnawave/backend-contract'

export interface IProps {
    internalSquad: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    onClose: () => void
    opened: boolean
}
