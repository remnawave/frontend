import { ActionIcon, Card, Group, Select, Stack, Title } from '@mantine/core'
import { PiBookmarks, PiMagnifyingGlass, PiTag, PiX } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { TbTagStarred } from 'react-icons/tb'
import { HiFilter } from 'react-icons/hi'
import { useMemo } from 'react'

import {
    useHostsStoreActions,
    useHostsStoreConfigProfileFilter,
    useHostsStoreHostTagFilter,
    useHostsStoreInboundFilter
} from '@entities/dashboard'

import { IProps } from './interfaces'

export const HostsFiltersFeature = (props: IProps) => {
    const {
        configProfiles,
        handleSearchAddressSelect,
        handleSearchSelect,
        searchAddressValue,
        searchOptions,
        searchValue,
        searchAddressData,
        hostTags
    } = props

    const { t } = useTranslation()

    const actions = useHostsStoreActions()
    const configProfileFilter = useHostsStoreConfigProfileFilter()
    const inboundFilter = useHostsStoreInboundFilter()
    const hostTagFilter = useHostsStoreHostTagFilter()

    const configProfileOptions = useMemo(() => {
        if (!configProfiles) return []

        return [
            { value: '', label: t('hosts-filters.feature.all-config-profiles') },
            ...configProfiles.map((configProfile) => ({
                value: configProfile.uuid,
                label: configProfile.name
            }))
        ]
    }, [configProfiles])

    const inboundOptions = useMemo(() => {
        if (!configProfiles || !configProfileFilter) return []

        const selectedConfigProfile = configProfiles.find((cp) => cp.uuid === configProfileFilter)

        if (!selectedConfigProfile) return []

        return [
            { value: '', label: t('hosts-filters.feature.all-inbounds') },
            ...selectedConfigProfile.inbounds.map((inbound) => ({
                value: inbound.uuid,
                label: inbound.tag || inbound.uuid
            }))
        ]
    }, [configProfiles, configProfileFilter])

    const handleConfigProfileChange = (value: null | string) => {
        actions.setConfigProfileFilter(value || null)
    }

    const handleInboundChange = (value: null | string) => {
        actions.setInboundFilter(value || null)
    }

    const handleHostTagChange = (value: null | string) => {
        actions.setHostTagFilter(value || null)
    }

    const handleResetFilters = () => {
        actions.resetFilters()
    }

    const hasActiveFilters = configProfileFilter || inboundFilter

    return (
        <Card mb="xl" padding="lg" shadow="sm" withBorder>
            <Stack gap="md">
                <Group justify="space-between">
                    <Group gap="xs">
                        <ActionIcon
                            color="gray"
                            onClick={handleResetFilters}
                            size="sm"
                            variant="subtle"
                        >
                            <HiFilter size={16} />
                        </ActionIcon>
                        <Title order={5}>{t('hosts-filters.feature.filters')}</Title>
                    </Group>

                    {hasActiveFilters && (
                        <ActionIcon
                            color="gray"
                            onClick={handleResetFilters}
                            size="sm"
                            variant="subtle"
                        >
                            <PiX size={16} />
                        </ActionIcon>
                    )}
                </Group>

                <Group grow preventGrowOverflow={false} wrap="wrap">
                    <Select
                        clearable
                        data={configProfileOptions}
                        leftSection={<PiBookmarks size="16px" />}
                        leftSectionPointerEvents="none"
                        onChange={handleConfigProfileChange}
                        placeholder={t('hosts-filters.feature.select-config-profile')}
                        size="sm"
                        value={configProfileFilter || ''}
                    />

                    <Select
                        clearable
                        data={inboundOptions}
                        disabled={!configProfileFilter}
                        leftSection={<PiTag size="16px" />}
                        leftSectionPointerEvents="none"
                        onChange={handleInboundChange}
                        placeholder={t('hosts-filters.feature.select-inbound')}
                        size="sm"
                        value={inboundFilter || ''}
                    />
                </Group>

                <Group grow preventGrowOverflow={false} wrap="wrap">
                    <Select
                        clearable
                        data={searchOptions}
                        leftSection={<PiMagnifyingGlass size={16} />}
                        onChange={handleSearchSelect}
                        placeholder={t('hosts-filters.feature.search-by-remark')}
                        searchable
                        value={searchValue}
                    />

                    <Select
                        clearable
                        data={searchAddressData}
                        leftSection={<PiMagnifyingGlass size={16} />}
                        onChange={handleSearchAddressSelect}
                        placeholder={t('hosts-filters.feature.address')}
                        searchable
                        value={searchAddressValue}
                    />

                    <Select
                        clearable
                        data={hostTags}
                        leftSection={<TbTagStarred size="16px" />}
                        leftSectionPointerEvents="none"
                        onChange={handleHostTagChange}
                        placeholder={t('hosts-filters.feature.filter-by-tags')}
                        size="sm"
                        value={hostTagFilter || null}
                    />
                </Group>
            </Stack>
        </Card>
    )
}
