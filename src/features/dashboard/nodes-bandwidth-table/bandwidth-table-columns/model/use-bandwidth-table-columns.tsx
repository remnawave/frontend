/* eslint-disable camelcase */
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { Group, Progress, Text } from '@mantine/core'
import { MRT_ColumnDef } from 'mantine-react-table'
import { useMemo } from 'react'

import { getNodeResetPeriodUtil } from '@shared/utils/time-utils/get-node-reset-days'
import { prettyBytesUtil } from '@shared/utils/bytes'

export const useBandwidthTableColumns = () => {
    return useMemo<MRT_ColumnDef<GetAllNodesCommand.Response['response'][0]>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Node name',
                mantineTableBodyCellProps: {
                    align: 'left'
                },
                minSize: 150,
                maxSize: 300,
                size: 220
            },
            {
                accessorKey: 'trafficResetDay',
                header: 'Traffic cycle',
                Cell: ({ cell }) => (
                    <Text>{getNodeResetPeriodUtil(cell.row.original.trafficResetDay ?? 0)}</Text>
                ),
                mantineTableBodyCellProps: {
                    align: 'left'
                },
                minSize: 150,
                maxSize: 300,
                size: 300
            },
            {
                accessorKey: 'trafficUsedBytes',
                header: 'Traffic',
                Cell: ({ cell }) => {
                    const node = cell.row.original
                    let percentage = 0

                    if (node.trafficLimitBytes === 0) {
                        percentage = 100
                    } else {
                        percentage = Math.floor(
                            ((node.trafficUsedBytes ?? 0) * 100) / (node.trafficLimitBytes ?? 0)
                        )
                    }

                    return (
                        <>
                            <Group gap="xs">
                                <Progress
                                    color={percentage > 95 ? 'red.9' : 'teal.9'}
                                    radius="md"
                                    size="25"
                                    striped
                                    value={percentage}
                                    w={'10ch'}
                                />
                                <Text ff="monospace">
                                    {prettyBytesUtil(node.trafficUsedBytes || 0) || '0 GB'}
                                </Text>
                            </Group>
                        </>
                    )
                },
                mantineTableBodyCellProps: {
                    align: 'left'
                },
                minSize: 150,
                maxSize: 300,
                size: 300
            },
            {
                accessorKey: 'trafficLimitBytes',
                header: 'Traffic limit',
                Cell: ({ cell }) => (
                    <Text ff="monospace">
                        {prettyBytesUtil(cell.row.original.trafficLimitBytes || 0) || '0 GB'}
                    </Text>
                ),
                mantineTableBodyCellProps: {
                    align: 'left'
                },
                minSize: 150,
                maxSize: 300,
                size: 300
            }
        ],
        []
    )
}
