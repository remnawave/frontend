import {
    TbBaselineDensityLarge,
    TbBaselineDensityMedium,
    TbBaselineDensitySmall,
    TbColumns,
    TbFilter,
    TbFilterOff,
    TbMaximize,
    TbMinimize,
    TbQuestionMark
} from 'react-icons/tb'
import { PiAnchorSimpleDuotone, PiArrowsClockwise, PiExcludeSquare, PiPlus } from 'react-icons/pi'
import { Button, Drawer, Group, Stack, Table, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'

import { BulkAllUserActionsDrawerWidget } from '@widgets/dashboard/users/bulk-all-user-actions-drawer/bulk-all-user-actions-drawer.widget'
import { useUserCreationModalStoreActions } from '@entities/dashboard/user-creation-modal-store'
import { useUsersTableStoreActions } from '@entities/dashboard/users/users-table-store'

import { IProps } from './interfaces'

export const UserActionGroupFeature = (props: IProps) => {
    const { t } = useTranslation()

    const [isHelpDrawerOpen, helpDrawerHandlers] = useDisclosure(false)

    const { isLoading, refetch, table } = props
    const actions = useUsersTableStoreActions()
    const [isBulkAllUserActionsDrawerOpen, bulkAllDrawerHandlers] = useDisclosure(false)

    const userCreationModalActions = useUserCreationModalStoreActions()

    const handleOpenCreateUserModal = () => {
        userCreationModalActions.changeModalState(true)
    }

    const handleRefetch = () => {
        if (table && refetch) {
            refetch()
        }
    }

    const handleResetTable = () => {
        if (table && refetch) {
            refetch()
            actions.resetState()

            table.resetPageIndex(false)
            table.resetSorting(true)
            table.resetPagination(false)
            table.resetColumnFilters(true)
            table.resetGlobalFilter(true)
        }
    }

    const handleClearFilters = () => {
        if (table && refetch) {
            refetch()

            table.resetPageIndex(false)
            table.resetSorting(true)
            table.resetPagination(false)
            table.resetColumnFilters(true)
            table.resetGlobalFilter(true)
        }
    }

    if (!table || !refetch) {
        return null
    }

    return (
        <>
            <Group grow preventGrowOverflow={false} wrap="wrap">
                <Button
                    color="lime"
                    leftSection={<TbQuestionMark size="1.25rem" />}
                    onClick={helpDrawerHandlers.open}
                    size="xs"
                    variant="light"
                >
                    Help
                </Button>
                <Button
                    leftSection={<PiArrowsClockwise size="1rem" />}
                    loading={isLoading}
                    onClick={handleRefetch}
                    size="xs"
                    variant="default"
                >
                    {t('action-group.feature.update')}
                </Button>
                <Button
                    color="gray"
                    leftSection={<PiExcludeSquare size="1rem" />}
                    loading={isLoading}
                    onClick={handleClearFilters}
                    size="xs"
                    variant="outline"
                >
                    {t('action-group.feature.clear-filters')}
                </Button>

                <Button
                    leftSection={<PiArrowsClockwise size="1rem" />}
                    loading={isLoading}
                    onClick={handleResetTable}
                    size="xs"
                    variant="outline"
                >
                    {t('action-group.feature.reset-table')}
                </Button>

                <Button
                    color="red"
                    leftSection={<PiAnchorSimpleDuotone size="1rem" />}
                    loading={isLoading}
                    onClick={bulkAllDrawerHandlers.open}
                    size="xs"
                    variant="outline"
                >
                    {t('action-group.feature.bulk-actions')}
                </Button>

                <Button
                    leftSection={<PiPlus size="1rem" />}
                    onClick={handleOpenCreateUserModal}
                    size="xs"
                    variant="default"
                >
                    {t('action-group.feature.new-user')}
                </Button>
                <BulkAllUserActionsDrawerWidget
                    handlers={bulkAllDrawerHandlers}
                    isDrawerOpen={isBulkAllUserActionsDrawerOpen}
                />
            </Group>

            <Drawer
                keepMounted={false}
                onClose={helpDrawerHandlers.close}
                opened={isHelpDrawerOpen}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="lg"
                position="left"
                size="500px"
                title="Table Controls Help"
            >
                <Stack gap="md">
                    <Text c="dimmed" size="sm">
                        This table provides several controls to help you view and manage the data
                        effectively. Here's what each control does:
                    </Text>

                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Control</Table.Th>
                                <Table.Th>Description</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>
                                    <Group gap="xs">
                                        <TbFilter size="1.5rem" />
                                        <TbFilterOff size="1.5rem" />
                                    </Group>
                                </Table.Td>
                                <Table.Td>Toggle column filters to search and filter data</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>
                                    <TbColumns size="1.5rem" />
                                </Table.Td>
                                <Table.Td>Show or hide specific columns</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>
                                    <Group gap="xs">
                                        <TbBaselineDensitySmall size="1.5rem" />
                                        <TbBaselineDensityMedium size="1.5rem" />
                                        <TbBaselineDensityLarge size="1.5rem" />
                                    </Group>
                                </Table.Td>
                                <Table.Td>Adjust row spacing density</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>
                                    <Group gap="xs">
                                        <TbMaximize size="1.5rem" />
                                        <TbMinimize size="1.5rem" />
                                    </Group>
                                </Table.Td>
                                <Table.Td>Toggle fullscreen table view</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Stack>
            </Drawer>
        </>
    )
}
