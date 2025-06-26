/* eslint-disable indent */
import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
    Button,
    CopyButton,
    Drawer,
    Group,
    Paper,
    ScrollArea,
    SegmentedControl,
    Stack,
    Tabs,
    Text,
    TextInput
} from '@mantine/core'
import { PiCheck, PiCopy, PiList, PiTreeView, PiUsers } from 'react-icons/pi'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { TbArrowAutofitDown, TbSearch, TbX } from 'react-icons/tb'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { VirtualizedFlatInboundsListShared } from '@shared/ui/config-profiles/virtualized-flat-inbounds-list/virtualized-flat-inbounds-list.shared'
import {
    internalSquadsQueryKeys,
    useGetConfigProfiles,
    useUpdateInternalSquad
} from '@shared/api/hooks'
import { ConfigProfileCardShared } from '@shared/ui/config-profiles/config-profile-card/config-profile-card.shared'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api/query-client'

export const InternalSquadsDrawerWithStore = () => {
    const { isOpen, internalState: internalSquad } = useModalsStore(
        (state) => state.modals[MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS]
    )
    const { close } = useModalsStore()
    const { t } = useTranslation()

    // const { data: internalSquad, isLoading: isInternalSquadLoading } = useGetInternalSquad({
    //     route: {
    //         uuid: internalState?.internalSquadUuid ?? ''
    //     },
    //     rQueryParams: {
    //         enabled: !!internalState?.internalSquadUuid
    //     }
    // })

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
        new Set(internalSquad ? internalSquad.inbounds.map((inbound) => inbound.uuid) : [])
    )

    const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set([]))
    const [activeTab, setActiveTab] = useState<string>('profiles')
    const [filterType, setFilterType] = useState<'all' | 'selected' | 'unselected'>('all')

    const allInbounds = useMemo(() => {
        if (!configProfiles?.configProfiles) return []

        return configProfiles.configProfiles.flatMap((profile) =>
            profile.inbounds.map((inbound) => ({
                inbound,
                profileName: profile.name,
                profileConfig: profile.config as object
            }))
        )
    }, [configProfiles?.configProfiles])

    const filteredAllInbounds = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return allInbounds
        }

        const query = debouncedSearchQuery.toLowerCase()
        return allInbounds.filter(
            ({ inbound, profileName }) =>
                inbound.tag.toLowerCase().includes(query) ||
                inbound.type.toLowerCase().includes(query) ||
                profileName.toLowerCase().includes(query)
        )
    }, [allInbounds, debouncedSearchQuery])

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
            setSelectedInbounds((prev) => {
                const next = new Set(prev)
                if (next.has(inbound.uuid)) {
                    next.delete(inbound.uuid)
                } else {
                    next.add(inbound.uuid)
                }
                return next
            })
        },
        []
    )

    const clearSelection = useCallback(() => {
        setSelectedInbounds(new Set())
    }, [])

    const handleSelectAllInbounds = useCallback(
        (profileUuid: string) => {
            const profileInbounds = filteredProfiles
                .find((p) => p.uuid === profileUuid)
                ?.inbounds.map((i) => i.uuid)
            if (profileInbounds) {
                setSelectedInbounds((prev) => new Set([...prev, ...profileInbounds]))
            }
        },
        [filteredProfiles]
    )

    const handleUnselectAllInbounds = useCallback(
        (profileUuid: string) => {
            const profileInbounds = filteredProfiles
                .find((p) => p.uuid === profileUuid)
                ?.inbounds.map((i) => i.uuid)
            if (profileInbounds) {
                setSelectedInbounds((prev) => {
                    const next = new Set(prev)
                    profileInbounds.forEach((inbound) => next.delete(inbound))
                    return next
                })
            }
        },
        [filteredProfiles]
    )

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('')
            setDebouncedSearchQuery('')
            setSelectedInbounds(new Set(internalSquad?.inbounds.map((inbound) => inbound.uuid)))
            setOpenAccordions(new Set([]))
            setActiveTab('profiles')
            setFilterType('all')
        }
    }, [isOpen, internalSquad?.inbounds])

    useEffect(() => {
        if (isOpen && internalSquad?.inbounds) {
            setSelectedInbounds(new Set(internalSquad.inbounds.map((inbound) => inbound.uuid)))
        }
    }, [isOpen, internalSquad?.inbounds])

    const { mutate: updateInternalSquad, isPending: isUpdatingInternalSquad } =
        useUpdateInternalSquad({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: internalSquadsQueryKeys.getInternalSquads.queryKey
                    })
                    close(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)
                }
            }
        })

    const handleUpdateInternalSquad = () => {
        if (!internalSquad?.uuid) return
        updateInternalSquad({
            variables: {
                uuid: internalSquad.uuid,
                inbounds: Array.from(selectedInbounds)
            }
        })
    }

    const renderDrawerContent = () => {
        if (!internalSquad) return null

        return (
            <Stack gap="md" h="100%">
                <Paper mb="sm" p="md" radius={'md'} shadow="sm" withBorder>
                    <Stack gap="sm">
                        <Group align="center" justify="space-between">
                            <Text fw={700} size="lg">
                                {internalSquad.name}
                            </Text>
                            <Group gap="xs">
                                <CopyButton timeout={2000} value={internalSquad.uuid}>
                                    {({ copied, copy }) => (
                                        <ActionIcon
                                            color={copied ? 'teal' : 'gray'}
                                            onClick={copy}
                                            variant="subtle"
                                        >
                                            {copied ? (
                                                <PiCheck size="1rem" />
                                            ) : (
                                                <PiCopy size="1rem" />
                                            )}
                                        </ActionIcon>
                                    )}
                                </CopyButton>
                            </Group>
                        </Group>

                        <Group gap="md" wrap="wrap">
                            <Group gap="xs">
                                <Badge
                                    color="teal"
                                    leftSection={<PiUsers size="14" />}
                                    size="md"
                                    variant="outline"
                                >
                                    {internalSquad.info.membersCount} members
                                </Badge>
                            </Group>
                        </Group>
                    </Stack>
                </Paper>

                <Paper mb="sm" p="sm" radius={'md'} shadow="xs" withBorder>
                    <Group align="center" justify="space-between">
                        <Box>
                            {selectedInbounds.size > 0 ? (
                                <>
                                    <Text fw={700} size="sm">
                                        {selectedInbounds.size} inbound
                                        {selectedInbounds.size !== 1 ? 's' : ''} selected
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'internal-squads.drawer.widget.selected-from-multiple-profiles'
                                        )}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text fw={700} size="sm">
                                        {t('internal-squads.drawer.widget.no-inbounds-selected')}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'internal-squads.drawer.widget.choose-inbounds-from-any-profiles'
                                        )}
                                    </Text>
                                </>
                            )}
                        </Box>
                        {selectedInbounds.size > 0 && (
                            <ActionIcon
                                color="gray"
                                onClick={clearSelection}
                                size="sm"
                                variant="subtle"
                            >
                                <TbX size={14} />
                            </ActionIcon>
                        )}
                    </Group>
                </Paper>

                <Group justify="flex-end">
                    <Button
                        disabled={selectedInbounds.size === 0}
                        fullWidth
                        leftSection={<TbArrowAutofitDown size={'1.3rem'} />}
                        loading={isUpdatingInternalSquad}
                        onClick={handleUpdateInternalSquad}
                        size="md"
                    >
                        {t('internal-squads.drawer.widget.update-internal-squad')}
                    </Button>
                </Group>

                <TextInput
                    leftSection={<TbSearch size={16} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t('internal-squads.drawer.widget.search-profiles-or-inbounds')}
                    radius="md"
                    value={searchQuery}
                />

                <Tabs
                    onChange={(value) => value && setActiveTab(value)}
                    value={activeTab}
                    variant="outline"
                >
                    <Tabs.List grow>
                        <Tabs.Tab leftSection={<PiTreeView size={16} />} value="profiles">
                            {t('internal-squads.drawer.widget.config-profiles')}
                        </Tabs.Tab>
                        <Tabs.Tab leftSection={<PiList size={16} />} value="flat">
                            {t('internal-squads.drawer.widget.flat-list')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel pt="sm" value="profiles">
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
                                                      'internal-squads.drawer.widget.no-profiles-or-inbounds-found'
                                                  )
                                                : t(
                                                      'internal-squads.drawer.widget.no-config-profiles-available'
                                                  )}
                                        </Text>
                                    )}
                                </Accordion>
                            </Stack>
                        </ScrollArea>
                    </Tabs.Panel>

                    <Tabs.Panel pt="sm" value="flat">
                        <Stack flex={1} gap="sm">
                            <SegmentedControl
                                data={[
                                    { label: t('internal-squads.drawer.widget.all'), value: 'all' },
                                    {
                                        label: t('internal-squads.drawer.widget.selected'),
                                        value: 'selected'
                                    },
                                    {
                                        label: t('internal-squads.drawer.widget.unselected'),
                                        value: 'unselected'
                                    }
                                ]}
                                onChange={(value) =>
                                    setFilterType(value as 'all' | 'selected' | 'unselected')
                                }
                                size="sm"
                                value={filterType}
                            />

                            <Box flex={1}>
                                {activeTab === 'flat' ? (
                                    <VirtualizedFlatInboundsListShared
                                        allInbounds={filteredAllInbounds}
                                        filterType={filterType}
                                        onInboundToggle={handleInboundToggle}
                                        selectedInbounds={selectedInbounds}
                                    />
                                ) : null}
                            </Box>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        )
    }

    const isLoading = isConfigProfilesLoading || !internalSquad

    return (
        <Drawer
            keepMounted={true}
            onClose={() => close(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="md"
            position="right"
            size="480px"
            title={`Edit Internal Squad`}
        >
            {isLoading ? (
                <LoaderModalShared h="80vh" text="Loading..." w="100%" />
            ) : (
                renderDrawerContent()
            )}
        </Drawer>
    )
}
