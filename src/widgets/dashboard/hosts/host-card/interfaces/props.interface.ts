import { GetAllHostsCommand, GetInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    inbounds: GetInboundsCommand.Response['response'] | undefined
    index: number
    item: GetAllHostsCommand.Response['response'][number]
}
