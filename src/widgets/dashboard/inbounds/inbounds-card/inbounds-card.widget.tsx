import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    CopyButton,
    Divider,
    Group,
    JsonInput,
    NumberFormatter,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import {
    PiCheck,
    PiCopy,
    PiCpu,
    PiDoorOpen,
    PiGlobe,
    PiInfo,
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

    const openRawInboundModal = () => {
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
    }

    const handleRemoveFromNodes = () => {
        modals.openConfirmModal({
            title: t('inbounds-card.widget.are-you-sure'),
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        {t('inbounds-card.widget.remove-nodes-from-inbound-line-1')}
                    </Text>
                    <Text fw={600} size="sm">
                        {t('inbounds-card.widget.remove-nodes-from-inbound-line-2')}
                    </Text>
                </Stack>
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
    }

    const handleAddToNodes = () => {
        modals.openConfirmModal({
            title: t('inbounds-card.widget.are-you-sure'),
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        {t('inbounds-card.widget.add-nodes-to-inbound-line-1')}
                    </Text>
                    <Text fw={600} size="sm">
                        {t('inbounds-card.widget.add-nodes-to-inbound-line-2')}
                    </Text>
                </Stack>
            ),
            labels: {
                confirm: t('inbounds-card.widget.add'),
                cancel: t('inbounds-card.widget.cancel')
            },
            confirmProps: { color: 'teal' },
            onConfirm: () => {
                addInboundToNodes({
                    variables: {
                        inboundUuid: inbound.uuid
                    }
                })
            }
        })
    }

    const handleRemoveFromUsers = () => {
        modals.openConfirmModal({
            title: t('inbounds-card.widget.are-you-sure'),
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        {t('inbounds-card.widget.remove-users-from-inbound-line-1')}
                    </Text>
                    <Text fw={600} size="sm">
                        {t('inbounds-card.widget.remove-users-from-inbound-line-2')}
                    </Text>
                </Stack>
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
    }

    const handleAddToUsers = () => {
        modals.openConfirmModal({
            title: t('inbounds-card.widget.are-you-sure'),
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        {t('inbounds-card.widget.add-users-to-inbound-line-1')}
                    </Text>
                    <Text fw={600} size="sm">
                        {t('inbounds-card.widget.add-users-to-inbound-line-2')}
                    </Text>
                </Stack>
            ),
            labels: {
                confirm: t('inbounds-card.widget.add'),
                cancel: t('inbounds-card.widget.cancel')
            },
            confirmProps: { color: 'teal' },
            onConfirm: () => {
                addInboundToUsers({
                    variables: {
                        inboundUuid: inbound.uuid
                    }
                })
            }
        })
    }

    return (
        <Paper p="md" radius="md" shadow="sm" withBorder>
            <Box mb="md">
                <Group justify="space-between" mb="xs">
                    <Group gap="xs">
                        <PiTag size="1.2rem" />
                        <Text fw={700} size="md">
                            {inbound.tag}
                        </Text>
                    </Group>

                    <Group gap="xs">
                        <CopyButton timeout={2000} value={inbound.uuid}>
                            {({ copied, copy }) => (
                                <Tooltip
                                    label={
                                        copied
                                            ? t('inbounds-card.widget.copied')
                                            : t('inbounds-card.widget.copy-uuid')
                                    }
                                    position="left"
                                >
                                    <ActionIcon
                                        color={copied ? 'teal' : 'gray'}
                                        onClick={copy}
                                        size="md"
                                        variant="subtle"
                                    >
                                        {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>

                        <Tooltip label={t('inbounds-card.widget.show-raw-inbound')}>
                            <ActionIcon
                                color="gray"
                                onClick={openRawInboundModal}
                                size="md"
                                variant="subtle"
                            >
                                <PiInfo size="1rem" />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                <Group gap="xs" mt="xs">
                    <Badge color={inbound.nodes.enabled > 0 ? 'teal' : 'red'} size="md">
                        {inbound.type}
                    </Badge>
                    <Badge leftSection={<PiDoorOpen size="1rem" />} size="md">
                        {inbound.port}
                    </Badge>
                    {inbound.network && (
                        <Badge color="grape" leftSection={<PiGlobe size="1rem" />} size="md">
                            {inbound.network}
                        </Badge>
                    )}
                    {inbound.security && (
                        <Badge color="gray" leftSection={<PiLockSimple size="1rem" />} size="md">
                            {inbound.security}
                        </Badge>
                    )}
                </Group>
            </Box>

            <Divider />

            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md" spacing="md">
                <Card padding="md" radius="md" withBorder>
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <PiCpu size="1.1rem" />
                                <Text fw={600}>{t('inbounds-card.widget.nodes')}</Text>
                            </Group>

                            <Group gap="xs">
                                <Tooltip label={t('inbounds-card.widget.enabled-nodes')}>
                                    <Badge color="teal" size="lg">
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

                        <Group grow>
                            <Button
                                color="red"
                                disabled={inbound.nodes.enabled === 0}
                                leftSection={<PiMinus size="0.9rem" />}
                                onClick={handleRemoveFromNodes}
                                size="sm"
                                variant="light"
                            >
                                {t('inbounds-card.widget.remove')}
                            </Button>
                            <Button
                                color="teal"
                                disabled={inbound.nodes.disabled === 0}
                                leftSection={<PiPlus size="0.9rem" />}
                                onClick={handleAddToNodes}
                                size="sm"
                                variant="light"
                            >
                                {t('inbounds-card.widget.add')}
                            </Button>
                        </Group>
                    </Stack>
                </Card>

                <Card padding="md" radius="md" withBorder>
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <PiUserList size="1.1rem" />
                                <Text fw={600}>{t('inbounds-card.widget.users')}</Text>
                            </Group>

                            <Group gap="xs">
                                <Tooltip label={t('inbounds-card.widget.enabled-users')}>
                                    <Badge color="teal" size="lg">
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

                        <Group grow>
                            <Button
                                color="red"
                                disabled={inbound.users.enabled === 0}
                                leftSection={<PiMinus size="0.9rem" />}
                                onClick={handleRemoveFromUsers}
                                size="sm"
                                variant="light"
                            >
                                {t('inbounds-card.widget.remove')}
                            </Button>
                            <Button
                                color="teal"
                                disabled={inbound.users.disabled === 0}
                                leftSection={<PiPlus size="0.9rem" />}
                                onClick={handleAddToUsers}
                                size="sm"
                                variant="light"
                            >
                                {t('inbounds-card.widget.add')}
                            </Button>
                        </Group>
                    </Stack>
                </Card>
            </SimpleGrid>
        </Paper>
    )
}
