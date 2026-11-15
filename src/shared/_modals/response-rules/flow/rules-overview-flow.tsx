import { useMemo } from 'react'

import { TFlowEdge, TFlowNode } from './build-rule-flow'
import { buildRulesOverview } from './build-rules-overview'
import classes from './conditions.module.css'
import { FlowCanvas } from './flow-canvas'
import { layoutRulesOverview } from './overview-layout'

interface IProps {
    rules: unknown[]
}

export function RulesOverviewFlow({ rules }: IProps) {
    const overview = useMemo(() => buildRulesOverview(rules), [rules])

    return (
        <FlowCanvas
            className={classes.flowCanvasLarge}
            initialEdges={overview.edges}
            initialNodes={overview.nodes}
            layoutFlow={(nodes: TFlowNode[], edges: TFlowEdge[]) =>
                layoutRulesOverview(overview, nodes, edges, classes.flowDimmed)
            }
        />
    )
}
