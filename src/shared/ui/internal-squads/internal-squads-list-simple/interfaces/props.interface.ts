import { GetInternalSquadsCommand } from '@remnawave/backend-contract'

export interface IProps {
    filteredInternalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
}
