import {
    GetAllNodesCommand,
    GetConfigProfilesCommand,
    GetNodePluginsCommand
} from '@remnawave/backend-contract'
import { ActionIcon, Avatar, Badge, Group, MultiSelect, Text, TextInput } from '@mantine/core'
import { TbEdit, TbSearch, TbX } from 'react-icons/tb'
import { DataTableColumn } from 'mantine-datatable'
import ReactCountryFlag from 'react-country-flag'
import { PiUsersDuotone } from 'react-icons/pi'
import { TFunction } from 'i18next'
import sortBy from 'lodash/sortBy'

import { formatDurationUtil } from '@shared/utils/time-utils'
import { prettyBytesUtil } from '@shared/utils/bytes'
import { faviconResolver } from '@shared/utils/misc'

import { NodeStatusSimplfiedBadgeWidget } from '../node-status-simplfied-badge'

export interface NodesTableFilters {
    availableConfigProfiles: { label: string; value: string }[]
    availableInbounds: string[]
    availablePlugins: { label: string; value: string }[]
    availableProviders: string[]
    availableTags: string[]
    nameQuery: string
    selectedConfigProfiles: string[]
    selectedInbounds: string[]
    selectedPlugins: string[]
    selectedProviders: string[]
    selectedTags: string[]
    setNameQuery: (value: string) => void
    setSelectedConfigProfiles: (value: string[]) => void
    setSelectedInbounds: (value: string[]) => void
    setSelectedPlugins: (value: string[]) => void
    setSelectedProviders: (value: string[]) => void
    setSelectedTags: (value: string[]) => void
}

