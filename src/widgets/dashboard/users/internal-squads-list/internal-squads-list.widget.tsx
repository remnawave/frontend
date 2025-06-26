import { Checkbox, Group, Stack, Text, TextInput } from '@mantine/core'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TbCirclesRelation } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { memo, useRef } from 'react'

import { InternalSquadCheckboxCard } from '../internal-squad-checkbox-card'
import { IProps } from './interfaces'

export const InternalSquadsListWidget = memo((props: IProps) => {
    const {
        filteredInternalSquads,
        formKey,
        searchQuery,
        setSearchQuery,
        label,
        description,
        ...rest
    } = props

    const { t } = useTranslation()

    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: filteredInternalSquads.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
        overscan: 10
    })

    return (
        <Stack gap="md" mt={10}>
            <Stack gap={0}>
                <Group gap={5}>
                    <TbCirclesRelation size={20} />
                    <Text fw={600} size="sm">
                        {label}
                    </Text>
                </Group>

                <Text c="dimmed" size="sm">
                    {description}
                </Text>
            </Stack>

            <TextInput
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('internal-squads-list.widget.search-internal-squads')}
                value={searchQuery}
            />

            <Checkbox.Group key={formKey} {...rest}>
                <div
                    ref={parentRef}
                    style={{
                        height:
                            filteredInternalSquads.length === 0
                                ? 200
                                : Math.min(200, filteredInternalSquads.length * 80),
                        overflow: 'auto',
                        border: '1px solid var(--mantine-color-gray-7)',
                        borderRadius: '8px',
                        padding: '8px'
                    }}
                >
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        {virtualizer.getVirtualItems().length === 0 && (
                            <div
                                key="no-squads-found"
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    paddingTop: '80px'
                                }}
                            >
                                <Stack align="center" gap="md">
                                    <PiEmpty size={48} />
                                    <Text c="dimmed" size="sm" ta="center">
                                        {t('internal-squads-list.widget.no-squads-found')}
                                    </Text>
                                </Stack>
                            </div>
                        )}

                        {virtualizer.getVirtualItems().map((virtualRow) => {
                            const internalSquad = filteredInternalSquads[virtualRow.index]
                            return (
                                <div
                                    key={internalSquad.uuid}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                        paddingBottom: '0px'
                                    }}
                                >
                                    <InternalSquadCheckboxCard internalSquad={internalSquad} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Checkbox.Group>
        </Stack>
    )
})
