import { TFlowEdge, TFlowNode, TFrameNode } from './build-rule-flow'
import { IRulesOverview } from './build-rules-overview'
import { ILaidOutFlow, layoutSection, shiftSection } from './flow-layout'

const FRAME_PADDING = 16
const FRAME_HEADER = 32
const FRAME_GAP = 48

const createLink = (
    source: string,
    target: string,
    x: number,
    fromY: number,
    toY: number,
    isFirst: boolean
): TFlowEdge => ({
    id: `link:${source}:${target}`,
    source,
    sourceHandle: isFirst ? 'out' : undefined,
    target,
    type: 'routed',
    data: {
        branch: isFirst ? 'out' : 'no',
        label: isFirst ? undefined : 'no match',
        points: [
            { x, y: fromY },
            { x, y: toY }
        ]
    }
})

export const layoutRulesOverview = (
    overview: IRulesOverview,
    measured: TFlowNode[],
    edges: TFlowEdge[],
    dimmedClassName: string
): ILaidOutFlow => {
    const start = measured.find((node) => node.id === overview.startId)
    const startWidth = start?.measured?.width ?? 0
    const startHeight = start?.measured?.height ?? 0

    const sections = overview.sections.map((section) => {
        const ids = new Set(section.nodeIds)

        return layoutSection(
            measured.filter((node) => ids.has(node.id)),
            edges.filter((edge) => ids.has(edge.source))
        )
    })

    const contentWidth = Math.max(
        startWidth,
        ...sections.map((section) => section.width + FRAME_PADDING * 2)
    )
    const centerX = contentWidth / 2

    const nodes: TFlowNode[] = start
        ? [{ ...start, position: { x: centerX - startWidth / 2, y: 0 } }]
        : []
    const laidOutEdges: TFlowEdge[] = []

    let y = startHeight + FRAME_GAP
    let previous = { id: overview.startId, bottom: startHeight, isOpen: true, isFirst: true }

    sections.forEach((section, position) => {
        const meta = overview.sections[position]
        const width = section.width + FRAME_PADDING * 2
        const height = section.height + FRAME_HEADER + FRAME_PADDING * 2
        const x = centerX - width / 2
        const frameId = `frame-${meta.index}`

        const frame: TFrameNode = {
            id: frameId,
            type: 'frame',
            position: { x, y },
            selectable: false,
            data: {
                height,
                index: meta.index,
                isReachable: meta.isReachable,
                name: meta.name,
                responseType: meta.responseType,
                width
            }
        }

        const shifted = shiftSection(section, x + FRAME_PADDING, y + FRAME_HEADER + FRAME_PADDING)

        nodes.push(
            frame,
            ...shifted.nodes.map((node) =>
                meta.isReachable ? node : { ...node, className: dimmedClassName }
            )
        )
        laidOutEdges.push(...shifted.edges)

        if (previous.isOpen && meta.isReachable) {
            laidOutEdges.push(
                createLink(previous.id, frameId, centerX, previous.bottom, y, previous.isFirst)
            )
        }

        previous = {
            id: frameId,
            bottom: y + height,
            isOpen: meta.isReachable && !meta.alwaysMatches,
            isFirst: false
        }
        y += height + FRAME_GAP
    })

    return { nodes, edges: laidOutEdges }
}