export function getNodesTableColumns(
    t: TFunction,
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'],
    nodePlugins: GetNodePluginsCommand.Response['response']['nodePlugins'],
    handleViewNode: (nodeUuid: string) => void,
    filters: NodesTableFilters
): DataTableColumn<GetAllNodesCommand.Response['response'][number]>[] {
    return [
        {
            accessor: 'actions',
            draggable: false,
            titleStyle: {
                backgroundColor: 'var(--mantine-color-dark-7)'
            },
            cellsStyle: () => {
                return {
                    backgroundColor: 'var(--mantine-color-dark-7)'
                }
            },
            title: (
                <Group c="dimmed" gap={4} justify="flex-end" pr={4} wrap="nowrap">
                    <TbEdit size={18} />
                </Group>
            ),
            width: '0%',
            textAlign: 'right',
            render: ({ uuid }) => (
                <Group gap={4} justify="flex-end" wrap="nowrap">
                    <ActionIcon
                        color="teal"
                        onClick={() => handleViewNode(uuid)}
                        size="md"
                        variant="outline"
                    >
                        <TbEdit size={18} />
                    </ActionIcon>
                </Group>
            )
        },
        {
            accessor: 'isConnected',
            sortable: true,
            title: '',
            render: ({ isConnected, isConnecting, isDisabled, uuid }) => (
                <NodeStatusSimplfiedBadgeWidget
                    isConnected={isConnected}
                    isConnecting={isConnecting}
                    isDisabled={isDisabled}
                    nodeUuid={uuid}
                />
            )
        },

        {
            accessor: 'usersOnline',
            sortable: true,
            title: t('use-nodes-table-widget.online'),
            render: ({ usersOnline }) => (
                <Badge
                    color={(usersOnline ?? 0) > 0 ? 'teal' : 'gray'}
                    leftSection={<PiUsersDuotone size={14} />}
                    miw="10ch"
                    size="lg"
                    variant="outline"
                >
                    {usersOnline}
                </Badge>
            )
        },

        {
            accessor: 'name',
            sortable: true,
            title: t('use-nodes-table-widget.name'),
            filter: (
                <TextInput
                    label={t('use-nodes-table-widget.name')}
                    leftSection={<TbSearch size={16} />}
                    onChange={(e) => filters.setNameQuery(e.currentTarget.value)}
                    rightSection={
                        filters.nameQuery ? (
                            <ActionIcon
                                c="dimmed"
                                onClick={() => filters.setNameQuery('')}
                                size="sm"
                                variant="transparent"
                            >
                                <TbX size={14} />
                            </ActionIcon>
                        ) : null
                    }
                    value={filters.nameQuery}
                />
            ),
            filtering: filters.nameQuery !== '',
            render: ({ name, countryCode }) => (
                <Group gap={6} wrap="nowrap">
                    {countryCode && countryCode !== 'XX' && (
                        <ReactCountryFlag
                            countryCode={countryCode}
                            style={{
                                fontSize: '1.1em',
                                borderRadius: '2px'
                            }}
                        />
                    )}
                    <Text
                        size="sm"
                        style={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {name}
                    </Text>
                </Group>
            )
        },
        {
            accessor: 'address',
            sortable: true,
            title: t('use-nodes-table-widget.address'),
            render: ({ address, port }) => `${address}:${port}`
        },
        {
            accessor: 'trafficUsedBytes',
            sortable: true,
            title: t('use-nodes-table-widget.traffic-used'),
            render: ({ trafficUsedBytes }) => prettyBytesUtil(trafficUsedBytes, false)
        },
        {
            accessor: 'configProfile.activeConfigProfileUuid',
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availableConfigProfiles}
                    label={t('use-nodes-table-widget.config-profile')}
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedConfigProfiles}
                    searchable
                    value={filters.selectedConfigProfiles}
                />
            ),
            filtering: filters.selectedConfigProfiles.length > 0,
            title: t('use-nodes-table-widget.config-profile'),
            render: ({ configProfile: { activeConfigProfileUuid } }) =>
                configProfiles.find((profile) => profile.uuid === activeConfigProfileUuid)?.name
        },
        {
            accessor: 'configProfile.activeInbounds',
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availableInbounds}
                    label={t('use-nodes-table-widget.inbounds')}
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedInbounds}
                    searchable
                    value={filters.selectedInbounds}
                />
            ),
            filtering: filters.selectedInbounds.length > 0,
            title: t('use-nodes-table-widget.inbounds'),
            render: ({ configProfile: { activeInbounds } }) =>
                sortBy(activeInbounds, 'tag')
                    .map((inbound) => inbound.tag)
                    .join(', ')
        },
        {
            accessor: 'xrayVersion',
            sortable: true,
            title: t('use-nodes-table-widget.xray-v')
        },
        {
            accessor: 'nodeVersion',
            sortable: true,
            title: t('use-nodes-table-widget.node-v')
        },
        {
            accessor: 'provider.name',
            sortable: true,
            title: t('use-nodes-table-widget.provider'),
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availableProviders}
                    label={t('use-nodes-table-widget.provider')}
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedProviders}
                    searchable
                    value={filters.selectedProviders}
                />
            ),
            filtering: filters.selectedProviders.length > 0,
            render: ({ provider }) =>
                provider ? (
                    <Group gap="xs" wrap="nowrap">
                        <Avatar
                            alt={provider.name}
                            color="initials"
                            name={provider.name}
                            onLoad={(event) => {
                                const img = event.target as HTMLImageElement
                                if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                                    img.src = ''
                                }
                            }}
                            radius="sm"
                            size={16}
                            src={faviconResolver(provider.faviconLink)}
                        />

                        <Text size="sm">{provider.name}</Text>
                    </Group>
                ) : null
        },
        {
            accessor: 'tags',
            sortable: true,
            title: t('use-nodes-table-widget.tags'),
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availableTags}
                    label={t('use-nodes-table-widget.tags')}
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedTags}
                    searchable
                    value={filters.selectedTags}
                />
            ),
            filtering: filters.selectedTags.length > 0,
            render: ({ tags }) => tags?.join(', ') ?? '-'
        },
        {
            accessor: 'activePluginUuid',
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availablePlugins}
                    label="Plugin"
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedPlugins}
                    searchable
                    value={filters.selectedPlugins}
                />
            ),
            filtering: filters.selectedPlugins.length > 0,
            sortable: true,
            title: 'Plugin',
            render: ({ activePluginUuid }) =>
                nodePlugins.find((plugin) => plugin.uuid === activePluginUuid)?.name || '-'
        },
        {
            accessor: 'system.info.cpus',
            sortable: true,
            title: 'CPU Cores'
        },
        {
            accessor: 'system.stats.memoryFree',
            sortable: true,
            title: 'Free RAM',
            render: ({ system }) => (system ? prettyBytesUtil(system.stats.memoryFree, false) : '-')
        },
        {
            accessor: 'system.stats.memoryUsed',
            sortable: true,
            title: 'Used RAM',
            render: ({ system }) =>
                system
                    ? prettyBytesUtil(system.info.memoryTotal - system.stats.memoryFree, false)
                    : '-'
        },
        {
            accessor: 'system.info.memoryTotal',
            sortable: true,
            title: t('use-nodes-table-widget.total-ram'),
            render: ({ system }) => (system ? prettyBytesUtil(system.info.memoryTotal, false) : '-')
        },
        {
            accessor: 'system.info.cpuModel',
            sortable: true,
            title: t('use-nodes-table-widget.cpu-model')
        },
        {
            accessor: 'system.stats.uptime',
            sortable: true,
            title: 'Server Uptime',
            render: ({ system }) => (system ? formatDurationUtil(system.stats.uptime) : '-')
        },
        {
            accessor: 'system.info.networkInterfaces',
            sortable: true,
            title: 'Network Interfaces',
            render: ({ system }) => (system ? system.info.networkInterfaces.join(', ') : '-')
        },
        {
            accessor: 'system.info.release',
            sortable: true,
            title: 'OS Release',
            render: ({ system }) => (system ? system.info.release : '-')
        }
    ]
}
