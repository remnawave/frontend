import {
    PiCloudArrowUpDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone,
    PiWarningCircle
} from 'react-icons/pi'
import {
    GetAllNodesCommand,
    GetConfigProfilesCommand,
    GetNodePluginsCommand
} from '@remnawave/backend-contract'
import { ActionIcon, Avatar, Badge, Group, MultiSelect, Text, TextInput } from '@mantine/core'
import { TbEdit, TbSearch, TbX } from 'react-icons/tb'
import { DataTableColumn } from 'mantine-datatable'
import ReactCountryFlag from 'react-country-flag'
import { TFunction } from 'i18next'
import sortBy from 'lodash/sortBy'

import { prettyBytesUtil, prettySiBytesUtil, prettySiRealtimeBytesUtil } from '@shared/utils/bytes'
import { formatDurationUtil } from '@shared/utils/time-utils'
import { faviconResolver } from '@shared/utils/misc'

import { NodeStatusSimplfiedBadgeWidget } from '../node-status-simplfied-badge'

export type NodeStatusFilter = 'connected' | 'connecting' | 'disabled' | 'disconnected'

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
    selectedStatuses: NodeStatusFilter[]
    selectedTags: string[]
    setNameQuery: (value: string) => void
    setSelectedConfigProfiles: (value: string[]) => void
    setSelectedInbounds: (value: string[]) => void
    setSelectedPlugins: (value: string[]) => void
    setSelectedProviders: (value: string[]) => void
    setSelectedStatuses: (value: NodeStatusFilter[]) => void
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
            draggable: false,
            toggleable: false,
            resizable: false,

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
            accessor: 'isConnected',
            sortable: true,
            title: '',
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={[
                        {
                            label: t('node-status-badge.widget.connected'),
                            value: 'connected'
                        },
                        {
                            label: t('node-status-badge.widget.connecting'),
                            value: 'connecting'
                        },
                        {
                            label: t('node-status-badge.widget.disabled'),
                            value: 'disabled'
                        },
                        {
                            label: t('node-status-badge.widget.disconnected'),
                            value: 'disconnected'
                        }
                    ]}
                    leftSection={<TbSearch size={16} />}
                    onChange={(value) => filters.setSelectedStatuses(value as NodeStatusFilter[])}
                    renderOption={({ option }) => (
                        <Group gap="xs" wrap="nowrap">
                            {option.value === 'connected' && (
                                <PiPulseDuotone
                                    size={16}
                                    style={{ color: 'var(--mantine-color-teal-6)' }}
                                />
                            )}
                            {option.value === 'connecting' && (
                                <PiCloudArrowUpDuotone
                                    size={16}
                                    style={{ color: 'var(--mantine-color-yellow-3)' }}
                                />
                            )}
                            {option.value === 'disabled' && (
                                <PiProhibitDuotone
                                    size={16}
                                    style={{ color: 'var(--mantine-color-gray-6)' }}
                                />
                            )}
                            {option.value === 'disconnected' && (
                                <PiWarningCircle
                                    size={16}
                                    style={{ color: 'var(--mantine-color-red-3)' }}
                                />
                            )}
                            <Text size="sm">{option.label}</Text>
                        </Group>
                    )}
                    searchable
                    value={filters.selectedStatuses}
                />
            ),
            filtering: filters.selectedStatuses.length > 0,
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
            toggleable: true,
            filtering: filters.selectedInbounds.length > 0,
            title: t('use-nodes-table-widget.inbounds'),
            render: ({ configProfile: { activeInbounds } }) =>
                sortBy(activeInbounds, 'tag')
                    .map((inbound) => inbound.tag)
                    .join(', ')
        },
        {
            accessor: 'versions.xray',
            sortable: true,
            title: t('use-nodes-table-widget.xray-v'),
            render: ({ versions }) => (versions ? versions.xray : '-')
        },
        {
            accessor: 'xrayUptime',
            sortable: true,
            title: 'Xray Uptime',
            render: ({ xrayUptime }) => (xrayUptime !== 0 ? formatDurationUtil(xrayUptime) : '-')
        },
        {
            accessor: 'versions.node',
            sortable: true,
            title: t('use-nodes-table-widget.node-v'),
            render: ({ versions }) => (versions ? versions.node : '-')
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
            render: ({ system }) => (system ? prettyBytesUtil(system.stats.memoryUsed, false) : '-')
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
            accessor: 'system.stats.interface.rxBytesPerSec',
            sortable: true,
            title: 'RX Speed',
            render: ({ system }) =>
                system && system.stats.interface
                    ? prettySiRealtimeBytesUtil(system.stats.interface.rxBytesPerSec, true, true)
                    : '-'
        },
        {
            accessor: 'system.stats.interface.txBytesPerSec',
            sortable: true,
            title: 'TX Speed',
            render: ({ system }) =>
                system && system.stats.interface
                    ? prettySiRealtimeBytesUtil(system.stats.interface.txBytesPerSec, true, true)
                    : '-'
        },
        {
            accessor: 'system.stats.interface.rxTotal',
            sortable: true,
            title: 'RX Total',
            render: ({ system }) =>
                system && system.stats.interface
                    ? prettySiBytesUtil(system.stats.interface.rxTotal, true)
                    : '-'
        },
        {
            accessor: 'system.stats.interface.txTotal',
            sortable: true,
            title: 'TX Total',
            render: ({ system }) =>
                system && system.stats.interface
                    ? prettySiBytesUtil(system.stats.interface.txTotal, true)
                    : '-'
        },
        {
            accessor: 'system.info.release',
            sortable: true,
            title: 'OS Release',
            render: ({ system }) => (system ? system.info.release : '-')
        },
        {
            accessor: 'actions',
            draggable: false,
            resizable: false,
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

            textAlign: 'right',
            toggleable: false,
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
        }
    ]
}
