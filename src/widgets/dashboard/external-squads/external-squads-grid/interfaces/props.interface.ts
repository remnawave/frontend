import { GetExternalSquadsCommand } from '@remnawave/backend-contract'

export interface IProps {
    externalSquads: GetExternalSquadsCommand.Response['response']['externalSquads']
}
