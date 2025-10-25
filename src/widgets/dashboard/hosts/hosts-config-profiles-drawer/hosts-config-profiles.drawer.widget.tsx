/* eslint-disable @stylistic/indent */

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
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'

import { ConfigProfileCardShared } from '@shared/ui/config-profiles/config-profile-card/config-profile-card.shared'
import { useGetConfigProfiles } from '@shared/api/hooks'

import { IProps } from './interfaces'

export const HostsConfigProfilesDrawer = (props: IProps) => {
    const { t } = useTranslation()
    const { opened, onClose, activeConfigProfileInbound, activeConfigProfileUuid, onSaveInbound } =
        props

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
        onClose()
    }, [selectedInbound, selectedProfileUuid, onSaveInbound, onClose])

    const selectedInboundsSet = useMemo(() => {
        return selectedInbound ? new Set([selectedInbound]) : new Set<string>()
    }, [selectedInbound])

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
            title={t('constants.config-profiles')}
        >
            <Stack gap="md" h="100%">
                <Paper p="md" shadow="sm" withBorder>
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
                                            {selectedInbound && selectedProfileUuid ? (
                                                <>
                                                    <Text fw={700} size="sm">
                                                        {filteredProfiles.find(
                                                            (p) => p.uuid === selectedProfileUuid
                                                        )?.name ||
                                                            t(
                                                                'hosts-config-profiles.drawer.widget.no-profile-selected'
                                                            )}
                                                    </Text>
                                                    <Text c="white" ff="monospace" size="xs">
                                                        {filteredProfiles
                                                            .find(
                                                                (p) =>
                                                                    p.uuid === selectedProfileUuid
                                                            )
                                                            ?.inbounds.find(
                                                                (i) => i.uuid === selectedInbound
                                                            )?.tag ||
                                                            t(
                                                                'hosts-config-profiles.drawer.widget.unknown-inbound'
                                                            )}
                                                    </Text>
                                                </>
                                            ) : (
                                                <Box>
                                                    <Text fw={700} size="sm">
                                                        {t(
                                                            'hosts-config-profiles.drawer.widget.no-inbound-selected'
                                                        )}
                                                    </Text>
                                                    <Text c="dimmed" size="xs">
                                                        {t(
                                                            'hosts-config-profiles.drawer.widget.choose-an-inbound-to-apply-to-the-host'
                                                        )}
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>

                                        {selectedInbound && (
                                            <ActionIcon
                                                color="red"
                                                onClick={clearSelection}
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
                                disabled={!selectedInbound}
                                fullWidth
                                leftSection={<TbDeviceFloppy size="1.2rem" />}
                                onClick={handleSaveInbound}
                                size="md"
                                style={{
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {t('hosts-config-profiles.drawer.widget.apply-changes')}
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                <TextInput
                    leftSection={<TbSearch size={16} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t(
                        'hosts-config-profiles.drawer.widget.search-profiles-or-inbounds'
                    )}
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
                                        onSelectAllInbounds={() => {
                                            notifications.show({
                                                message: t(
                                                    'hosts-config-profiles.drawer.widget.hosts-do-not-support-multiple-inbounds'
                                                ),
                                                color: 'red',
                                                title: t(
                                                    'hosts-config-profiles.drawer.widget.not-supported'
                                                ),
                                                autoClose: 2000
                                            })
                                        }}
                                        onUnselectAllInbounds={() => {
                                            notifications.show({
                                                message: t(
                                                    'hosts-config-profiles.drawer.widget.hosts-do-not-support-multiple-inbounds'
                                                ),
                                                color: 'red',
                                                title: t(
                                                    'hosts-config-profiles.drawer.widget.not-supported'
                                                ),
                                                autoClose: 2000
                                            })
                                        }}
                                        profile={profile}
                                        selectedInbounds={selectedInboundsSet}
                                    />
                                )
                            })}

                            {filteredProfiles.length === 0 && (
                                <Text c="dimmed" py="xl" size="sm" ta="center">
                                    {debouncedSearchQuery
                                        ? t(
                                              'hosts-config-profiles.drawer.widget.no-profiles-or-inbounds-found'
                                          )
                                        : t(
                                              'hosts-config-profiles.drawer.widget.no-config-profiles-available'
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
