import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
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
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiList, PiTag, PiTreeView, PiUsers } from 'react-icons/pi'
import { TbCirclesRelation, TbDeviceFloppy, TbSearch } from 'react-icons/tb'
import { Virtuoso } from 'react-virtuoso'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    internalSquadsQueryKeys,
    useGetConfigProfiles,
    useGetInternalSquad,
    useUpdateInternalSquad
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { OPEN_ENTITY } from '@shared/constants'
import { ConfigProfileCardShared } from '@shared/ui/config-profiles/config-profile-card/config-profile-card.shared'
import { VirtualizedFlatInboundsListShared } from '@shared/ui/config-profiles/virtualized-flat-inbounds-list/virtualized-flat-inbounds-list.shared'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { formatInt } from '@shared/utils/misc'

import classes from './internal-squads-inbounds.module.css'

interface IProps {
    squadUuid: string
}

export const InternalSquadsInboundsDrawer = NiceModal.create((props: IProps) => {
    const { squadUuid } = props

    const modal = useModal()
    const { hide, modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { t } = useTranslation()

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()
    const { data: internalSquad, isLoading: isInternalSquadLoading } = useGetInternalSquad({
        route: {
            uuid: squadUuid
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
        if (!configProfiles || !configProfiles.configProfiles) return []

        return configProfiles.configProfiles.flatMap((profile) =>
            profile.inbounds.map((inbound) => ({
                inbound,
                profileName: profile.name,
                profileConfig: profile.config as object
            }))
        )
    }, [configProfiles])

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
        if (internalSquad?.inbounds) {
            setSelectedInbounds(new Set(internalSquad.inbounds.map((inbound) => inbound.uuid)))
        }
    }, [internalSquad?.inbounds])

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
                    hide()
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
            <Stack
                gap="md"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <Paper
                    p="md"
                    shadow="sm"
                    style={{
                        border: '1px solid rgb(255, 255, 255, 0.08)',
                        background: 'rgb(255, 255, 255, 0.02)'
                    }}
                >
                    <Stack gap="md">
                        <Group align="center" justify="space-between" wrap="nowrap">
                            <Box className={classes.iconWrapper}>
                                <ActionIcon
                                    bg={internalSquad.info.membersCount > 0 ? '' : 'dark.6'}
                                    className={classes.icon}
                                    color={internalSquad.info.membersCount > 0 ? 'teal' : 'gray'}
                                    size="xl"
                                    style={{
                                        cursor: 'default'
                                    }}
                                    variant={
                                        internalSquad.info.membersCount > 0 ? 'light' : 'subtle'
                                    }
                                >
                                    <TbCirclesRelation size={28} />
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={2}
                                    size="lg"
                                    title={internalSquad.name}
                                    truncate="end"
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
                                            ff="monospace"
                                            leftSection={<PiUsers size={12} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {formatInt(internalSquad.info.membersCount, {
                                                thousandSeparator: ','
                                            })}
                                        </Badge>
                                    </Tooltip>
                                    <Tooltip label={t('common.field.inbounds')}>
                                        <Badge
                                            color="blue"
                                            ff="monospace"
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

                            <ActionIcon
                                color="teal"
                                disabled={selectedInbounds.size === 0}
                                loading={isUpdatingInternalSquad}
                                onClick={handleUpdateInternalSquad}
                                size="xl"
                                style={{
                                    transition: 'color 0.2s ease'
                                }}
                                variant="soft"
                            >
                                <TbDeviceFloppy size={24} />
                            </ActionIcon>
                        </Group>
                    </Stack>
                </Paper>

                <TextInput
                    leftSection={<TbSearch size={16} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t('common.message.search-profiles-or-inbounds')}
                    value={searchQuery}
                />

                <Tabs
                    classNames={{
                        root: classes.tabsContainer
                    }}
                    onChange={(value) => value && setActiveTab(value)}
                    value={activeTab}
                >
                    <Tabs.List grow>
                        <Tabs.Tab leftSection={<PiTreeView size={18} />} value="profiles">
                            {t('internal-squads.drawer.widget.config-profiles')}
                        </Tabs.Tab>
                        <Tabs.Tab leftSection={<PiList size={18} />} value="flat">
                            {t('internal-squads.drawer.widget.flat-list')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel className={classes.tabPanel} pt="sm" value="profiles">
                        {filteredProfiles.length === 0 ? (
                            <Text c="dimmed" py="xl" size="sm" ta="center">
                                {t('common.message.no-profiles-or-inbounds-found')}
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
                                                        onSelectAllInbounds={
                                                            handleSelectAllInbounds
                                                        }
                                                        onUnselectAllInbounds={
                                                            handleUnselectAllInbounds
                                                        }
                                                        profile={profile}
                                                        selectedInbounds={selectedInbounds}
                                                    />
                                                </Accordion>
                                            </div>
                                        )
                                    }}
                                    style={{
                                        height: '100%'
                                    }}
                                    useWindowScroll={false}
                                />
                            </Box>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel className={classes.tabPanel} pt="sm" value="flat">
                        <Stack className={classes.tabPanel} gap="sm">
                            <SegmentedControl
                                data={[
                                    { label: t('common.field.all'), value: 'all' },
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

                            <Box className={classes.listContainer}>
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
            {...modalProps}
            padding="md"
            position="right"
            size="500px"
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
                    IconComponent={TbCirclesRelation}
                    iconVariant="soft"
                    title={t('internal-squads.drawer.widget.edit-internal-squad')}
                    openEntity={{ entity: OPEN_ENTITY.INTERNAL_SQUAD, id: squadUuid }}
                />
            }
        >
            {isLoading ? <LoaderModalShared /> : renderDrawerContent()}
        </Drawer>
    )
})
