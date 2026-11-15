import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    Handle,
    MarkerType,
    NodeProps,
    Position,
    XYPosition
} from '@xyflow/react'

import { TCheckNode, TFlowBranch, TFlowEdge, TFrameNode, TTerminalNode } from './build-rule-flow'
import { ConditionSentence } from './conditions-tree'
import classes from './conditions.module.css'

const BRANCH_COLORS: Record<TFlowBranch, string> = {
    yes: 'var(--mantine-color-teal-5)',
    no: 'var(--mantine-color-red-5)',
    out: 'var(--mantine-color-dark-2)'
}

const CORNER_RADIUS = 10

function CheckNode({ data }: NodeProps<TCheckNode>) {
    return (
        <div className={classes.flowCheck}>
            <Handle position={Position.Top} type="target" />
            <ConditionSentence node={data.condition} />
            <Handle id="yes" position={Position.Bottom} type="source" />
            <Handle id="no" position={Position.Bottom} type="source" />
        </div>
    )
}

function TerminalNode({ data }: NodeProps<TTerminalNode>) {
    return (
        <div className={`${classes.flowTerminal} ${classes[`flowTerminal_${data.kind}`]}`}>
            {data.kind !== 'start' && <Handle position={Position.Top} type="target" />}
            {data.label}
            {data.kind === 'start' && <Handle id="out" position={Position.Bottom} type="source" />}
        </div>
    )
}

function FrameNode({ data }: NodeProps<TFrameNode>) {
    return (
        <div
            className={
                data.isReachable
                    ? classes.flowFrame
                    : `${classes.flowFrame} ${classes.flowFrameUnreachable}`
            }
            style={{ width: data.width, height: data.height }}
        >
            <Handle position={Position.Top} type="target" />
            <div className={classes.flowFrameHeader}>
                <span className={classes.flowFrameIndex}>#{data.index}</span>
                <span className={classes.flowFrameName}>{data.name || '—'}</span>
                {data.responseType && (
                    <span className={classes.flowFrameType}>→ {data.responseType}</span>
                )}
                {!data.isReachable && <span className={classes.flowFrameNote}>unreachable</span>}
            </div>
            <Handle position={Position.Bottom} type="source" />
        </div>
    )
}

const buildRoundedPath = (points: XYPosition[]): string => {
    const [first, ...rest] = points
    let path = `M ${first.x} ${first.y}`

    rest.forEach((point, index) => {
        const next = rest[index + 1]

        if (!next) {
            path += ` L ${point.x} ${point.y}`
            return
        }

        const previous = points[index]
        const inLength = Math.hypot(point.x - previous.x, point.y - previous.y)
        const outLength = Math.hypot(next.x - point.x, next.y - point.y)
        const radius = Math.min(CORNER_RADIUS, inLength / 2, outLength / 2)

        const before = {
            x: point.x - ((point.x - previous.x) / inLength) * radius,
            y: point.y - ((point.y - previous.y) / inLength) * radius
        }
        const after = {
            x: point.x + ((next.x - point.x) / outLength) * radius,
            y: point.y + ((next.y - point.y) / outLength) * radius
        }

        path += ` L ${before.x} ${before.y} Q ${point.x} ${point.y} ${after.x} ${after.y}`
    })

    return path
}

function RoutedEdge({ id, data, markerEnd, style }: EdgeProps<TFlowEdge>) {
    const points = data?.points

    if (!points || points.length < 2) return null

    const label = data.label ?? (data.branch === 'out' ? undefined : data.branch)
    const [start, second] = points

    return (
        <>
            <BaseEdge id={id} markerEnd={markerEnd} path={buildRoundedPath(points)} style={style} />
            {label && (
                <EdgeLabelRenderer>
                    <div
                        className={classes.flowEdgeLabel}
                        style={{
                            color: BRANCH_COLORS[data.branch],
                            transform: `translate(-50%, -50%) translate(${start.x + (second.x - start.x) * 0.35}px, ${start.y + (second.y - start.y) * 0.35}px)`
                        }}
                    >
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    )
}

export const NODE_TYPES = { check: CheckNode, frame: FrameNode, terminal: TerminalNode }
export const EDGE_TYPES = { routed: RoutedEdge }

export const decorateEdge = (edge: TFlowEdge): TFlowEdge => {
    const color = BRANCH_COLORS[edge.data?.branch ?? 'out']

    return {
        ...edge,
        type: 'routed',
        style: { stroke: color, strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 }
    }
}
