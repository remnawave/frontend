import { GetExternalSquadsCommand } from '@remnawave/backend-contract'

export interface Props {
    externalSquads: GetExternalSquadsCommand.Response['response']['externalSquads']
}
