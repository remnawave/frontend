import { useNodesStoreActions } from '@entitites/dashboard/nodes'
import { NodeCardWidget } from '../node-card'
import { IProps } from './interfaces'

export function NodesTableWidget(props: IProps) {
    const { nodes } = props

    if (!nodes) {
        return null
    }

    return (
        <>
            {nodes.map((node) => (
                <NodeCardWidget node={node} />
            ))}
        </>
    )
}
