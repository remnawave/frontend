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

import classes from './nodes-config-profiles.module.css'

interface IProps {
    activeConfigProfileInbounds: null | string[] | undefined
    activeConfigProfileUuid: null | string | undefined
    onSaveInbounds: (inbounds: string[], configProfileUuid: string) => void
}

export const NodesConfigProfilesDrawer = NiceModal.create((props: IProps) => {
    const { activeConfigProfileInbounds = [], activeConfigProfileUuid, onSaveInbounds } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [selectedInbounds, setSelectedInbounds] = useState<Set<string>>(
        new Set(activeConfigProfileInbounds || [])
    )
    const [selectedProfileUuid, setSelectedProfileUuid] = useState<null | string>(
        activeConfigProfileUuid || null
    )
    const [openAccordions, setOpenAccordions] = useState<Set<string>>(
        new Set(activeConfigProfileUuid ? [activeConfigProfileUuid] : [])
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

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

            if (selectedProfileUuid && selectedProfileUuid !== profileUuid) {
                setSelectedInbounds(new Set([inbound.uuid]))
                setSelectedProfileUuid(profileUuid)
                return
            }

            setSelectedInbounds((prev) => {
                const next = new Set(prev)
                if (next.has(inbound.uuid)) {
                    next.delete(inbound.uuid)
                    if (next.size === 0) {
                        setSelectedProfileUuid(null)
                    }
                } else {
                    next.add(inbound.uuid)
                    setSelectedProfileUuid(profileUuid)
                }
                return next
            })
        },
        [selectedProfileUuid]
    )

    const clearSelection = useCallback(() => {
        setSelectedInbounds(new Set())
        setSelectedProfileUuid(null)
    }, [])

    const handleSaveInbounds = useCallback(() => {
        if (!selectedProfileUuid) return
        onSaveInbounds(Array.from(selectedInbounds), selectedProfileUuid)

        hide()
    }, [selectedInbounds, selectedProfileUuid, onSaveInbounds])

    const handleSelectAllInbounds = useCallback(
        (profileUuid: string) => {
            const profileInbounds = filteredProfiles
                .find((p) => p.uuid === profileUuid)
                ?.inbounds.map((i) => i.uuid)
            setSelectedInbounds(new Set(profileInbounds))
            setSelectedProfileUuid(profileUuid)
        },
        [filteredProfiles]
    )

    const handleUnselectAllInbounds = useCallback(() => {
        setSelectedInbounds(new Set())
        setSelectedProfileUuid(null)
    }, [])

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
                    title={t('config-profiles.drawer.widget.config-profiles')}
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
                            {selectedInbounds.size > 0 && selectedProfileUuid ? (
                                <>
                                    <Text fw={700} size="sm">
                                        {filteredProfiles.find(
                                            (p) => p.uuid === selectedProfileUuid
                                        )?.name ||
                                            t('common.message.no-profile-selected')}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t('internal-squads.drawer.widget.selected-inbounds', {
                                            count: selectedInbounds.size
                                        })}
                                    </Text>
                                </>
                            ) : (
                                <Box>
                                    <Text fw={700} size="sm">
                                        {t('common.message.no-profile-selected')}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t('config-profiles.drawer.widget.no-inbounds-selected')}
                                    </Text>
                                </Box>
                            )}
                        </Box>

                        <Group gap="xs" wrap="nowrap">
                            <ActionIcon
                                color="red"
                                disabled={selectedInbounds.size === 0}
                                onClick={clearSelection}
                                size="lg"
                                variant="soft"
                            >
                                <TbX size={24} />
                            </ActionIcon>

                            <Tooltip label={t('common.action.save')}>
                                <ActionIcon
                                    color="teal"
                                    disabled={selectedInbounds.size === 0}
                                    onClick={handleSaveInbounds}
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
                    placeholder={t('common.message.search-profiles-or-inbounds')}
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
                                                isOpen={isOpen}
                                                onInboundToggle={handleInboundToggle}
                                                onSelectAllInbounds={handleSelectAllInbounds}
                                                onUnselectAllInbounds={handleUnselectAllInbounds}
                                                profile={profile}
                                                selectedInbounds={selectedInbounds}
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
