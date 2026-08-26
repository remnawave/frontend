import { DataTableColumn } from '@kastov/mantine-datatable'
import { ActionIcon, Badge, Group, MultiSelect, Text } from '@mantine/core'
import {
    GetAllInboundsCommand,
    GetConfigProfilesCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import {
    EMPTY_INBOUND_NODE_AGGREGATE,
    IInboundNodeAggregate
} from '@widgets/dashboard/inbounds/inbound-status-tile/get-inbound-node-status.util'
import { InboundStatusTileWidget } from '@widgets/dashboard/inbounds/inbound-status-tile/inbound-status-tile.widget'
import ColorHash from 'color-hash'
import { TFunction } from 'i18next'
import sortBy from 'lodash/sortBy'
import { PiUsersDuotone } from 'react-icons/pi'
import { TbSearch, TbTag } from 'react-icons/tb'

import { formatInt } from '@shared/utils/misc'

export interface InboundsTableFilters {
    availableConfigProfiles: { label: string; value: string }[]
    availableTypes: string[]
    selectedConfigProfiles: string[]
    selectedTypes: string[]
    setSelectedConfigProfiles: (value: string[]) => void
    setSelectedTypes: (value: string[]) => void
}

type Inbound = GetAllInboundsCommand.Response['response']['inbounds'][number]
export type InboundRow = Inbound & { onlineUsersCount: number }

const colorHash = new ColorHash({ lightness: 0.7, saturation: 0.6 })

export function getInboundsTableColumns(
    t: TFunction,
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'],
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads'],
    nodeAggregateByInboundUuid: Map<string, IInboundNodeAggregate>,
    handleViewRawInbound: (inbound: InboundRow) => void,
    filters: InboundsTableFilters
): DataTableColumn<InboundRow>[] {
    const squadNameByUuid = new Map(internalSquads.map((squad) => [squad.uuid, squad.name]))

    return [
        {
            accessor: 'tag',
            sortable: true,
            title: t('common.name'),
            render: (inbound) => (
                <Group gap={8} wrap="nowrap">
                    <ActionIcon
                        color={colorHash.hex(inbound.tag)}
                        onClick={(event) => {
                            event.stopPropagation()
                            handleViewRawInbound(inbound)
                        }}
                        size="sm"
                        style={{ flexShrink: 0 }}
                        variant="filled"
                    >
                        <TbTag color="var(--mantine-color-dark-8)" size={16} />
                    </ActionIcon>
                    <Text ff="monospace" fw={600} size="sm">
                        {inbound.tag}
                    </Text>
                </Group>
            )
        },
        {
            accessor: 'status',
            sortable: false,
            title: '',
            render: (inbound) => (
                <InboundStatusTileWidget
                    aggregate={
                        nodeAggregateByInboundUuid.get(inbound.uuid) ?? EMPTY_INBOUND_NODE_AGGREGATE
                    }
                />
            )
        },
        {
            accessor: 'onlineUsersCount',
            sortable: true,
            title: t('inbounds-datatable.widget.online'),
            render: ({ onlineUsersCount }) => (
                <Badge
                    color={onlineUsersCount > 0 ? 'teal' : 'gray'}
                    leftSection={<PiUsersDuotone size={14} />}
                    miw="10ch"
                    size="lg"
                    variant="outline"
                >
                    {formatInt(onlineUsersCount)}
                </Badge>
            )
        },
        {
            accessor: 'type',
            sortable: true,
            title: t('inbounds-datatable.widget.type'),
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availableTypes}
                    label={t('inbounds-datatable.widget.type')}
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedTypes}
                    searchable
                    value={filters.selectedTypes}
                />
            ),
            filtering: filters.selectedTypes.length > 0,
            render: ({ type }) => (
                <Text size="sm" tt="uppercase">
                    {type}
                </Text>
            )
        },
        {
            accessor: 'profileUuid',
            sortable: true,
            title: t('inbounds-datatable.widget.profile'),
            filter: (
                <MultiSelect
                    clearable
                    comboboxProps={{ withinPortal: false }}
                    data={filters.availableConfigProfiles}
                    label={t('inbounds-datatable.widget.profile')}
                    leftSection={<TbSearch size={16} />}
                    onChange={filters.setSelectedConfigProfiles}
                    searchable
                    value={filters.selectedConfigProfiles}
                />
            ),
            filtering: filters.selectedConfigProfiles.length > 0,
            render: ({ profileUuid }) =>
                configProfiles.find((profile) => profile.uuid === profileUuid)?.name ?? profileUuid
        },
        {
            accessor: 'activeSquads',
            sortable: true,
            title: t('inbounds-datatable.widget.squads'),
            render: ({ activeSquads }) => {
                const names = sortBy(
                    activeSquads.map((uuid) => squadNameByUuid.get(uuid) ?? uuid)
                )

                return (
                    <Text size="sm" truncate="end">
                        {names.join(', ') || '-'}
                    </Text>
                )
            }
        }
    ]
}
