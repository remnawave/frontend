import { Badge, Box, Center, Drawer, Group, Loader, Stack, Text } from '@mantine/core'
import { GetInternalSquadAccessibleNodesCommand } from '@remnawave/backend-contract'
import { TbChevronRight, TbServer } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { PiTag } from 'react-icons/pi'
import { useState } from 'react'
import clsx from 'clsx'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetInternalSquadAccessibleNodes } from '@shared/api/hooks'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { XrayLogo } from '@shared/ui/logos'

import classes from './internal-squad-accessible-nodes.module.css'

type AccessibleNode =
    GetInternalSquadAccessibleNodesCommand.Response['response']['accessibleNodes'][number]
type ActiveInbound = string

export const InternalSquadAccessibleNodesModalWidget = () => {
    const { t } = useTranslation()

    const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([])

    const { isOpen, internalState } = useModalState(MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER)
    const close = useModalClose(MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER)

    const { data: internalSquadAccessibleNodes, isLoading } = useGetInternalSquadAccessibleNodes({
        route: {
            uuid: internalState?.squadUuid ?? ''
        },
        rQueryParams: {
            enabled: !!internalState
        }
    })

    const returnLoading = () => {
        return (
            <Center h={200}>
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">
                        {t('user-accessible-nodes.modal.widget.loading-accessible-nodes')}
                    </Text>
                </Stack>
            </Center>
        )
    }

    const renderAccessibleNodes = () => {
        if (!internalSquadAccessibleNodes?.accessibleNodes?.length) {
            return (
                <Center h={200}>
                    <Stack align="center" gap="md">
                        <TbServer color="var(--mantine-color-gray-5)" size={48} />
                        <Text c="dimmed" size="lg" ta="center">
                            {t(
                                'user-accessible-nodes.modal.widget.no-accessible-nodes-found-for-this-user'
                            )}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        return (
            <Stack gap="lg">
                <Group gap="md" wrap="wrap">
                    <Badge
                        color="blue"
                        leftSection={<TbServer size={18} />}
                        size="lg"
                        variant="light"
                    >
                        {internalSquadAccessibleNodes.accessibleNodes.length} {t('constants.nodes')}
                    </Badge>

                    <Badge
                        color="orange"
                        leftSection={<PiTag size={18} />}
                        size="lg"
                        variant="light"
                    >
                        {internalSquadAccessibleNodes.accessibleNodes.reduce(
                            (acc, node) => acc + node.activeInbounds.length,
                            0
                        )}{' '}
                        Inbounds
                    </Badge>
                </Group>

                <DataTable
                    borderRadius="md"
                    columns={[
                        {
                            accessor: 'nodeName',
                            title: 'Nodes / Inbounds',
                            noWrap: true,
                            render: (node: AccessibleNode) => (
                                <>
                                    <TbChevronRight
                                        className={clsx(classes.icon, classes.expandIcon, {
                                            [classes.expandIconRotated]: expandedNodeIds.includes(
                                                node.uuid
                                            )
                                        })}
                                    />
                                    <CountryFlag
                                        className={classes.icon}
                                        countryCode={node.countryCode}
                                    />

                                    <span>{node.nodeName}</span>
                                </>
                            )
                        },
                        {
                            accessor: 'configProfileName',
                            title: 'Config Profile',
                            textAlign: 'right',
                            width: 200,
                            render: (node: AccessibleNode) => (
                                <Group gap="xs" justify="flex-end">
                                    <XrayLogo size={16} />
                                    <span>{node.configProfileName}</span>
                                </Group>
                            )
                        },
                        {
                            accessor: 'activeInbounds',
                            textAlign: 'right',
                            width: 150,
                            title: 'Inbounds',
                            render: (node: AccessibleNode) => node.activeInbounds.length
                        }
                    ]}
                    highlightOnHover
                    idAccessor="uuid"
                    records={internalSquadAccessibleNodes.accessibleNodes}
                    rowExpansion={{
                        allowMultiple: true,
                        expanded: {
                            recordIds: expandedNodeIds,
                            onRecordIdsChange: setExpandedNodeIds
                        },
                        content: ({ record: node }) => (
                            <DataTable
                                columns={[
                                    {
                                        accessor: 'inbound',
                                        noWrap: true,
                                        render: (inbound: ActiveInbound) => (
                                            <Box component="span" ml={20}>
                                                <PiTag className={classes.icon} />
                                                <span>{inbound}</span>
                                            </Box>
                                        )
                                    }
                                ]}
                                idAccessor={(inbound: ActiveInbound) => `${node.uuid}-${inbound}`}
                                noHeader
                                records={node.activeInbounds}
                                withColumnBorders
                                withRowBorders
                            />
                        )
                    }}
                    withColumnBorders
                    withRowBorders
                    withTableBorder
                />
            </Stack>
        )
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={close}
            opened={isOpen}
            position="right"
            size="800px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbServer}
                    iconVariant="gradient-teal"
                    title={t(
                        'internal-squad-accessible-nodes.modal.widget.internal-squad-accessible-nodes'
                    )}
                />
            }
        >
            {isLoading && returnLoading()}
            {!isLoading && internalSquadAccessibleNodes && renderAccessibleNodes()}
        </Drawer>
    )
}
