import { Box, Center, Loader, MantineStyleProp, Stack, Text, ThemeIcon } from '@mantine/core'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCreditCard } from 'react-icons/tb'

import { SectionCard } from '@shared/ui/section-card'

import styles from './fade-mask.module.css'
import { BillingRecord, groupRecordsByMonth } from './group-records-by-month'
import { MonthDivider } from './month-divider'
import { RecordCard } from './record-card'
import { useDeleteBillingRecord } from './use-delete-billing-record'

type Row =
    | { key: string; label: string; total: number; type: 'divider' }
    | { key: string; record: BillingRecord; type: 'record' }

const DIVIDER_ESTIMATE = 34
const RECORD_ESTIMATE = 72
const ROW_GAP = 8
const REACH_BOTTOM_THRESHOLD = 300

interface IProps {
    height: string
    isLoadingMore: boolean
    onReachBottom: () => void
    records: BillingRecord[]
    refetchRecords: () => void
    style?: MantineStyleProp
}

export function VirtualizedRecordsList(props: IProps) {
    const { height, isLoadingMore, onReachBottom, records, refetchRecords, style } = props
    const { i18n, t } = useTranslation()

    const handleDelete = useDeleteBillingRecord(refetchRecords)

    const rows = useMemo<Row[]>(() => {
        const groups = groupRecordsByMonth(records, i18n.language)
        const result: Row[] = []

        for (const group of groups) {
            result.push({
                type: 'divider',
                key: `divider-${group.label}`,
                label: group.label,
                total: group.total
            })

            for (const record of group.records) {
                result.push({ type: 'record', key: record.uuid, record })
            }
        }

        return result
    }, [records, i18n.language])

    const scrollRef = useRef<HTMLDivElement>(null)
    const [fade, setFade] = useState({ bottom: false, top: false })

    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollRef.current,
        getItemKey: (index) => rows[index].key,
        estimateSize: (index) =>
            rows[index].type === 'divider' ? DIVIDER_ESTIMATE : RECORD_ESTIMATE,
        overscan: 8
    })

    const updateFade = useCallback(() => {
        const el = scrollRef.current
        if (!el) {
            return
        }

        const { scrollTop, scrollHeight, clientHeight } = el
        const isScrollable = scrollHeight - clientHeight > 1

        setFade({
            top: isScrollable && scrollTop > 4,
            bottom: isScrollable && scrollTop + clientHeight < scrollHeight - 4
        })

        if (isScrollable && scrollTop + clientHeight >= scrollHeight - REACH_BOTTOM_THRESHOLD) {
            onReachBottom()
        }
    }, [onReachBottom])

    useEffect(() => {
        updateFade()
    }, [updateFade, rows.length])

    if (records.length === 0) {
        return (
            <SectionCard.Root p="xl" style={style}>
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

    const fadeClassName =
        [fade.top && styles.fadeTop, fade.bottom && styles.fadeBottom].filter(Boolean).join(' ') ||
        undefined

    return (
        <Box
            className={fadeClassName}
            onScroll={updateFade}
            ref={scrollRef}
            style={{ height, overflowX: 'hidden', overflowY: 'auto', ...style }}
        >
            <Box
                style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                    const row = rows[virtualItem.index]

                    return (
                        <Box
                            data-index={virtualItem.index}
                            key={row.key}
                            ref={virtualizer.measureElement}
                            style={{
                                left: 0,
                                paddingBottom: ROW_GAP,
                                position: 'absolute',
                                top: 0,
                                transform: `translateY(${virtualItem.start}px)`,
                                width: '100%'
                            }}
                        >
                            {row.type === 'divider' ? (
                                <MonthDivider label={row.label} total={row.total} />
                            ) : (
                                <RecordCard onDelete={handleDelete} record={row.record} />
                            )}
                        </Box>
                    )
                })}
            </Box>

            {isLoadingMore && (
                <Center py="sm">
                    <Loader size="sm" />
                </Center>
            )}
        </Box>
    )
}
