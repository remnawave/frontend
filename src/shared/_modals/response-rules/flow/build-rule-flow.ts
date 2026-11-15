import type { Edge, Node, XYPosition } from '@xyflow/react'

import { asNode, IConditionNode } from './condition-node'

export type TFlowBranch = 'no' | 'out' | 'yes'
export type TTerminalKind = 'match' | 'next' | 'start'

export type TCheckNode = Node<{ condition: IConditionNode }, 'check'>
export type TTerminalNode = Node<{ kind: TTerminalKind; label: string }, 'terminal'>
export type TFrameNode = Node<
    {
        height: number
        index: number
        isReachable: boolean
        name: string
        responseType: string
        width: number
    },
    'frame'
>
export type TFlowNode = TCheckNode | TFrameNode | TTerminalNode
export type TFlowEdge = Edge<
    { branch: TFlowBranch; label?: string; points?: XYPosition[] },
    'routed'
>

interface IBuildOptions {
    nextLabel?: string
    prefix?: string
    withStart?: boolean
}

const MATCH_TARGET = '@match'
const NEXT_TARGET = '@next'

export const createTerminal = (id: string, kind: TTerminalKind, label: string): TTerminalNode => ({
    id,
    type: 'terminal',
    position: { x: 0, y: 0 },
    data: { kind, label }
})

export const buildRuleFlow = (
    conditions: unknown[],
    operator: unknown,
    responseType: string,
    options: IBuildOptions = {}
): { edges: TFlowEdge[]; nodes: TFlowNode[] } => {
    const { nextLabel = '✕ next rule', prefix = '', withStart = true } = options
    const startId = `${prefix}start`

    const checks: TCheckNode[] = []
    const terminals: TTerminalNode[] = []
    const edges: TFlowEdge[] = []

    const resolveTarget = (target: string): string => {
        if (target !== MATCH_TARGET && target !== NEXT_TARGET) return target

        const isMatch = target === MATCH_TARGET
        const id = `${prefix}${isMatch ? 'match' : 'next'}-${terminals.length}`
        const label = isMatch ? `✓ ${responseType || 'match'}` : nextLabel

        terminals.push(createTerminal(id, isMatch ? 'match' : 'next', label))

        return id
    }

    const addEdge = (source: string, target: string, branch: TFlowBranch) => {
        const resolved = resolveTarget(target)

        edges.push({
            id: `${source}:${branch}:${resolved}`,
            source,
            sourceHandle: branch,
            target: resolved,
            type: 'routed',
            data: { branch }
        })
    }

    const compileGroup = (
        children: unknown[],
        groupOperator: unknown,
        onTrue: string,
        onFalse: string
    ): string => {
        const isAny = groupOperator === 'OR'
        let entry = isAny ? onFalse : onTrue

        for (const child of [...children].reverse()) {
            entry = isAny ? compile(child, onTrue, entry) : compile(child, entry, onFalse)
        }

        return entry
    }

    const compile = (raw: unknown, onTrue: string, onFalse: string): string => {
        const node = asNode(raw)

        if (Array.isArray(node.conditions)) {
            return compileGroup(node.conditions, node.operator, onTrue, onFalse)
        }

        const id = `${prefix}check-${checks.length}`

        checks.push({ id, type: 'check', position: { x: 0, y: 0 }, data: { condition: node } })
        addEdge(id, onTrue, 'yes')
        addEdge(id, onFalse, 'no')

        return id
    }

    const entry =
        conditions.length > 0
            ? compileGroup(conditions, operator, MATCH_TARGET, NEXT_TARGET)
            : MATCH_TARGET

    if (!withStart) {
        resolveTarget(entry)

        return { edges, nodes: [...checks, ...terminals] }
    }

    addEdge(startId, entry, 'out')

    return { edges, nodes: [createTerminal(startId, 'start', 'Request'), ...checks, ...terminals] }
}
