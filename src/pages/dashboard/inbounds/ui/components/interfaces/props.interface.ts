import { GetFullInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    inbounds: GetFullInboundsCommand.Response['response'] | undefined
    isInboundsLoading: boolean
}
