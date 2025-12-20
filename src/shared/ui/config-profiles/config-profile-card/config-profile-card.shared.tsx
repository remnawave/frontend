import {
    Accordion,
    AccordionControlProps,
    ActionIcon,
    ActionIconGroup,
    Badge,
    Box,
    Center,
    Group,
    Text,
    Tooltip
} from '@mantine/core'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { PiCheckBold, PiCpu, PiXBold } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { memo } from 'react'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { XrayLogo } from '@shared/ui/logos'

import type { IProps } from './interfaces/props.interface'

import { VirtualizedInboundsListShared } from '../virtualized-inbounds-list/virtualized-inbounds-list.shared'
import { ActiveNodesListModalShared } from '../active-nodes-list-modal/active-nodes-list.modal.shared'

export const ConfigProfileCardShared = memo((props: IProps) => {
    const {
        profile,
        selectedInbounds,
        onInboundToggle,
        onSelectAllInbounds,
        onUnselectAllInbounds,
        isOpen
    } = props

    const { t } = useTranslation()

    const handleShowJson = () => {
        if (!profile) return

        modals.open({
            children: (
                <Box>
                    <JsonEditor
                        collapse={3}
                        data={profile.config as object}
                        indent={4}
                        maxWidth="100%"
                        rootName=""
                        theme={githubDarkTheme}
                        viewOnly
                    />
                </Box>
            ),
            title: (
                <BaseOverlayHeader
                    IconComponent={XrayLogo}
                    iconVariant="gradient-teal"
                    title={profile.name}
                />
            ),
            size: 'xl'
        })
    }

    function AccordionControl(props: AccordionControlProps) {
        return (
            <Center>
                <Accordion.Control {...props} />

                <Group gap="0" mr="xs" wrap="nowrap">
                    <ActionIconGroup>
                        <ActionIcon
                            color="gray"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation()
                                onSelectAllInbounds(profile.uuid)
                            }}
                            size="lg"
                            variant="subtle"
                        >
                            <PiCheckBold size={16} />
                        </ActionIcon>
                        <ActionIcon
                            color="gray"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation()
                                onUnselectAllInbounds(profile.uuid)
                            }}
                            size="lg"
                            variant="subtle"
                        >
                            <PiXBold size={16} />
                        </ActionIcon>
                        <ActionIcon
                            color="gray"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation()

                                handleShowJson()
                            }}
                            size="lg"
                            variant="subtle"
                        >
                            <XrayLogo size={16} />
                        </ActionIcon>
                    </ActionIconGroup>
                </Group>
            </Center>
        )
    }

    const selectedInboundsFromProfile = profile.inbounds.filter((inbound) =>
        selectedInbounds.has(inbound.uuid)
    ).length

    return (
        <Accordion.Item value={profile.uuid}>
            <AccordionControl value={profile.uuid}>
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
                                            IconComponent={PiCpu}
                                            iconVariant="gradient-teal"
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
            </AccordionControl>
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
