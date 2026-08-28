import { DataTableColumn } from '@kastov/mantine-datatable'
import { ActionIcon, Group, MultiSelect, Text } from '@mantine/core'
import { GetHostsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'
import { PiProhibit, PiPulse } from 'react-icons/pi'
import { TbEdit, TbEyeOff, TbSearch } from 'react-icons/tb'

import {
    type BooleanFilterValue,
    BooleanCell,
    BooleanFilterControl,
    EllipsisCell,
    SelectFilter,
    TextSearchFilter
} from '@shared/ui'

export type { BooleanFilterValue }

export type HostType = GetHostsCommand.Response['response'][number]

export type HostStatusFilter = 'disabled' | 'enabled' | 'hidden'

export interface HostTableContext {
    configProfileNameByUuid: Map<string, string>
    inboundTagByUuid: Map<string, string>
    internalSquadNameByUuid: Map<string, string>
    nodeNameByUuid: Map<string, string>
    xrayTemplateNameByUuid: Map<string, string>
}

export interface HostsTableFilters {
    booleanFilters: Record<string, BooleanFilterValue>
    context: HostTableContext
    selectedStatuses: HostStatusFilter[]
    selectFilters: Record<string, string[]>
    selectOptions: Record<string, { label: string; value: string }[]>
    setBooleanFilter: (key: string, value: BooleanFilterValue) => void
    setSelectedStatuses: (value: HostStatusFilter[]) => void
    setSelectFilter: (key: string, value: string[]) => void
    setTextQuery: (key: string, value: string) => void
    textQueries: Record<string, string>
}

interface HostTextFieldConfig {
    accessor: string
    getValue: (host: HostType) => null | number | string | undefined
    hiddenByDefault?: boolean
    key: string
    label: (t: TFunction) => string
    primary?: boolean
    sortable?: boolean
}

interface HostBooleanFieldConfig {
    accessor: string
    getValue: (host: HostType) => boolean
    hiddenByDefault?: boolean
    key: string
    label: (t: TFunction) => string
    sortable?: boolean
}

interface HostSelectFieldConfig {
    accessor: string
    getValues: (host: HostType) => string[]
    hiddenByDefault?: boolean
    key: string
    label: (t: TFunction) => string
    sortable?: boolean
    valueLabel?: (value: string, context: HostTableContext) => string
}

export const HOST_TEXT_FIELDS: HostTextFieldConfig[] = [
    {
        accessor: 'remark',
        getValue: (host) => host.remark,
        key: 'remark',
        label: (t) => t('base-host-form.remark'),
        primary: true
    },
    {
        accessor: 'address',
        getValue: (host) => host.address,
        key: 'address',
        label: (t) => t('common.field.address')
    },
    {
        accessor: 'port',
        getValue: (host) => host.port,
        key: 'port',
        label: (t) => t('common.field.port')
    },
    {
        accessor: 'sni',
        getValue: (host) => host.sni,
        key: 'sni',
        label: () => 'SNI'
    },
    {
        accessor: 'host',
        getValue: (host) => host.host,
        hiddenByDefault: true,
        key: 'host',
        label: (t) => t('base-host-form.host')
    },
    {
        accessor: 'path',
        getValue: (host) => host.path,
        hiddenByDefault: true,
        key: 'path',
        label: (t) => t('base-host-form.path')
    },
    {
        accessor: 'serverDescription',
        getValue: (host) => host.serverDescription,
        hiddenByDefault: true,
        key: 'serverDescription',
        label: (t) => t('base-host-form.server-description-header')
    },
    {
        accessor: 'vlessRouteId',
        getValue: (host) => host.vlessRouteId,
        hiddenByDefault: true,
        key: 'vlessRouteId',
        label: () => 'VLESS Route ID'
    },
    {
        accessor: 'pinnedPeerCertSha256',
        getValue: (host) => host.pinnedPeerCertSha256,
        hiddenByDefault: true,
        key: 'pinnedPeerCertSha256',
        label: () => 'Pinned Peer Cert'
    },
    {
        accessor: 'verifyPeerCertByName',
        getValue: (host) => host.verifyPeerCertByName,
        hiddenByDefault: true,
        key: 'verifyPeerCertByName',
        label: () => 'Verify Peer Cert By Name'
    }
]

export const HOST_SELECT_FIELDS: HostSelectFieldConfig[] = [
    {
        accessor: 'inbound.configProfileUuid',
        getValues: (host) =>
            host.inbound.configProfileUuid ? [host.inbound.configProfileUuid] : [],
        key: 'configProfile',
        label: (t) => t('use-nodes-table-widget.config-profile'),
        valueLabel: (value, context) => context.configProfileNameByUuid.get(value) ?? value
    },
    {
        accessor: 'inbound.configProfileInboundUuid',
        getValues: (host) =>
            host.inbound.configProfileInboundUuid ? [host.inbound.configProfileInboundUuid] : [],
        key: 'inbound',
        label: (t) => t('common.field.inbounds'),
        valueLabel: (value, context) => context.inboundTagByUuid.get(value) ?? value
    },
    {
        accessor: 'tags',
        getValues: (host) => (host.tags && host.tags.length > 0 ? host.tags : []),
        key: 'tags',
        label: (t) => t('common.field.tags'),
        sortable: true
    },
    {
        accessor: 'securityLayer',
        getValues: (host) => (host.securityLayer ? [host.securityLayer] : []),
        key: 'securityLayer',
        hiddenByDefault: true,
        label: (t) => t('base-host-form.security-layer'),
        sortable: true
    },
    {
        accessor: 'alpn',
        getValues: (host) => (host.alpn ? [host.alpn] : []),
        hiddenByDefault: true,
        key: 'alpn',
        label: () => 'ALPN',
        sortable: true
    },
    {
        accessor: 'fingerprint',
        getValues: (host) => (host.fingerprint ? [host.fingerprint] : []),
        hiddenByDefault: true,
        key: 'fingerprint',
        label: (t) => t('base-host-form.fingerprint'),
        sortable: true
    },
    {
        accessor: 'mihomoIpVersion',
        getValues: (host) => (host.mihomoIpVersion ? [host.mihomoIpVersion] : []),
        hiddenByDefault: true,
        key: 'mihomoIpVersion',
        label: () => 'Mihomo IP Version',
        sortable: true
    },
    {
        accessor: 'excludeFromSubscriptionTypes',
        getValues: (host) => host.excludeFromSubscriptionTypes ?? [],
        hiddenByDefault: true,
        key: 'excludeFromSubscriptionTypes',
        label: (t) => t('base-host-form.exclude-from-subscription-type')
    },
    {
        accessor: 'nodes',
        getValues: (host) => host.nodes ?? [],
        hiddenByDefault: true,
        key: 'nodes',
        label: (t) => t('base-host-form.nodes'),
        valueLabel: (value, context) => context.nodeNameByUuid.get(value) ?? value
    },
    {
        accessor: 'internalSquads.squads',
        getValues: (host) => host.internalSquads?.squads ?? [],
        hiddenByDefault: true,
        key: 'internalSquads',
        label: (t) => t('constants.internal-squads'),
        valueLabel: (value, context) => context.internalSquadNameByUuid.get(value) ?? value
    },
    {
        accessor: 'internalSquads.mode',
        getValues: (host) => (host.internalSquads?.mode ? [host.internalSquads.mode] : []),
        hiddenByDefault: true,
        key: 'internalSquadsMode',
        label: (t) => t('base-host-form.override-type'),
        sortable: true
    },
    {
        accessor: 'xrayJsonTemplateUuid',
        getValues: (host) => (host.xrayJsonTemplateUuid ? [host.xrayJsonTemplateUuid] : []),
        hiddenByDefault: true,
        key: 'xrayJsonTemplate',
        label: (t) => t('base-host-form.xray-json-template'),
        valueLabel: (value, context) => context.xrayTemplateNameByUuid.get(value) ?? value
    }
]

export const HOST_BOOLEAN_FIELDS: HostBooleanFieldConfig[] = [
    {
        accessor: 'overrideSniFromAddress',
        getValue: (host) => host.overrideSniFromAddress,
        hiddenByDefault: true,
        key: 'overrideSniFromAddress',
        label: (t) => t('base-host-form.override-sni-from-address'),
        sortable: true
    },
    {
        accessor: 'keepSniBlank',
        getValue: (host) => host.keepSniBlank,
        hiddenByDefault: true,
        key: 'keepSniBlank',
        label: (t) => t('base-host-form.keep-sni-blank'),
        sortable: true
    },
    {
        accessor: 'shuffleHost',
        getValue: (host) => host.shuffleHost,
        hiddenByDefault: true,
        key: 'shuffleHost',
        label: (t) => t('base-host-form.shuffle-host'),
        sortable: true
    },
    {
        accessor: 'mihomoX25519',
        getValue: (host) => host.mihomoX25519,
        hiddenByDefault: true,
        key: 'mihomoX25519',
        label: (t) => t('base-host-form.enable-x25519mlkem768'),
        sortable: true
    },
    {
        accessor: 'finalMask',
        getValue: (host) => Boolean(host.finalMask),
        hiddenByDefault: true,
        key: 'finalMask',
        label: () => 'Final Mask'
    },
    {
        accessor: 'muxParams',
        getValue: (host) => Boolean(host.muxParams),
        hiddenByDefault: true,
        key: 'muxParams',
        label: () => 'Mux Params'
    },
    {
        accessor: 'sockoptParams',
        getValue: (host) => Boolean(host.sockoptParams),
        hiddenByDefault: true,
        key: 'sockoptParams',
        label: () => 'Sockopt Params'
    },
    {
        accessor: 'xhttpExtraParams',
        getValue: (host) => Boolean(host.xhttpExtraParams),
        hiddenByDefault: true,
        key: 'xhttpExtraParams',
        label: (t) => t('base-host-form.extra-xhttp')
    }
]

function buildTextColumn(
    cfg: HostTextFieldConfig,
    t: TFunction,
    filters: HostsTableFilters
): DataTableColumn<HostType> {
    const lockProps = cfg.primary ? { draggable: false, resizable: true, toggleable: false } : {}

    return {
        accessor: cfg.accessor,
        defaultToggle: !cfg.hiddenByDefault,
        sortable: cfg.sortable ?? true,
        title: cfg.label(t),
        toggleable: true,
        filter: (
            <TextSearchFilter
                label={cfg.label(t)}
                onChange={(value) => filters.setTextQuery(cfg.key, value)}
                value={filters.textQueries[cfg.key] ?? ''}
            />
        ),
        filtering: (filters.textQueries[cfg.key] ?? '') !== '',
        render: (host) => <EllipsisCell>{cfg.getValue(host) ?? '-'}</EllipsisCell>,
        ...lockProps
    }
}

function buildSelectColumn(
    cfg: HostSelectFieldConfig,
    t: TFunction,
    filters: HostsTableFilters
): DataTableColumn<HostType> {
    return {
        accessor: cfg.accessor,
        defaultToggle: !cfg.hiddenByDefault,
        sortable: cfg.sortable ?? false,
        title: cfg.label(t),
        toggleable: true,
        filter: (
            <SelectFilter
                data={filters.selectOptions[cfg.key] ?? []}
                label={cfg.label(t)}
                onChange={(value) => filters.setSelectFilter(cfg.key, value)}
                value={filters.selectFilters[cfg.key] ?? []}
            />
        ),
        filtering: (filters.selectFilters[cfg.key] ?? []).length > 0,
        render: (host) => {
            const labels = cfg
                .getValues(host)
                .map((value) => (cfg.valueLabel ? cfg.valueLabel(value, filters.context) : value))
            return <EllipsisCell>{labels.length ? labels.join(', ') : '-'}</EllipsisCell>
        }
    }
}

function buildBooleanColumn(
    cfg: HostBooleanFieldConfig,
    t: TFunction,
    filters: HostsTableFilters
): DataTableColumn<HostType> {
    return {
        accessor: cfg.accessor,
        defaultToggle: !cfg.hiddenByDefault,
        sortable: cfg.sortable ?? false,
        textAlign: 'center',
        title: cfg.label(t),
        toggleable: true,
        filter: (
            <BooleanFilterControl
                label={cfg.label(t)}
                onChange={(value) => filters.setBooleanFilter(cfg.key, value)}
                value={filters.booleanFilters[cfg.key] ?? 'all'}
            />
        ),
        filtering: (filters.booleanFilters[cfg.key] ?? 'all') !== 'all',
        render: (host) => <BooleanCell value={cfg.getValue(host)} />
    }
}

function buildStatusColumn(t: TFunction, filters: HostsTableFilters): DataTableColumn<HostType> {
    return {
        accessor: 'isDisabled',
        sortable: true,
        title: '',
        toggleable: true,
        filter: (
            <MultiSelect<HostStatusFilter>
                clearable
                comboboxProps={{ withinPortal: false }}
                data={[
                    { label: t('use-hosts-table-widget.disabled'), value: 'disabled' },
                    { label: t('use-hosts-table-widget.enabled'), value: 'enabled' },
                    { label: t('use-hosts-table-widget.hidden'), value: 'hidden' }
                ]}
                leftSection={<TbSearch size={16} />}
                onChange={(value) => filters.setSelectedStatuses(value)}
                renderOption={({ option }) => (
                    <Group gap="xs" wrap="nowrap">
                        {option.value === 'disabled' && (
                            <ActionIcon
                                color="gray"
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="soft"
                            >
                                <PiProhibit size={16} />
                            </ActionIcon>
                        )}
                        {option.value === 'enabled' && (
                            <ActionIcon
                                color="teal"
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="soft"
                            >
                                <PiPulse size={16} />
                            </ActionIcon>
                        )}
                        {option.value === 'hidden' && (
                            <ActionIcon
                                color="violet"
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="soft"
                            >
                                <TbEyeOff size={16} />
                            </ActionIcon>
                        )}
                        <Text size="sm">{option.label}</Text>
                    </Group>
                )}
                searchable
                value={filters.selectedStatuses}
            />
        ),
        filtering: filters.selectedStatuses.length > 0,
        render: ({ isDisabled, isHidden }) => (
            <>
                {isDisabled && (
                    <ActionIcon color="gray" size="lg" style={{ flexShrink: 0 }} variant="soft">
                        <PiProhibit size={16} />
                    </ActionIcon>
                )}

                {!isDisabled && isHidden && (
                    <ActionIcon color="violet" size="lg" style={{ flexShrink: 0 }} variant="soft">
                        <TbEyeOff size={16} />
                    </ActionIcon>
                )}

                {!isDisabled && !isHidden && (
                    <ActionIcon color="teal" size="lg" style={{ flexShrink: 0 }} variant="soft">
                        <PiPulse size={16} />
                    </ActionIcon>
                )}
            </>
        )
    }
}

export function getHostColumnLabels(t: TFunction): Record<string, string> {
    const labels: Record<string, string> = {
        isDisabled: 'Status'
    }
    for (const cfg of [...HOST_TEXT_FIELDS, ...HOST_SELECT_FIELDS, ...HOST_BOOLEAN_FIELDS]) {
        labels[cfg.accessor] = cfg.label(t)
    }
    return labels
}

export function getHostsTableColumns(
    t: TFunction,
    handleViewHost: (hostUuid: string) => void,
    filters: HostsTableFilters
): DataTableColumn<HostType>[] {
    const [remarkColumn, ...textColumns] = HOST_TEXT_FIELDS.map((cfg) =>
        buildTextColumn(cfg, t, filters)
    )
    const selectColumns = HOST_SELECT_FIELDS.map((cfg) => buildSelectColumn(cfg, t, filters))
    const booleanColumns = HOST_BOOLEAN_FIELDS.map((cfg) => buildBooleanColumn(cfg, t, filters))

    const actionsColumn: DataTableColumn<HostType> = {
        accessor: 'actions',
        cellsStyle: () => ({ backgroundColor: 'var(--mantine-color-dark-7)' }),
        draggable: false,
        resizable: false,
        textAlign: 'right',
        title: (
            <Group c="dimmed" gap={4} justify="flex-end" pr={4} wrap="nowrap">
                <TbEdit size={18} />
            </Group>
        ),
        titleStyle: { backgroundColor: 'var(--mantine-color-dark-7)' },
        toggleable: false,
        render: ({ uuid }) => (
            <Group gap={4} justify="flex-end" wrap="nowrap">
                <ActionIcon
                    color="teal"
                    onClick={() => handleViewHost(uuid)}
                    size="md"
                    variant="outline"
                >
                    <TbEdit size={18} />
                </ActionIcon>
            </Group>
        )
    }

    return [
        remarkColumn,
        buildStatusColumn(t, filters),
        ...textColumns,
        ...selectColumns,
        ...booleanColumns,
        actionsColumn
    ]
}
