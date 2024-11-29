import { GetAllHostsCommand, GetInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    hosts: GetAllHostsCommand.Response['response'] | null
    inbounds: GetInboundsCommand.Response['response'] | null
}
