import { Badge, Center, Group, Stack, Text } from '@mantine/core'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { PiEmptyDuotone, PiUsersDuotone } from 'react-icons/pi'
import { TbServer, TbServer2 } from 'react-icons/tb'
import ReactCountryFlag from 'react-country-flag'
import { Spotlight } from '@mantine/spotlight'
import { useTranslation } from 'react-i18next'

import { useNodesStoreActions } from '@entities/dashboard/nodes'

import { NodeStatusBadgeWidget } from '../node-status-badge'

interface IProps {
    nodes: GetAllNodesCommand.Response['response']
}

export const NodesSpotlightSearchWidget = ({ nodes }: IProps) => {
    const actions = useNodesStoreActions()
    const { t } = useTranslation()

    const handleViewNode = (value: null | string) => {
        if (!value) {
            return
        }

        const node = nodes.find((node) => node.uuid === value)
        if (node) {
            actions.setNode(node)
            actions.toggleEditModal(true)
        }
    }

    return (
        <Spotlight
            actions={nodes.map((node) => ({
                label: node.name,
                description: `${node.address} ${node.provider?.name ? `| ${node.provider.name}` : ''}`,
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
                            color={node.usersOnline! > 0 ? 'teal' : 'gray'}
                            leftSection={<PiUsersDuotone size={14} />}
                            miw={'7ch'}
                            radius="md"
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
            nothingFound={
                <Center h="230">
                    <Stack align="center" gap="xs">
                        <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                        <Text c="dimmed" size="sm">
                            {t('nodes-spotlight-search.widget.no-nodes-found')}
                        </Text>
                    </Stack>
                </Center>
            }
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            scrollable
            searchProps={{
                leftSection: <TbServer2 size={20} />,
                placeholder: t('nodes-spotlight-search.widget.search-by-name-or-address')
            }}
            shortcut={['mod + F']}
        />
    )
}
