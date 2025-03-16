import { GetAllHostsCommand, GetFullInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    hosts: GetAllHostsCommand.Response['response'] | undefined
    inbounds: GetFullInboundsCommand.Response['response'] | undefined
    isHostsLoading: boolean
}
