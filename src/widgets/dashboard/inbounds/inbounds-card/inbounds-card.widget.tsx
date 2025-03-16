import {
    Badge,
    Button,
    Card,
    Divider,
    Group,
    JsonInput,
    NumberFormatter,
    Paper,
    SimpleGrid,
    Text,
    Tooltip
} from '@mantine/core'
import {
    PiCode,
    PiCpu,
    PiDoorOpen,
    PiGlobe,
    PiLockSimple,
    PiMinus,
    PiPlus,
    PiTag,
    PiUserList
} from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import {
    useAddInboundToNodes,
    useAddInboundToUsers,
    useGetFullInbounds,
    useRemoveInboundFromNodes,
    useRemoveInboundFromUsers
} from '@shared/api/hooks'

import { baseNotificationsMutations } from './base-notification-mutations'
import { IProps } from './interfaces'

export function InboundsCardWidget(props: IProps) {
    const { inbound } = props
    const { t } = useTranslation()

    const { refetch: refetchInbounds } = useGetFullInbounds()

    const { mutate: removeInboundFromUsers } = useRemoveInboundFromUsers({
        mutationFns: baseNotificationsMutations('remove-inbound', refetchInbounds)
    })

    const { mutate: addInboundToUsers } = useAddInboundToUsers({
        mutationFns: baseNotificationsMutations('add-inbound', refetchInbounds)
    })

    const { mutate: removeInboundFromNodes } = useRemoveInboundFromNodes({
        mutationFns: baseNotificationsMutations('remove-inbound-from-nodes', refetchInbounds)
    })

    const { mutate: addInboundToNodes } = useAddInboundToNodes({
        mutationFns: baseNotificationsMutations('add-inbound-to-nodes', refetchInbounds)
    })

    return (
        <Paper p="md" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <PiTag size="1.2rem" />
                    <Text fw={600} size="lg">
                        {inbound.tag}
                    </Text>
                </Group>

                <Group gap="xs">
                    <Badge color={inbound.nodes.enabled > 0 ? 'green' : 'red'} size="lg">
                        {inbound.type}
                    </Badge>
                    <Badge leftSection={<PiDoorOpen size="1.1rem" />} size="lg">
                        {inbound.port}
                    </Badge>
                    {inbound.network && (
                        <Badge color="grape" leftSection={<PiGlobe size="1.1rem" />} size="lg">
                            {inbound.network}
                        </Badge>
                    )}
                    {inbound.security && (
                        <Badge color="gray" leftSection={<PiLockSimple size="1.1rem" />} size="lg">
                            {inbound.security}
                        </Badge>
                    )}
                </Group>
            </Group>

            <Divider />

            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
                <Card padding="sm" radius="md" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Group gap="xs">
                            <PiCpu size="1.1rem" />
                            <Text fw={500}>{t('inbounds-card.widget.nodes')}</Text>
                        </Group>

                        <Group gap="xs">
                            <Tooltip label={t('inbounds-card.widget.enabled-nodes')}>
                                <Badge color="green" size="lg">
                                    <NumberFormatter
                                        thousandSeparator
                                        value={inbound.nodes.enabled}
                                    />
                                </Badge>
                            </Tooltip>
                            <Tooltip label={t('inbounds-card.widget.disabled-nodes')}>
                                <Badge color="red" size="lg">
                                    <NumberFormatter
                                        thousandSeparator
                                        value={inbound.nodes.disabled}
                                    />
                                </Badge>
                            </Tooltip>
                        </Group>
                    </Group>

                    <Group grow mt="xs">
                        <Button
                            color="red"
                            disabled={inbound.nodes.enabled === 0}
                            leftSection={<PiMinus size="0.9rem" />}
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: 'Are you sure?',
                                    centered: true,
                                    children: (
                                        <>
                                            <Text fw={800} size="sm">
                                                {t(
                                                    'inbounds-card.widget.remove-nodes-from-inbound-line-1'
                                                )}
                                            </Text>
                                            <Text fw={600} size="sm">
                                                {t(
                                                    'inbounds-card.widget.remove-nodes-from-inbound-line-2'
                                                )}
                                            </Text>
                                        </>
                                    ),
                                    labels: {
                                        confirm: t('inbounds-card.widget.remove'),
                                        cancel: t('inbounds-card.widget.cancel')
                                    },
                                    confirmProps: { color: 'red' },
                                    onConfirm: () => {
                                        removeInboundFromNodes({
                                            variables: {
                                                inboundUuid: inbound.uuid
                                            }
                                        })
                                    }
                                })
                            }}
                            size="xs"
                            variant="light"
                        >
                            {t('inbounds-card.widget.remove')}
                        </Button>
                        <Button
                            color="green"
                            disabled={inbound.nodes.disabled === 0}
                            leftSection={<PiPlus size="0.9rem" />}
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: 'Are you sure?',
                                    centered: true,
                                    children: (
                                        <>
                                            <Text fw={800} size="sm">
                                                {t(
                                                    'inbounds-card.widget.add-nodes-to-inbound-line-1'
                                                )}
                                            </Text>
                                            <Text fw={600} size="sm">
                                                {t(
                                                    'inbounds-card.widget.add-nodes-to-inbound-line-2'
                                                )}
                                            </Text>
                                        </>
                                    ),
                                    labels: {
                                        confirm: t('inbounds-card.widget.add'),
                                        cancel: 'Cancel'
                                    },
                                    confirmProps: { color: 'green' },
                                    onConfirm: () => {
                                        addInboundToNodes({
                                            variables: {
                                                inboundUuid: inbound.uuid
                                            }
                                        })
                                    }
                                })
                            }}
                            size="xs"
                            variant="light"
                        >
                            {t('inbounds-card.widget.add')}
                        </Button>
                    </Group>
                </Card>

                {/* Users section */}
                <Card padding="sm" radius="md" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Group gap="xs">
                            <PiUserList size="1.1rem" />
                            <Text fw={500}>{t('inbounds-card.widget.users')}</Text>
                        </Group>

                        <Group gap="xs">
                            <Tooltip label={t('inbounds-card.widget.enabled-users')}>
                                <Badge color="green" size="lg">
                                    <NumberFormatter
                                        thousandSeparator
                                        value={inbound.users.enabled}
                                    />
                                </Badge>
                            </Tooltip>
                            <Tooltip label={t('inbounds-card.widget.disabled-users')}>
                                <Badge color="red" size="lg">
                                    <NumberFormatter
                                        thousandSeparator
                                        value={inbound.users.disabled}
                                    />
                                </Badge>
                            </Tooltip>
                        </Group>
                    </Group>

                    <Group grow mt="xs">
                        <Button
                            color="red"
                            disabled={inbound.users.enabled === 0}
                            leftSection={<PiMinus size="0.9rem" />}
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: 'Are you sure?',
                                    centered: true,
                                    children: (
                                        <>
                                            <Text fw={800} size="sm">
                                                {t(
                                                    'inbounds-card.widget.remove-users-from-inbound-line-1'
                                                )}
                                            </Text>
                                            <Text fw={600} size="sm">
                                                {t(
                                                    'inbounds-card.widget.remove-users-from-inbound-line-2'
                                                )}
                                            </Text>
                                        </>
                                    ),
                                    labels: {
                                        confirm: t('inbounds-card.widget.remove'),
                                        cancel: t('inbounds-card.widget.cancel')
                                    },
                                    confirmProps: { color: 'red' },
                                    onConfirm: () => {
                                        removeInboundFromUsers({
                                            variables: {
                                                inboundUuid: inbound.uuid
                                            }
                                        })
                                    }
                                })
                            }}
                            size="xs"
                            variant="light"
                        >
                            {t('inbounds-card.widget.remove')}
                        </Button>
                        <Button
                            color="green"
                            disabled={inbound.users.disabled === 0}
                            leftSection={<PiPlus size="0.9rem" />}
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: t('inbounds-card.widget.are-you-sure'),
                                    centered: true,
                                    children: (
                                        <>
                                            <Text fw={800} size="sm">
                                                {t(
                                                    'inbounds-card.widget.add-users-to-inbound-line-1'
                                                )}
                                            </Text>
                                            <Text fw={600} size="sm">
                                                {t(
                                                    'inbounds-card.widget.add-users-to-inbound-line-2'
                                                )}
                                            </Text>
                                        </>
                                    ),
                                    labels: {
                                        confirm: t('inbounds-card.widget.add'),
                                        cancel: t('inbounds-card.widget.cancel')
                                    },
                                    confirmProps: { color: 'green' },
                                    onConfirm: () => {
                                        addInboundToUsers({
                                            variables: {
                                                inboundUuid: inbound.uuid
                                            }
                                        })
                                    }
                                })
                            }}
                            size="xs"
                            variant="light"
                        >
                            {t('inbounds-card.widget.add')}
                        </Button>
                    </Group>
                </Card>
            </SimpleGrid>

            <Group justify="center" mt="md">
                <Button
                    color="gray"
                    leftSection={<PiCode size="1rem" />}
                    onClick={() => {
                        modals.open({
                            centered: true,
                            size: 'lg',
                            title: t('inbounds-card.widget.raw-inbound'),
                            children: (
                                <Paper>
                                    <JsonInput
                                        autosize
                                        maxRows={100}
                                        minRows={4}
                                        readOnly
                                        value={JSON.stringify(inbound.rawFromConfig, null, 2)}
                                    />
                                </Paper>
                            )
                        })
                    }}
                    size="sm"
                    variant="subtle"
                >
                    {t('inbounds-card.widget.show-raw-inbound')}
                </Button>
            </Group>
        </Paper>
    )
}
