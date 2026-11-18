import { GetNodesCommand } from '@remnawave/backend-contract'

export type InboundNodeStatus = 'connected' | 'connecting' | 'disabled' | 'disconnected' | null

export interface IInboundNodeAggregate {
    status: InboundNodeStatus
    onlineNodesCount: number
    totalNodesCount: number
}

export const EMPTY_INBOUND_NODE_AGGREGATE: IInboundNodeAggregate = {
    status: null,
    onlineNodesCount: 0,
    totalNodesCount: 0
}

type NodeType = GetNodesCommand.Response['response'][number]

export function getInboundNodeAggregate(
    nodes: NodeType[],
    inboundUuid: string
): IInboundNodeAggregate {
    const relevantNodes = nodes.filter((node) =>
        node.configProfile?.activeInbounds?.some((inbound) => inbound.uuid === inboundUuid)
    )

    const onlineNodesCount = relevantNodes.filter((node) => node.isConnected).length
    const totalNodesCount = relevantNodes.length

    if (totalNodesCount === 0) {
        return { status: null, onlineNodesCount, totalNodesCount }
    }

    let status: InboundNodeStatus
    if (onlineNodesCount > 0) status = 'connected'
    else if (relevantNodes.some((node) => node.isConnecting)) status = 'connecting'
    else if (relevantNodes.every((node) => node.isDisabled)) status = 'disabled'
    else status = 'disconnected'

    return { status, onlineNodesCount, totalNodesCount }
}

export function getInboundCardColors(status: InboundNodeStatus): {
    backgroundColor: string
    borderColor: string
    boxShadow: string
} {
    if (status === 'connected') {
        return {
            backgroundColor: 'rgba(45, 212, 191, 0.15)',
            borderColor: 'rgba(45, 212, 191, 0.3)',
            boxShadow: '0 0 12px 0 rgba(45, 212, 191, 0.2)'
        }
    }
    if (status === 'connecting') {
        return {
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            boxShadow: '0 0 12px 0 rgba(245, 158, 11, 0.2)'
        }
    }
    if (status === 'disconnected') {
        return {
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            boxShadow: '0 0 12px 0 rgba(239, 68, 68, 0.2)'
        }
    }
    return {
        backgroundColor: 'rgba(107, 114, 128, 0.15)',
        borderColor: 'rgba(107, 114, 128, 0.3)',
        boxShadow: '0 0 12px 0 rgba(107, 114, 128, 0.2)'
    }
}
