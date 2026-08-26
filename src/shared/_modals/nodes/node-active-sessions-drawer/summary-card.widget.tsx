import { ActionIcon, Group, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbQuestionMark, TbRefresh, TbUser } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { formatInt } from '@shared/utils/misc'

import { RequirementsWidget } from './requirements.widget'

interface IProps {
    onRefresh: () => void
    totalUsers: number
    ipStats?: ReactNode
}

export const SummaryCardWidget = ({ onRefresh, totalUsers, ipStats }: IProps) => {
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
        <SectionCard.Root gap="md" allDividers={true}>
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        iconColor="teal"
                        IconComponent={TbUser}
                        iconVariant="soft"
                        subtitle={t('node-active-sessions.drawer.widget.active-users-on-this-node')}
                        title={formatInt(totalUsers)}
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

                        <Tooltip label={t('common.action.refresh')}>
                            <ActionIcon color="indigo" onClick={onRefresh} size="lg" variant="soft">
                                <TbRefresh size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </SectionCard.Section>
            {ipStats && <SectionCard.Section>{ipStats}</SectionCard.Section>}
        </SectionCard.Root>
    )
}
