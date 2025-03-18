import { GetInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    inbound: GetInboundsCommand.Response['response'][number]
}
