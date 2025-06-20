import { GetInternalSquadsCommand } from '@remnawave/backend-contract'

export interface Props {
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
}
