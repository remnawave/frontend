import { useMemo } from 'react'

import { buildRuleFlow } from './build-rule-flow'
import { FlowCanvas } from './flow-canvas'
import { layoutSection } from './flow-layout'

interface IProps {
    conditions: unknown[]
    operator: unknown
    responseType: string
}

export function RuleFlow({ conditions, operator, responseType }: IProps) {
    const flow = useMemo(
        () => buildRuleFlow(conditions, operator, responseType),
        [conditions, operator, responseType]
    )

    return (
        <FlowCanvas
            initialEdges={flow.edges}
            initialNodes={flow.nodes}
            layoutFlow={layoutSection}
        />
    )
}
