import { Accordion, Badge, Group, Text, Tooltip } from '@mantine/core'
import { PiCheckBold, PiCpu } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { memo } from 'react'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import type { IProps } from './interfaces/props.interface'

import { VirtualizedInboundsListShared } from '../virtualized-inbounds-list/virtualized-inbounds-list.shared'
import { ActiveNodesListModalShared } from '../active-nodes-list-modal/active-nodes-list.modal.shared'
import { AccordionControlShared } from './accordion-control.shared'

export const ConfigProfileCardShared = memo((props: IProps) => {
    const {
        hideSelectActions,
        profile,
        selectedInbounds,
        onInboundToggle,
        onSelectAllInbounds,
        onUnselectAllInbounds,
        isOpen
    } = props

    const { t } = useTranslation()

    const selectedInboundsFromProfile = profile.inbounds.filter((inbound) =>
        selectedInbounds.has(inbound.uuid)
    ).length

    return (
        <Accordion.Item value={profile.uuid}>
            <AccordionControlShared
                hideSelectActions={hideSelectActions}
                onSelectAllInbounds={onSelectAllInbounds}
                onUnselectAllInbounds={onUnselectAllInbounds}
                profile={profile}
                value={profile.uuid}
            >
                <Group mb="xs">
                    <Text fw={700} size="md">
                        {profile.name}
                    </Text>
                </Group>
                <Group>
                    <Badge
                        color={
                            selectedInboundsFromProfile === profile.inbounds.length
                                ? 'teal'
                                : 'cyan'
                        }
                        leftSection={<PiCheckBold />}
                        size="md"
                        variant="outline"
                    >
                        {selectedInboundsFromProfile} / {profile.inbounds.length}
                    </Badge>

                    <Tooltip label={t('config-profile-card.shared.active-on-nodes')}>
                        <Badge
                            color={profile.nodes.length > 0 ? 'teal' : 'cyan'}
                            leftSection={<PiCpu />}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation()

                                modals.open({
                                    children: <ActiveNodesListModalShared nodes={profile.nodes} />,
                                    title: (
                                        <BaseOverlayHeader
                                            iconColor="teal"
                                            IconComponent={PiCpu}
                                            iconVariant="soft"
                                            title={`Active Nodes - ${profile.name}`}
                                            titleOrder={5}
                                        />
                                    ),
                                    size: 'lg',
                                    centered: true
                                })
                            }}
                            size="md"
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                        >
                            {profile.nodes.length}
                        </Badge>
                    </Tooltip>
                </Group>
            </AccordionControlShared>
            <Accordion.Panel>
                {isOpen && (
                    <VirtualizedInboundsListShared
                        onInboundToggle={onInboundToggle}
                        profile={profile}
                        selectedInbounds={selectedInbounds}
                    />
                )}
            </Accordion.Panel>
        </Accordion.Item>
    )
})
