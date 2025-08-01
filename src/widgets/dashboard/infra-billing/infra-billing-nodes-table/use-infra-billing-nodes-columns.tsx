import { ActionIcon, ActionIconGroup, Avatar, Center, Flex, Text } from '@mantine/core'
import { GetInfraBillingNodesCommand } from '@remnawave/backend-contract'
import { HiCalendar, HiOfficeBuilding, HiServer } from 'react-icons/hi'
import { TbClick, TbExternalLink, TbTrash } from 'react-icons/tb'
import { DataTableColumn } from 'mantine-datatable'
import ReactCountryFlag from 'react-country-flag'
import { TFunction } from 'i18next'

import { faviconResolver } from '@shared/utils/misc'

import { InfraBillingNodesTableNextBillingAtCell } from './next-billing-at-cell'
import { InfraProvidersColumnTitle } from './column-title'

export function getInfraBillingNodesColumns(
    handleDeleteInfraBillingNode: (uuid: string) => void,
    t: TFunction
): DataTableColumn<
    // handleOpenModal: (row: GetInfraBillingHistoryRecordsCommand.Response['response']['records'][number]) => void,

    GetInfraBillingNodesCommand.Response['response']['billingNodes'][number]
>[] {
    return [
        {
            accessor: 'actions',
            title: (
                <Center>
                    <TbClick size={16} />
                </Center>
            ),
            width: '0%',
            render: (row) => (
                <ActionIconGroup>
                    <ActionIcon
                        color="gray"
                        onClick={() => handleDeleteInfraBillingNode(row.uuid)}
                        radius={'md'}
                        size="md"
                        variant="outline"
                    >
                        <TbTrash size={16} />
                    </ActionIcon>
                </ActionIconGroup>
            )
        },
        {
            accessor: 'provider.name',
            ellipsis: true,
            title: (
                <InfraProvidersColumnTitle
                    icon={HiOfficeBuilding}
                    title={t('use-infra-billing-nodes-columns.hoster-name')}
                />
            ),
            width: 200,
            render: ({ provider }) => (
                <Flex
                    align="center"
                    gap="sm"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-6)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    style={{
                        cursor: 'pointer'
                    }}
                    title={`Click to open ${provider.loginUrl || ''}`}
                >
                    <Avatar
                        alt={provider.name}
                        color="initials"
                        name={provider.name}
                        onLoad={(event) => {
                            const img = event.target as HTMLImageElement
                            if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                                img.src = ''
                            }
                        }}
                        radius="sm"
                        size={18}
                        src={faviconResolver(provider.faviconLink)}
                    />
                    <Text fw={500} size="sm">
                        {provider.name}
                    </Text>
                    <TbExternalLink
                        color="var(--mantine-color-gray-5)"
                        size={14}
                        style={{ flexShrink: 0 }}
                    />
                </Flex>
            )
        },
        {
            accessor: 'node',
            ellipsis: true,
            title: (
                <InfraProvidersColumnTitle
                    icon={HiServer}
                    title={t('use-infra-billing-nodes-columns.node')}
                />
            ),
            width: 150,
            textAlign: 'center',
            render: ({ node }) => (
                <Flex align="center" gap="xs">
                    {node.countryCode && node.countryCode !== 'XX' && (
                        <ReactCountryFlag
                            countryCode={node.countryCode}
                            style={{
                                fontSize: '1.5em',
                                borderRadius: '2px'
                            }}
                        />
                    )}
                    <Text fw={600} size="sm">
                        {node.name}
                    </Text>
                </Flex>
            )
        },

        {
            accessor: 'nextBillingAt',
            ellipsis: true,
            title: (
                <InfraProvidersColumnTitle
                    icon={HiCalendar}
                    justify="flex-end"
                    title={t('use-infra-billing-nodes-columns.next-billing-at')}
                />
            ),
            width: 200,
            render: ({ nextBillingAt }) => (
                <InfraBillingNodesTableNextBillingAtCell nextBillingAt={nextBillingAt} t={t} />
            )
        }
    ]
}
