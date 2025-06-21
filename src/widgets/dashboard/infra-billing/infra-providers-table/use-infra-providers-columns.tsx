import {
    ActionIcon,
    ActionIconGroup,
    Avatar,
    Badge,
    Center,
    Flex,
    Group,
    Text
} from '@mantine/core'
import { HiCurrencyDollar, HiLink, HiOfficeBuilding, HiServer } from 'react-icons/hi'
import { GetInfraProvidersCommand } from '@remnawave/backend-contract'
import { TbClick, TbEdit, TbSum, TbTrash } from 'react-icons/tb'
import { DataTableColumn } from 'mantine-datatable'
import ReactCountryFlag from 'react-country-flag'

import { faviconResolver, formatCurrencyWithIntl } from '@shared/utils/misc'

import { InfraProvidersColumnTitle } from './column-title'
import { InfraProvidersTableUrlCell } from './url-cell'

export function getInfraProvidersColumns(
    totalProviders: number,
    totalAmount: number,
    handleOpenModal: (
        row: GetInfraProvidersCommand.Response['response']['providers'][number]
    ) => void,
    handleDeleteInfraProvider: (uuid: string) => void
): DataTableColumn<GetInfraProvidersCommand.Response['response']['providers'][number]>[] {
    return [
        {
            accessor: 'name',
            ellipsis: true,
            title: <InfraProvidersColumnTitle icon={HiOfficeBuilding} title="Hoster name" />,
            width: 200,
            footer: (
                <Group align="center" gap="xs">
                    <TbSum size="1.2em" />
                    <Text fw={600} size="sm">
                        {totalProviders} providers
                    </Text>
                </Group>
            ),
            render: ({ faviconLink, name }) => (
                <Flex align="center" gap="sm">
                    <Avatar
                        alt={name}
                        color="initials"
                        name={name}
                        radius="sm"
                        size={18}
                        src={faviconResolver(faviconLink)}
                    />
                    <Text fw={500} size="sm">
                        {name}
                    </Text>
                </Flex>
            )
        },
        {
            accessor: 'loginUrl',
            title: <InfraProvidersColumnTitle icon={HiLink} title="Login URL" />,
            width: 300,
            render: ({ loginUrl }) => <InfraProvidersTableUrlCell url={loginUrl} />
        },
        {
            accessor: 'billingHistory',
            ellipsis: true,
            title: <InfraProvidersColumnTitle icon={HiCurrencyDollar} title="Total, $" />,
            width: 140,
            textAlign: 'right',
            render: ({ billingHistory }) => (
                <Text fw={600} size="sm">
                    {formatCurrencyWithIntl(billingHistory.totalAmount)}
                </Text>
            ),
            footer: (
                <Group align="center" gap="xs">
                    <TbSum size="1.2em" />
                    <Text fw={600} size="sm">
                        {formatCurrencyWithIntl(totalAmount)}
                    </Text>
                </Group>
            )
        },
        {
            accessor: 'billingNodes',
            ellipsis: true,
            title: <InfraProvidersColumnTitle icon={HiServer} title="Servers" />,
            render: ({ billingNodes }) => (
                <Group gap="xs">
                    {billingNodes.map((node, index) => (
                        <Badge
                            color="gray"
                            key={`${node.nodeUuid}-${index}`}
                            leftSection={
                                <ReactCountryFlag
                                    countryCode={node.countryCode}
                                    style={{ fontSize: '0.8em' }}
                                    svg
                                />
                            }
                            size="sm"
                            style={{
                                backgroundColor: 'var(--mantine-color-dark-7)',
                                borderColor: 'var(--mantine-color-gray-6)',
                                color: 'var(--mantine-color-gray-3)'
                            }}
                            variant="outline"
                        >
                            {node.name}
                        </Badge>
                    ))}
                    {billingNodes.length === 0 && (
                        <Text c="gray.6" size="xs">
                            No servers
                        </Text>
                    )}
                </Group>
            )
        },
        { accessor: 'createdAt', hidden: true },
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
                        color="blue"
                        onClick={() => handleOpenModal(row)}
                        radius={'md'}
                        size="md"
                        variant="outline"
                    >
                        <TbEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                        color="red"
                        onClick={() => handleDeleteInfraProvider(row.uuid)}
                        radius={'md'}
                        size="md"
                        variant="outline"
                    >
                        <TbTrash size={16} />
                    </ActionIcon>
                </ActionIconGroup>
            )
        }
    ]
}
