import { buildRuleFlow, createTerminal, TFlowEdge, TFlowNode } from './build-rule-flow'

export interface IOverviewSection {
    alwaysMatches: boolean
    index: number
    isReachable: boolean
    name: string
    nodeIds: string[]
    responseType: string
}

export interface IRulesOverview {
    disabled: { index: number; name: string }[]
    edges: TFlowEdge[]
    nodes: TFlowNode[]
    sections: IOverviewSection[]
    startId: string
}

interface IRuleLike {
    conditions?: unknown
    enabled?: unknown
    name?: unknown
    operator?: unknown
    responseType?: unknown
}

const START_ID = 'overview-start'

const asRule = (value: unknown): IRuleLike =>
    value && typeof value === 'object' && !Array.isArray(value) ? (value as IRuleLike) : {}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '')

export const buildRulesOverview = (rules: unknown[]): IRulesOverview => {
    const parsed = rules.map((raw, position) => ({ index: position + 1, rule: asRule(raw) }))
    const enabled = parsed.filter(({ rule }) => rule.enabled !== false)

    const nodes: TFlowNode[] = [createTerminal(START_ID, 'start', 'Request')]
    const edges: TFlowEdge[] = []
    const sections: IOverviewSection[] = []

    let isReachable = true

    enabled.forEach(({ index, rule }, position) => {
        const conditions = Array.isArray(rule.conditions) ? rule.conditions : []
        const responseType = asString(rule.responseType)
        const next = enabled[position + 1]

        const flow = buildRuleFlow(conditions, rule.operator, responseType, {
            prefix: `rule-${index}-`,
            withStart: false,
            nextLabel: next ? `✕ → #${next.index}` : '✕ no rule matched → 403'
        })

        nodes.push(...flow.nodes)
        edges.push(...flow.edges)
        sections.push({
            alwaysMatches: conditions.length === 0,
            index,
            isReachable,
            name: asString(rule.name),
            nodeIds: flow.nodes.map((node) => node.id),
            responseType
        })

        if (conditions.length === 0) isReachable = false
    })

    return {
        disabled: parsed
            .filter(({ rule }) => rule.enabled === false)
            .map(({ index, rule }) => ({ index, name: asString(rule.name) })),
        edges,
        nodes,
        sections,
        startId: START_ID
    }
}
