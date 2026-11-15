import '@xyflow/react/dist/style.css'
import { useComputedColorScheme } from '@mantine/core'
import {
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesInitialized,
    useNodesState,
    useReactFlow
} from '@xyflow/react'
import { useEffect } from 'react'

import { TFlowEdge, TFlowNode } from './build-rule-flow'
import classes from './conditions.module.css'
import { decorateEdge, EDGE_TYPES, NODE_TYPES } from './flow-elements'
import { ILaidOutFlow } from './flow-layout'

interface IProps {
    className?: string
    initialEdges: TFlowEdge[]
    initialNodes: TFlowNode[]
    layoutFlow: (nodes: TFlowNode[], edges: TFlowEdge[]) => ILaidOutFlow
}

function Canvas({ initialEdges, initialNodes, layoutFlow }: Omit<IProps, 'className'>) {
    const [nodes, setNodes, onNodesChange] = useNodesState<TFlowNode>(initialNodes)
    const [edges, setEdges] = useEdgesState<TFlowEdge>(initialEdges.map(decorateEdge))
    const isLaidOut = nodes.some((node) => node.position.x !== 0 || node.position.y !== 0)

    const isInitialized = useNodesInitialized()
    const { fitView, getNodes } = useReactFlow<TFlowNode, TFlowEdge>()
    const colorScheme = useComputedColorScheme('dark')

    useEffect(() => {
        if (!isInitialized || isLaidOut) return

        const laidOut = layoutFlow(getNodes(), edges)

        setNodes(laidOut.nodes)
        setEdges(laidOut.edges.map(decorateEdge))
        requestAnimationFrame(() => fitView({ padding: 0.1 }))
    }, [isInitialized, isLaidOut])

    return (
        <ReactFlow
            className={isLaidOut ? classes.flow : `${classes.flow} ${classes.flowHidden}`}
            colorMode={colorScheme}
            edges={edges}
            edgesFocusable={false}
            edgeTypes={EDGE_TYPES}
            maxZoom={1.5}
            minZoom={0.05}
            nodes={nodes}
            nodesConnectable={false}
            nodesDraggable={false}
            nodeTypes={NODE_TYPES}
            onNodesChange={onNodesChange}
        >
            <Background gap={16} size={1} />
            <Controls showInteractive={false} />
        </ReactFlow>
    )
}

export function FlowCanvas({ className, ...props }: IProps) {
    return (
        <div className={className ?? classes.flowCanvas}>
            <ReactFlowProvider>
                <Canvas {...props} />
            </ReactFlowProvider>
        </div>
    )
}
