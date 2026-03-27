import {
    ActionIcon,
    Avatar,
    Center,
    Divider,
    Group,
    MantineStyleProp,
    Stack,
    Text,
    ThemeIcon
} from '@mantine/core'
import { GetInfraBillingHistoryRecordsCommand } from '@remnawave/backend-contract'
import { TbCreditCard, TbTrash } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'
import dayjs from 'dayjs'

import { faviconResolver, formatCurrencyWithIntl } from '@shared/utils/misc'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useDeleteInfraBillingHistoryRecord } from '@shared/api/hooks'
import { formatTimeUtil } from '@shared/utils/time-utils'
import { SectionCard } from '@shared/ui/section-card'

type Record = GetInfraBillingHistoryRecordsCommand.Response['response']['records'][number]

interface MonthGroup {
    label: string
    records: Record[]
}

interface IProps {
    records: GetInfraBillingHistoryRecordsCommand.Response['response']['records']
    refetchRecords: () => void
    style: MantineStyleProp
}

export function MobileRecordsListWidget(props: IProps) {
    const { records, refetchRecords, style } = props
    const { i18n, t } = useTranslation()

    const { mutate: deleteRecord } = useDeleteInfraBillingHistoryRecord({
        mutationFns: {
            onSuccess: () => {
                refetchRecords()
            }
        }
    })

    const handleDelete = (uuid: string) =>
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: { confirm: t('common.delete'), cancel: t('common.cancel') },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => deleteRecord({ route: { uuid } })
        })

    const groupedByMonth = useMemo((): MonthGroup[] => {
        const groups = new Map<string, Record[]>()

        for (const record of records) {
            const key = dayjs(record.billedAt).format('YYYY-MM')
            const existing = groups.get(key)
            if (existing) {
                existing.push(record)
            } else {
                groups.set(key, [record])
            }
        }

        return Array.from(groups.entries()).map(([key, groupRecords]) => ({
            label: dayjs(key).locale(i18n.language).format('MMMM YYYY'),
            records: groupRecords
        }))
    }, [records, i18n.language])

    if (records.length === 0) {
        return (
            <SectionCard.Root p="xl">
                <SectionCard.Section>
                    <Center py="xl">
                        <Stack align="center" gap="lg">
                            <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                <TbCreditCard size={32} />
                            </ThemeIcon>

                            <Stack align="center" gap="xs">
                                <Text c="dimmed" fw={600} size="md" ta="center">
                                    {t(
                                        'infra-billing-records-table.widget.no-billing-records-found'
                                    )}
                                </Text>
                            </Stack>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    return (
        <Stack gap="md" style={style}>
            {groupedByMonth.map((group) => (
                <Stack gap="xs" key={group.label}>
                    <Divider
                        label={
                            <Text fw={600} size="xs" tt="capitalize">
                                {group.label}
                            </Text>
                        }
                        labelPosition="center"
                    />

                    {group.records.map((record) => (
                        <SectionCard.Root key={record.uuid}>
                            <SectionCard.Section>
                                <Group justify="space-between" wrap="nowrap">
                                    <BaseOverlayHeader
                                        icon={
                                            <Avatar
                                                alt={record.provider.name}
                                                color="initials"
                                                name={record.provider.name}
                                                onLoad={(event) => {
                                                    const img = event.target as HTMLImageElement
                                                    if (
                                                        img.naturalWidth <= 24 &&
                                                        img.naturalHeight <= 24
                                                    ) {
                                                        img.src = ''
                                                    }
                                                }}
                                                radius="sm"
                                                size={18}
                                                src={faviconResolver(record.provider.faviconLink)}
                                            />
                                        }
                                        iconColor="teal"
                                        IconComponent={TbCreditCard}
                                        iconVariant="soft"
                                        subtitle={formatTimeUtil({
                                            language: i18n.language,
                                            template: 'FULL_DATE',
                                            time: record.billedAt
                                        })}
                                        title={record.provider.name}
                                    />

                                    <Group gap="xs" wrap="nowrap">
                                        <Text
                                            c="teal"
                                            fw={700}
                                            size="sm"
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            {formatCurrencyWithIntl(record.amount)}
                                        </Text>
                                        <ActionIcon
                                            color="red"
                                            onClick={() => handleDelete(record.uuid)}
                                            size="input-xs"
                                            variant="soft"
                                        >
                                            <TbTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </SectionCard.Section>
                        </SectionCard.Root>
                    ))}
                </Stack>
            ))}
        </Stack>
    )
}
