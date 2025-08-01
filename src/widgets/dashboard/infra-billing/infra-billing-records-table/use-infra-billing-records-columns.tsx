import { ActionIcon, ActionIconGroup, Avatar, Center, Flex, Text } from '@mantine/core'
import { GetInfraBillingHistoryRecordsCommand } from '@remnawave/backend-contract'
import { HiCalendar, HiCurrencyDollar, HiOfficeBuilding } from 'react-icons/hi'
import { DataTableColumn } from 'mantine-datatable'
import { TbClick, TbTrash } from 'react-icons/tb'
import { TFunction } from 'i18next'
import dayjs from 'dayjs'

import { faviconResolver, formatCurrencyWithIntl } from '@shared/utils/misc'

import { InfraProvidersColumnTitle } from './column-title'

export function getInfraBillingRecordsColumns(
    handleDeleteInfraBillingRecord: (uuid: string) => void,
    t: TFunction
): DataTableColumn<
    // handleOpenModal: (row: GetInfraBillingHistoryRecordsCommand.Response['response']['records'][number]) => void,

    GetInfraBillingHistoryRecordsCommand.Response['response']['records'][number]
>[] {
    return [
        {
            accessor: 'name',
            ellipsis: true,
            title: (
                <InfraProvidersColumnTitle
                    icon={HiOfficeBuilding}
                    title={t('use-infra-billing-records-columns.hoster-name')}
                />
            ),
            width: 200,
            render: ({ provider: { name, faviconLink } }) => (
                <Flex align="center" gap="sm">
                    <Avatar
                        alt={name}
                        color="initials"
                        name={name}
                        onLoad={(event) => {
                            const img = event.target as HTMLImageElement
                            if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                                img.src = ''
                            }
                        }}
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
            accessor: 'billedAt',
            ellipsis: true,
            title: (
                <InfraProvidersColumnTitle
                    icon={HiCalendar}
                    title={t('use-infra-billing-records-columns.billed-at')}
                />
            ),
            width: 200,
            textAlign: 'right',
            render: ({ billedAt }) => (
                <Text fw={600} size="sm">
                    {dayjs(billedAt).format('D MMMM, YYYY')}
                </Text>
            )
        },
        {
            accessor: 'amount',
            ellipsis: true,
            title: (
                <InfraProvidersColumnTitle
                    icon={HiCurrencyDollar}
                    title={t('use-infra-billing-records-columns.paid')}
                />
            ),
            width: 150,
            textAlign: 'center',
            render: ({ amount }) => (
                <Text fw={600} size="sm">
                    {formatCurrencyWithIntl(amount)}
                </Text>
            )
        },
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
                        onClick={() => handleDeleteInfraBillingRecord(row.uuid)}
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
