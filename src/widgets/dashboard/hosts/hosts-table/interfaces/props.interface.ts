import { GetAllHostsCommand, GetInboundsCommand } from '@remnawave/backend-contract'

export interface IProps {
    hosts: GetAllHostsCommand.Response['response'] | undefined
    inbounds: GetInboundsCommand.Response['response'] | undefined
    selectedHosts: string[]
    setSelectedHosts: React.Dispatch<React.SetStateAction<string[]>>
}
