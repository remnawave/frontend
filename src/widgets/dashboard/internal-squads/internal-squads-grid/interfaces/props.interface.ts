import { GetInternalSquadsCommand } from '@remnawave/backend-contract'

export interface IProps {
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
}
