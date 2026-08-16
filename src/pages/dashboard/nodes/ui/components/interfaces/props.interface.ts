import {
    GetNodeIntegrationsCommand,
    GetNodePluginsCommand,
    GetNodesCommand
} from '@remnawave/backend-contract'

export interface IProps {
    isLoading: boolean
    nodes: GetNodesCommand.Response['response'] | undefined
    nodePlugins: GetNodePluginsCommand.Response['response'] | undefined
    nodeIntegrations: GetNodeIntegrationsCommand.Response['response'] | undefined
}
