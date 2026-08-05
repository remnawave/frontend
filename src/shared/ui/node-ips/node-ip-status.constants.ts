import { TNodeIpStatus } from '@remnawave/backend-contract'
import { IconType } from 'react-icons'
import {
    TbActivityHeartbeat,
    TbAlertTriangle,
    TbArchive,
    TbArrowDownLeft,
    TbArrowsExchange,
    TbArrowUpRight,
    TbBan,
    TbBookmark,
    TbQuestionMark,
    TbTerminal2
} from 'react-icons/tb'

interface INodeIpStatusMeta {
    color: string
    Icon: IconType
    labelKey: string
}

export const NODE_IP_STATUS_META = {
    INBOUND: {
        color: 'green',
        Icon: TbArrowDownLeft,
        labelKey: 'node-ip-statuses.inbound'
    },
    OUTBOUND: {
        color: 'blue',
        Icon: TbArrowUpRight,
        labelKey: 'node-ip-statuses.outbound'
    },
    MANAGEMENT: {
        color: 'violet',
        Icon: TbTerminal2,
        labelKey: 'node-ip-statuses.management'
    },
    TRANSIT: {
        color: 'cyan',
        Icon: TbArrowsExchange,
        labelKey: 'node-ip-statuses.transit'
    },
    MONITORING: {
        color: 'teal',
        Icon: TbActivityHeartbeat,
        labelKey: 'node-ip-statuses.monitoring'
    },
    RESERVE: {
        color: 'gray',
        Icon: TbBookmark,
        labelKey: 'node-ip-statuses.reserve'
    },
    BLOCKED: {
        color: 'red',
        Icon: TbBan,
        labelKey: 'node-ip-statuses.blocked'
    },
    FLAGGED: {
        color: 'orange',
        Icon: TbAlertTriangle,
        labelKey: 'node-ip-statuses.flagged'
    },
    DEPRECATED: {
        color: 'grape',
        Icon: TbArchive,
        labelKey: 'node-ip-statuses.deprecated'
    },
    UNKNOWN: {
        color: 'gray',
        Icon: TbQuestionMark,
        labelKey: 'node-ip-statuses.unknown'
    }
} as const satisfies Record<TNodeIpStatus, INodeIpStatusMeta>

export const NODE_IP_STATUSES_ORDER = Object.keys(NODE_IP_STATUS_META) as TNodeIpStatus[]

export const resolveNodeIpStatusMeta = (status: string) =>
    NODE_IP_STATUS_META[status as TNodeIpStatus] ?? NODE_IP_STATUS_META.UNKNOWN
