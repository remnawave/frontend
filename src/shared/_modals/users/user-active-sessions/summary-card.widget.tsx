import { ActionIcon, Group, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbQuestionMark, TbRadar, TbRefresh, TbUnlink } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { formatInt } from '@shared/utils/misc'

import { RequirementsWidget } from './requirements.widget'

interface IProps {
    distinctIps: number
    ipStats?: ReactNode
    onDropAll: () => void
    onRefresh: () => void
    totalIps: number
}

export const SummaryCardWidget = ({
    distinctIps,
    ipStats,
    onDropAll,
    onRefresh,
    totalIps
}: IProps) => {
    const { t } = useTranslation()

    const openRequirements = () =>
        modals.open({
            centered: true,
            children: <RequirementsWidget />,
            title: (
                <BaseOverlayHeader
                    iconColor="yellow"
                    IconComponent={TbAlertTriangle}
                    iconVariant="soft"
                    title={t('active-sessions-drawer.widget.requirements')}
                />
            )
        })

    return (
        <SectionCard.Root gap="md">
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        iconColor="teal"
                        IconComponent={TbRadar}
                        iconVariant="soft"
                        subtitle={t('active-sessions-drawer.widget.active-ips-across-nodes')}
                        title={formatInt(totalIps)}
                    />

                    <Group gap="xs">
                        <Tooltip label={t('active-sessions-drawer.widget.requirements')}>
                            <ActionIcon
                                color="yellow"
                                onClick={openRequirements}
                                size="lg"
                                variant="soft"
                            >
                                <TbQuestionMark size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip
                            label={t(
                                'user-active-session-drawer.widget.drop-all-user-connections-all-nodes'
                            )}
                        >
                            <ActionIcon color="orange" onClick={onDropAll} size="lg" variant="soft">
                                <TbUnlink size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('common.action.refresh')}>
                            <ActionIcon color="indigo" onClick={onRefresh} size="lg" variant="soft">
                                <TbRefresh size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </SectionCard.Section>

            {distinctIps > 0 && (
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="yellow"
                        IconComponent={TbAlertTriangle}
                        iconVariant="soft"
                        subtitle={t('active-sessions-drawer.widget.distinct-ips')}
                        title={formatInt(distinctIps)}
                    />
                </SectionCard.Section>
            )}

            {ipStats && <SectionCard.Section>{ipStats}</SectionCard.Section>}
        </SectionCard.Root>
    )
}
