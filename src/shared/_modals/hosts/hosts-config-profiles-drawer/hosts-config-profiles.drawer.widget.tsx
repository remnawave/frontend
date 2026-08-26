import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    Accordion,
    ActionIcon,
    Box,
    Drawer,
    Group,
    Stack,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy, TbSearch, TbX } from 'react-icons/tb'
import { Virtuoso } from 'react-virtuoso'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetConfigProfiles } from '@shared/api/hooks'
import { ConfigProfileCardShared } from '@shared/ui/config-profiles/config-profile-card/config-profile-card.shared'
import { XrayLogo } from '@shared/ui/logos'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import classes from './hosts-config-profiles.module.css'

interface IProps {
    activeConfigProfileInbound: null | string | undefined
    activeConfigProfileUuid: null | string | undefined
    onSaveInbound: (inbound: string, configProfileUuid: string) => void
}

export const HostsConfigProfilesDrawer = NiceModal.create((props: IProps) => {
    const { activeConfigProfileInbound, activeConfigProfileUuid, onSaveInbound } = props

    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const [selectedInbound, setSelectedInbound] = useState<null | string>(
        activeConfigProfileInbound || null
    )
    const [selectedProfileUuid, setSelectedProfileUuid] = useState<null | string>(
        activeConfigProfileUuid || null
    )
    const [openAccordions, setOpenAccordions] = useState<Set<string>>(
        new Set(activeConfigProfileUuid ? [activeConfigProfileUuid] : [])
    )

    const filteredProfiles = useMemo(() => {
        if (!configProfiles || !configProfiles.configProfiles) return []

        if (!debouncedSearchQuery.trim()) {
            return configProfiles.configProfiles
        }

        const query = debouncedSearchQuery.toLowerCase()
        return configProfiles.configProfiles
            .filter((profile) => {
                if (profile.name.toLowerCase().includes(query)) return true
                return profile.inbounds.some(
                    (inbound) =>
                        inbound.tag.toLowerCase().includes(query) ||
                        inbound.type.toLowerCase().includes(query)
                )
            })
            .map((profile) => ({
                ...profile,
                inbounds: profile.inbounds.filter(
                    (inbound) =>
                        profile.name.toLowerCase().includes(query) ||
                        inbound.tag.toLowerCase().includes(query) ||
                        inbound.type.toLowerCase().includes(query)
                )
            }))
    }, [configProfiles, debouncedSearchQuery])

    const handleInboundToggle = useCallback(
        (
            inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
        ) => {
            const { profileUuid } = inbound

            if (selectedInbound === inbound.uuid) {
                setSelectedInbound(null)
                setSelectedProfileUuid(null)
                return
            }

            setSelectedInbound(inbound.uuid)
            setSelectedProfileUuid(profileUuid)
        },
        [selectedInbound, selectedProfileUuid]
    )

    const clearSelection = useCallback(() => {
        setSelectedInbound(null)
        setSelectedProfileUuid(null)
    }, [])

    const handleSaveInbound = useCallback(() => {
        if (!selectedProfileUuid || !selectedInbound) return
        onSaveInbound(selectedInbound, selectedProfileUuid)
        hide()
    }, [selectedInbound, selectedProfileUuid, onSaveInbound])

    const selectedInboundsSet = useMemo(() => {
        return selectedInbound ? new Set([selectedInbound]) : new Set<string>()
    }, [selectedInbound])

    if (isConfigProfilesLoading || !configProfiles) return null

    return (
        <Drawer
            {...modalProps}
            padding="md"
            position="right"
            size="480px"
            styles={{
                body: {
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={XrayLogo}
                    iconVariant="soft"
                    title={t('constants.config-profiles')}
                />
            }
        >
            <Stack className={classes.drawerContent} gap="md">
                <Box
                    bdrs="md"
                    p="md"
                    style={{
                        border: '1px solid rgb(255, 255, 255, 0.08)',
                        background: 'rgb(255, 255, 255, 0.02)'
                    }}
                >
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Box>
                            {selectedInbound && selectedProfileUuid ? (
                                <>
                                    <Text ff="monospace" fw={700} size="sm">
                                        {filteredProfiles.find(
                                            (p) => p.uuid === selectedProfileUuid
                                        )?.name ||
                                            t(
                                                'common.message.no-profile-selected'
                                            )}
                                    </Text>
                                    <Text c="white" ff="monospace" size="xs">
                                        {filteredProfiles
                                            .find((p) => p.uuid === selectedProfileUuid)
                                            ?.inbounds.find((i) => i.uuid === selectedInbound)
                                            ?.tag ||
                                            t(
                                                'hosts-config-profiles.drawer.widget.unknown-inbound'
                                            )}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text fw={700} size="sm">
                                        {t(
                                            'common.message.no-inbound-selected'
                                        )}
                                    </Text>
                                    <Text c="dimmed" ff="monospace" size="xs">
                                        {t(
                                            'hosts-config-profiles.drawer.widget.assign-an-inbound-to-the-host'
                                        )}
                                    </Text>
                                </>
                            )}
                        </Box>

                        <Group gap="xs" wrap="nowrap">
                            <ActionIcon
                                color="red"
                                disabled={!selectedInbound}
                                onClick={clearSelection}
                                size="lg"
                                variant="soft"
                            >
                                <TbX size={24} />
                            </ActionIcon>

                            <Tooltip label={t('common.action.save')}>
                                <ActionIcon
                                    color="teal"
                                    disabled={!selectedInbound}
                                    onClick={handleSaveInbound}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbDeviceFloppy size={24} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Box>

                <TextInput
                    leftSection={<TbSearch size={16} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t(
                        'common.message.search-profiles-or-inbounds'
                    )}
                    value={searchQuery}
                />

                {filteredProfiles.length === 0 ? (
                    <Text c="dimmed" py="xl" size="sm" ta="center">
                        {debouncedSearchQuery
                            ? t('common.message.no-profiles-or-inbounds-found')
                            : t('common.message.no-config-profiles-available')}
                    </Text>
                ) : (
                    <Box className={classes.listContainer}>
                        <Virtuoso
                            data={filteredProfiles}
                            itemContent={(_index, profile) => {
                                const isOpen = openAccordions.has(profile.uuid)
                                return (
                                    <div className={classes.itemWrapper}>
                                        <Accordion
                                            chevronPosition="left"
                                            onChange={(value) => {
                                                setOpenAccordions((prev) => {
                                                    const next = new Set(prev)
                                                    if (value === profile.uuid) {
                                                        next.add(profile.uuid)
                                                    } else {
                                                        next.delete(profile.uuid)
                                                    }
                                                    return next
                                                })
                                            }}
                                            value={isOpen ? profile.uuid : null}
                                            variant="separated"
                                        >
                                            <ConfigProfileCardShared
                                                hideSelectActions={true}
                                                isOpen={isOpen}
                                                onInboundToggle={handleInboundToggle}
                                                onSelectAllInbounds={() => {
                                                    notifications.show({
                                                        message: 'Nice try!',
                                                        color: 'red',
                                                        autoClose: 2000
                                                    })
                                                }}
                                                onUnselectAllInbounds={() => {
                                                    notifications.show({
                                                        message: 'Nice try!',
                                                        color: 'red',
                                                        autoClose: 2000
                                                    })
                                                }}
                                                profile={profile}
                                                selectedInbounds={selectedInboundsSet}
                                            />
                                        </Accordion>
                                    </div>
                                )
                            }}
                            style={{ height: '100%' }}
                            useWindowScroll={false}
                        />
                    </Box>
                )}
            </Stack>
        </Drawer>
    )
})
