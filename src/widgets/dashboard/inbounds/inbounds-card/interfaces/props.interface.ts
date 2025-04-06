import { GetFullInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    inbound: GetFullInboundsCommand.Response['response'][number]
}
