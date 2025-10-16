import { GetConfigProfileByUuidCommand, GetSnippetsCommand } from '@remnawave/backend-contract'

export interface IProps {
    configProfile: GetConfigProfileByUuidCommand.Response['response']
    snippets: GetSnippetsCommand.Response['response']
}
