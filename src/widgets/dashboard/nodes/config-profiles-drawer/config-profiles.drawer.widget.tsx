/* eslint-disable indent */
import {
    Accordion,
    ActionIcon,
    Box,
    Button,
    Drawer,
    Group,
    Paper,
    ScrollArea,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TbDeviceFloppy, TbSearch, TbX } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { ConfigProfileCardShared } from '@shared/ui/config-profiles/config-profile-card/config-profile-card.shared'
import { useGetConfigProfiles } from '@shared/api/hooks'

import { IProps } from './interfaces'

export const ConfigProfilesDrawer = (props: IProps) => {
    const {
        opened,
        onClose,
        activeConfigProfileInbounds = [],
        activeConfigProfileUuid,
        onSaveInbounds
    } = props

    const { t } = useTranslation()

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])
    const [selectedInbounds, setSelectedInbounds] = useState<Set<string>>(
        new Set(activeConfigProfileInbounds || [])
    )
    const [selectedProfileUuid, setSelectedProfileUuid] = useState<null | string>(
        activeConfigProfileUuid || null
    )
    const [openAccordions, setOpenAccordions] = useState<Set<string>>(
        new Set(activeConfigProfileUuid ? [activeConfigProfileUuid] : [])
    )

    const filteredProfiles = useMemo(() => {
        if (!configProfiles?.configProfiles) return []

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
    }, [configProfiles?.configProfiles, debouncedSearchQuery])

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

        onClose()
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
            keepMounted={false}
            onClose={onClose}
            opened={opened}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="md"
            position="right"
            size="480px"
            title={t('config-profiles.drawer.widget.config-profiles')}
        >
            <Stack gap="md" h="100%">
                <Paper p="md" radius="md" shadow="sm" withBorder>
                    <Stack gap="md">
                        <Box
                            bd="1px solid var(--mantine-color-dark-4)"
                            bdrs="md"
                            bg="dark.6"
                            p="md"
                        >
                            <Group align="center" justify="space-between">
                                <Box flex={1}>
                                    <Group align="center" justify="space-between">
                                        <Box>
                                            {selectedInbounds.size > 0 && selectedProfileUuid ? (
                                                <>
                                                    <Text fw={700} size="sm">
                                                        {filteredProfiles.find(
                                                            (p) => p.uuid === selectedProfileUuid
                                                        )?.name ||
                                                            t(
                                                                'config-profiles.drawer.widget.no-profile-selected'
                                                            )}
                                                    </Text>
                                                    <Text c="dimmed" size="xs">
                                                        {t(
                                                            'internal-squads.drawer.widget.selected-inbounds',
                                                            {
                                                                count: selectedInbounds.size
                                                            }
                                                        )}
                                                    </Text>
                                                </>
                                            ) : (
                                                <Box>
                                                    <Text fw={700} size="sm">
                                                        {t(
                                                            'config-profiles.drawer.widget.no-inbounds-selected'
                                                        )}
                                                    </Text>
                                                    <Text c="dimmed" size="xs">
                                                        {t(
                                                            'config-profiles.drawer.widget.choose-config-profile-to-apply-to-the-node'
                                                        )}
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                        {selectedInbounds.size > 0 && (
                                            <ActionIcon
                                                color="red"
                                                onClick={clearSelection}
                                                radius="md"
                                                size="lg"
                                                variant="light"
                                            >
                                                <TbX size={24} />
                                            </ActionIcon>
                                        )}
                                    </Group>
                                </Box>
                            </Group>
                        </Box>

                        <Group justify="flex-end">
                            <Button
                                color="teal"
                                disabled={selectedInbounds.size === 0}
                                fullWidth
                                leftSection={<TbDeviceFloppy size={'1.2rem'} />}
                                onClick={handleSaveInbounds}
                                size="md"
                                style={{
                                    transition: 'all 0.2s ease'
                                }}
                                variant="light"
                            >
                                {t('config-profiles.drawer.widget.apply-changes')}
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <TextInput
                    leftSection={<TbSearch size={16} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t('config-profiles.drawer.widget.search-profiles-or-inbounds')}
                    radius="md"
                    value={searchQuery}
                />

                <ScrollArea flex={1}>
                    <Stack gap="sm">
                        <Accordion
                            chevronPosition="left"
                            multiple={true}
                            onChange={(value) => {
                                setOpenAccordions(new Set(value))
                            }}
                            value={Array.from(openAccordions)}
                            variant="separated"
                        >
                            {filteredProfiles.map((profile) => {
                                const isOpen = openAccordions.has(profile.uuid)
                                return (
                                    <ConfigProfileCardShared
                                        isOpen={isOpen}
                                        key={profile.uuid}
                                        onInboundToggle={handleInboundToggle}
                                        onSelectAllInbounds={handleSelectAllInbounds}
                                        onUnselectAllInbounds={handleUnselectAllInbounds}
                                        profile={profile}
                                        selectedInbounds={selectedInbounds}
                                    />
                                )
                            })}

                            {filteredProfiles.length === 0 && (
                                <Text c="dimmed" py="xl" size="sm" ta="center">
                                    {debouncedSearchQuery
                                        ? t(
                                              'config-profiles.drawer.widget.no-profiles-or-inbounds-found'
                                          )
                                        : t(
                                              'config-profiles.drawer.widget.no-config-profiles-available'
                                          )}
                                </Text>
                            )}
                        </Accordion>
                    </Stack>
                </ScrollArea>
            </Stack>
        </Drawer>
    )
}
