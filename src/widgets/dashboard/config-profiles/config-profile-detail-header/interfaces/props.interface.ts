import { GetConfigProfileByUuidCommand } from '@remnawave/backend-contract'

export interface IProps {
    configProfile: GetConfigProfileByUuidCommand.Response['response']
}
