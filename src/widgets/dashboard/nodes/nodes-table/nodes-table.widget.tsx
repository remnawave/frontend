import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'

import { NodeCardWidget } from '../node-card'
import { IProps } from './interfaces'

export function NodesTableWidget(props: IProps) {
    const { nodes } = props

    if (!nodes) {
        return null
    }

    if (nodes.length === 0) {
        return <EmptyPageLayout />
    }

    return (
        <>
            {nodes.map((node) => (
                <NodeCardWidget key={node.uuid} node={node} />
            ))}
        </>
    )
}
