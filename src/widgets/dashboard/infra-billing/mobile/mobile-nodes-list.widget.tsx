import {
    ActionIcon,
    Badge,
    Center,
    Group,
    MantineStyleProp,
    Stack,
    Text,
    ThemeIcon
} from '@mantine/core'
import { TbCalendar, TbCheck, TbCreditCard, TbServer } from 'react-icons/tb'
import { GetInfraBillingNodesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import dayjs from 'dayjs'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QueryKeys, useUpdateInfraBillingNode } from '@shared/api/hooks'
import { formatTimeUtil } from '@shared/utils/time-utils'
import { SectionCard } from '@shared/ui/section-card'
import { queryClient } from '@shared/api'

type BillingNode = GetInfraBillingNodesCommand.Response['response']['billingNodes'][number]

function getNodeStatus(nextBillingAt: Date, language: string) {
    const now = dayjs().startOf('day').locale(language)
    const target = dayjs(nextBillingAt).startOf('day').locale(language)
    const isOverdue = target.isBefore(now)

    return {
        label: target.fromNow(),
        color: isOverdue ? 'red' : 'teal',
        isOverdue
    }
}

interface IProps {
    nodes: GetInfraBillingNodesCommand.Response['response']['billingNodes']
    style: MantineStyleProp
}

export function MobileNodesListWidget(props: IProps) {
    const { nodes, style } = props
    const openModalWithData = useModalsStoreOpenWithData()
    const { t, i18n } = useTranslation()
    const [updatingUuids, setUpdatingUuids] = useState<Set<string>>(new Set())

    const { mutate: updateNode } = useUpdateInfraBillingNode({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.infraBilling.getInfraBillingNodes.queryKey, data)
                setUpdatingUuids(new Set())
            },
            onError: () => setUpdatingUuids(new Set())
        }
    })

    const handleQuickUpdate = (uuid: string, currentDate: Date) => {
        setUpdatingUuids((prev) => new Set(prev).add(uuid))
        updateNode({
            variables: {
                uuids: [uuid],
                // @ts-expect-error - TODO: fix ZOD schema
                nextBillingAt: dayjs(currentDate).add(1, 'month').toISOString()
            }
        })
    }

    const handleClickBillingAt = (node: BillingNode) => {
        openModalWithData(MODALS.UPDATE_BILLING_DATE_MODAL, {
            uuids: [node.uuid],
            nextBillingAt: node.nextBillingAt
        })
    }

    if (nodes.length === 0) {
        return (
            <SectionCard.Root p="xl">
                <SectionCard.Section>
                    <Center py="xl">
                        <Stack align="center" gap="lg">
                            <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                <TbServer size={32} />
                            </ThemeIcon>

                            <Stack align="center" gap="xs">
                                <Text c="dimmed" fw={600} size="md" ta="center">
                                    {t('infra-billing-nodes.widget.no-nodes-found')}
                                </Text>
                            </Stack>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    return (
        <Stack gap="xs" style={style}>
            {nodes.map((node) => {
                const status = getNodeStatus(node.nextBillingAt, i18n.language)

                return (
                    <SectionCard.Root key={node.uuid}>
                        <SectionCard.Section>
                            <Group justify="space-between" wrap="nowrap">
                                <BaseOverlayHeader
                                    countryCode={node.node.countryCode}
                                    hideIcon={true}
                                    iconColor="blue"
                                    IconComponent={TbServer}
                                    iconVariant="soft"
                                    subtitle={node.provider.name}
                                    title={node.node.name}
                                />

                                <Badge
                                    color={status.color}
                                    leftSection={<TbCreditCard size={16} />}
                                    radius="sm"
                                    size="md"
                                    variant="soft"
                                >
                                    {status.label}
                                </Badge>
                            </Group>
                        </SectionCard.Section>

                        <SectionCard.Section>
                            <Group justify="space-between" wrap="nowrap">
                                <Group
                                    gap={6}
                                    onClick={() => handleClickBillingAt(node)}
                                    style={{ cursor: 'pointer' }}
                                    wrap="nowrap"
                                >
                                    <TbCalendar
                                        color={`var(--mantine-color-${status.color}-5)`}
                                        size={16}
                                    />
                                    <Text c={status.color} fw={600} size="sm">
                                        {formatTimeUtil({
                                            time: node.nextBillingAt,
                                            template: 'FULL_DATE',
                                            language: i18n.language
                                        })}
                                    </Text>
                                </Group>

                                <Group gap={4} wrap="nowrap">
                                    <ActionIcon
                                        color="teal"
                                        loading={updatingUuids.has(node.uuid)}
                                        onClick={() =>
                                            handleQuickUpdate(node.uuid, node.nextBillingAt)
                                        }
                                        size="input-xs"
                                        variant="soft"
                                    >
                                        <TbCheck size={18} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </SectionCard.Section>
                    </SectionCard.Root>
                )
            })}
        </Stack>
    )
}
