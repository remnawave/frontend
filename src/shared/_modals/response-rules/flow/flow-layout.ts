import { Graph, layout } from '@dagrejs/dagre'

import { TFlowEdge, TFlowNode } from './build-rule-flow'

export interface ILaidOutFlow {
    edges: TFlowEdge[]
    nodes: TFlowNode[]
}

export interface ILaidOutSection extends ILaidOutFlow {
    height: number
    width: number
}

const sizeOf = (node: TFlowNode) => ({
    width: node.measured?.width ?? 0,
    height: node.measured?.height ?? 0
})

export const layoutSection = (nodes: TFlowNode[], edges: TFlowEdge[]): ILaidOutSection => {
    const graph = new Graph()

    graph.setGraph({ rankdir: 'TB', nodesep: 36, ranksep: 48, edgesep: 16 })
    graph.setDefaultEdgeLabel(() => ({}))

    nodes.forEach((node) => graph.setNode(node.id, sizeOf(node)))
    edges.forEach((edge) => graph.setEdge(edge.source, edge.target))

    layout(graph)

    const { width = 0, height = 0 } = graph.graph()

    return {
        width,
        height,
        nodes: nodes.map((node) => {
            const { x, y } = graph.node(node.id)
            const size = sizeOf(node)

            return { ...node, position: { x: x - size.width / 2, y: y - size.height / 2 } }
        }),
        edges: edges.map((edge) => ({
            ...edge,
            data: {
                branch: edge.data?.branch ?? 'out',
                label: edge.data?.label,
                points: graph.edge(edge.source, edge.target).points
            }
        }))
    }
}

export const shiftSection = (section: ILaidOutSection, dx: number, dy: number): ILaidOutFlow => ({
    nodes: section.nodes.map((node) => ({
        ...node,
        position: { x: node.position.x + dx, y: node.position.y + dy }
    })),
    edges: section.edges.map((edge) => ({
        ...edge,
        data: edge.data && {
            ...edge.data,
            points: edge.data.points?.map((point) => ({ x: point.x + dx, y: point.y + dy }))
        }
    }))
})
