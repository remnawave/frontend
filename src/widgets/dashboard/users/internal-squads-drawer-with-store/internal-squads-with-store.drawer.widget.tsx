/* eslint-disable @stylistic/indent */
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
    SegmentedControl,
    Stack,
    Tabs,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import { PiCheck, PiCopy, PiList, PiTag, PiTreeView, PiUsers } from 'react-icons/pi'
import { TbCirclesRelation, TbDeviceFloppy, TbSearch, TbX } from 'react-icons/tb'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Virtuoso } from 'react-virtuoso'

import { VirtualizedFlatInboundsListShared } from '@shared/ui/config-profiles/virtualized-flat-inbounds-list/virtualized-flat-inbounds-list.shared'
import {
    internalSquadsQueryKeys,
    useGetConfigProfiles,
    useGetInternalSquad,
    useUpdateInternalSquad
} from '@shared/api/hooks'
import { ConfigProfileCardShared } from '@shared/ui/config-profiles/config-profile-card/config-profile-card.shared'
import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api/query-client'
import { formatInt } from '@shared/utils/misc'

import classes from './internal-squads-with-store.module.css'

export const InternalSquadsDrawerWithStore = () => {
    const { isOpen, internalState: internalSquadModalState } = useModalState(
        MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS
    )
    const close = useModalClose(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)

    const { t } = useTranslation()

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()
    const { data: internalSquad, isLoading: isInternalSquadLoading } = useGetInternalSquad({
        route: {
            uuid: internalSquadModalState?.squadUuid ?? ''
        },
        rQueryParams: {
            enabled: !!internalSquadModalState
        }
    })

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

        if (isOpen && internalSquad?.inbounds) {
            setSelectedInbounds(new Set(internalSquad.inbounds.map((inbound) => inbound.uuid)))
        }
    }, [isOpen, internalSquad?.inbounds])

    const { mutate: updateInternalSquad, isPending: isUpdatingInternalSquad } =
        useUpdateInternalSquad({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.refetchQueries({
                        queryKey: internalSquadsQueryKeys.getInternalSquads.queryKey
                    })
                    queryClient.setQueryData(
                        internalSquadsQueryKeys.getInternalSquad({
                            uuid: data.uuid
                        }).queryKey,
                        data
                    )
                    close()
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
                <Paper
                    p="md"
                    shadow="sm"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)',
                        border: '1px solid var(--mantine-color-dark-4)'
                    }}
                    withBorder
                >
                    <Stack gap="md">
                        <Group align="center" justify="space-between" wrap="nowrap">
                            <Box className={classes.iconWrapper}>
                                <ActionIcon
                                    bg={internalSquad.info.membersCount > 0 ? '' : 'dark.6'}
                                    className={classes.icon}
                                    color={internalSquad.info.membersCount > 0 ? 'teal' : 'gray'}
                                    size="xl"
                                    variant={
                                        internalSquad.info.membersCount > 0 ? 'light' : 'subtle'
                                    }
                                >
                                    <TbCirclesRelation size={28} />
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    className={classes.title}
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={2}
                                    size="lg"
                                    title={internalSquad.name}
                                >
                                    {internalSquad.name}
                                </Text>
                                <Group gap="xs" wrap="nowrap">
                                    <Tooltip
                                        label={t('internal-squads-with-store.drawer.widget.users')}
                                    >
                                        <Badge
                                            color={
                                                internalSquad.info.membersCount > 0
                                                    ? 'teal'
                                                    : 'gray'
                                            }
                                            leftSection={<PiUsers size={12} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {formatInt(internalSquad.info.membersCount, {
                                                thousandSeparator: ','
                                            })}
                                        </Badge>
                                    </Tooltip>
                                    <Tooltip label={t('internal-squads-grid.widget.inbounds')}>
                                        <Badge
                                            color="blue"
                                            leftSection={<PiTag size={12} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {formatInt(selectedInbounds.size, {
                                                thousandSeparator: ','
                                            })}
                                        </Badge>
                                    </Tooltip>
                                    <CopyButton timeout={2000} value={internalSquad.uuid}>
                                        {({ copied, copy }) => (
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={copy}
                                                size="lg"
                                                style={{ flexShrink: 0 }}
                                                variant="subtle"
                                            >
                                                {copied ? (
                                                    <PiCheck size="18px" />
                                                ) : (
                                                    <PiCopy size="18px" />
                                                )}
                                            </ActionIcon>
                                        )}
                                    </CopyButton>
                                </Group>
                            </Stack>
                        </Group>

                        <Box
                            bg="dark.6"
                            p="md"
                            style={{
                                borderRadius: 'var(--mantine-radius-md)',
                                border: '1px solid var(--mantine-color-dark-4)'
                            }}
                        >
                            <Group align="center" justify="space-between">
                                <Box flex={1}>
                                    <Group align="center" justify="space-between">
                                        <Box>
                                            <Text c="white" fw={600} size="sm">
                                                {selectedInbounds.size === 0
                                                    ? t(
                                                          'internal-squads.drawer.widget.no-inbounds-selected'
                                                      )
                                                    : t(
                                                          'internal-squads.drawer.widget.selected-inbounds',
                                                          {
                                                              count: selectedInbounds.size
                                                          }
                                                      )}
                                            </Text>
                                            <Text c="dimmed" mt={2} size="xs">
                                                {selectedInbounds.size > 0
                                                    ? t(
                                                          'internal-squads.drawer.widget.selected-from-multiple-profiles'
                                                      )
                                                    : t(
                                                          'internal-squads.drawer.widget.choose-inbounds-from-any-profiles'
                                                      )}
                                            </Text>
                                        </Box>
                                        {selectedInbounds.size > 0 && (
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

                        <Button
                            color="teal"
                            disabled={selectedInbounds.size === 0}
                            fullWidth
                            leftSection={<TbDeviceFloppy size="1.2rem" />}
                            loading={isUpdatingInternalSquad}
                            onClick={handleUpdateInternalSquad}
                            size="md"
                            style={{
                                transition: 'all 0.2s ease'
                            }}
                            variant="light"
                        >
                            {t('common.save')}
                        </Button>
                    </Stack>
                </Paper>

                <TextInput
                    leftSection={<TbSearch size={16} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t('internal-squads.drawer.widget.search-profiles-or-inbounds')}
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
                        {filteredProfiles.length === 0 ? (
                            <Text c="dimmed" py="xl" size="sm" ta="center">
                                {debouncedSearchQuery
                                    ? t(
                                          'internal-squads.drawer.widget.no-profiles-or-inbounds-found'
                                      )
                                    : t(
                                          'internal-squads.drawer.widget.no-config-profiles-available'
                                      )}
                            </Text>
                        ) : (
                            <Accordion
                                chevronPosition="left"
                                multiple={true}
                                onChange={(value) => {
                                    setOpenAccordions(new Set(value))
                                }}
                                value={Array.from(openAccordions)}
                                variant="separated"
                            >
                                <Virtuoso
                                    data={filteredProfiles}
                                    itemContent={(_index, profile) => {
                                        const isOpen = openAccordions.has(profile.uuid)
                                        return (
                                            <div
                                                className={classes.itemWrapper}
                                                style={{ marginBottom: '8px' }}
                                            >
                                                <ConfigProfileCardShared
                                                    isOpen={isOpen}
                                                    onInboundToggle={handleInboundToggle}
                                                    onSelectAllInbounds={handleSelectAllInbounds}
                                                    onUnselectAllInbounds={
                                                        handleUnselectAllInbounds
                                                    }
                                                    profile={profile}
                                                    selectedInbounds={selectedInbounds}
                                                />
                                            </div>
                                        )
                                    }}
                                    style={{ height: '500px' }}
                                    useWindowScroll={false}
                                />
                            </Accordion>
                        )}
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

    const isLoading = isConfigProfilesLoading || isInternalSquadLoading

    return (
        <Drawer
            keepMounted={true}
            onClose={close}
            opened={isOpen}
            padding="md"
            position="right"
            size="480px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbCirclesRelation}
                    iconVariant="gradient-teal"
                    title={t('internal-squads.drawer.widget.edit-internal-squad')}
                />
            }
        >
            {isLoading ? (
                <LoaderModalShared h="80vh" text="Loading..." w="100%" />
            ) : (
                renderDrawerContent()
            )}
        </Drawer>
    )
}
