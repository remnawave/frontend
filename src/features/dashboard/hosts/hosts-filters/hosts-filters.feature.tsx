import { ActionIcon, Card, Group, Select, Stack, Title } from '@mantine/core'
import { PiBookmarks, PiTag, PiX } from 'react-icons/pi'
import { useMemo } from 'react'

import {
    useHostsStoreActions,
    useHostsStoreConfigProfileFilter,
    useHostsStoreInboundFilter
} from '@entities/dashboard'

import { IProps } from './interfaces'

export const HostsFiltersFeature = (props: IProps) => {
    const { configProfiles } = props

    const actions = useHostsStoreActions()
    const configProfileFilter = useHostsStoreConfigProfileFilter()
    const inboundFilter = useHostsStoreInboundFilter()

    const configProfileOptions = useMemo(() => {
        if (!configProfiles) return []

        return [
            { value: '', label: 'All Config Profiles' },
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
            { value: '', label: 'All Inbounds' },
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

    const handleResetFilters = () => {
        actions.resetFilters()
    }

    const hasActiveFilters = configProfileFilter || inboundFilter

    return (
        <Card mb="xl" padding="lg" radius="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Group justify="space-between">
                    <Title order={5}>Filters</Title>
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
                        leftSection={<PiBookmarks size="1rem" />}
                        leftSectionPointerEvents="none"
                        onChange={handleConfigProfileChange}
                        placeholder="Select config profile"
                        radius="md"
                        size="sm"
                        value={configProfileFilter || ''}
                    />

                    <Select
                        clearable
                        data={inboundOptions}
                        disabled={!configProfileFilter}
                        leftSection={<PiTag size="1rem" />}
                        leftSectionPointerEvents="none"
                        onChange={handleInboundChange}
                        placeholder="Select inbound"
                        radius="md"
                        size="sm"
                        value={inboundFilter || ''}
                    />
                </Group>
            </Stack>
        </Card>
    )
}
