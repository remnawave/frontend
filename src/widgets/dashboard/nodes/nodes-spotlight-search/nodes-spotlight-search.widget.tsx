import { Badge, Group } from '@mantine/core'
import { Spotlight } from '@mantine/spotlight'
import { GetNodesCommand } from '@remnawave/backend-contract'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { PiUsersDuotone } from 'react-icons/pi'
import { TbServer, TbServer2 } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'

import { NodeStatusBadgeWidget } from '../node-status-badge'

interface IProps {
    nodes: GetNodesCommand.Response['response']
}

export const NodesSpotlightSearchWidget = ({ nodes }: IProps) => {
    const { t } = useTranslation()

    const handleViewNode = (value: null | string) => {
        if (!value) {
            return
        }

        const node = nodes.find((node) => node.uuid === value)
        if (node) {
            showModal('nodes_editNodeModal', { nodeUuid: node.uuid })
        }
    }

    return (
        <Spotlight
            actions={nodes.map((node) => ({
                label: node.name,
                description: `${node.address} ${node.provider?.name ? `| ${node.provider.name} | ${node.uuid}` : `| ${node.uuid}`}`,
                id: node.uuid,
                leftSection:
                    node.countryCode && node.countryCode !== 'XX' ? (
                        <ReactCountryFlag
                            countryCode={node.countryCode}
                            style={{
                                fontSize: '1.1em',
                                borderRadius: '2px'
                            }}
                        />
                    ) : (
                        <TbServer color="var(--mantine-color-gray-5)" size={16} />
                    ),
                rightSection: (
                    <Group>
                        <NodeStatusBadgeWidget node={node} withText={false} />
                        <Badge
                            color={(node.usersOnline ?? 0) > 0 ? 'teal' : 'gray'}
                            leftSection={<PiUsersDuotone size={14} />}
                            miw="7ch"
                            size="lg"
                            variant="outline"
                        >
                            {node.usersOnline}
                        </Badge>
                    </Group>
                ),
                onClick: () => handleViewNode(node.uuid)
            }))}
            centered
            highlightQuery
            maxHeight={350}
            nothingFound={<EmptyPageLayout icon={<TbServer size="32px" />} />}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            scrollable
            searchProps={{
                leftSection: <TbServer2 size={20} />,
                placeholder: `${t('common.action.search')}...`
            }}
            shortcut={['mod + F']}
        />
    )
}
