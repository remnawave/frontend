import { GetInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    inbounds: GetInboundsCommand.Response['response'] | undefined
}
