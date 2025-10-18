import {
    TbBaselineDensityLarge,
    TbBaselineDensityMedium,
    TbBaselineDensitySmall,
    TbColumns,
    TbFilter,
    TbFilterOff,
    TbMaximize,
    TbMinimize,
    TbPlus,
    TbQuestionMark,
    TbRefresh,
    TbRestore,
    TbSettings
} from 'react-icons/tb'
import {
    ActionIcon,
    ActionIconGroup,
    Drawer,
    Flex,
    Group,
    Stack,
    Table,
    Text,
    Tooltip
} from '@mantine/core'
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
            <Flex
                align="center"
                gap={{ base: 0, sm: 'xs' }}
                justify={{ base: 'space-between', sm: 'flex-end' }}
                w={{ base: '100%', sm: 'auto' }}
            >
                <ActionIconGroup>
                    <Tooltip label={t('action-group.feature.help')} withArrow>
                        <ActionIcon
                            color="lime"
                            onClick={helpDrawerHandlers.open}
                            size="lg"
                            variant="light"
                        >
                            <TbQuestionMark size="18px" />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>

                <ActionIconGroup>
                    <Tooltip label={t('action-group.feature.update')} withArrow>
                        <ActionIcon
                            loading={isLoading}
                            onClick={handleRefetch}
                            size="lg"
                            variant="light"
                        >
                            <TbRefresh size="18px" />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label={t('action-group.feature.clear-filters')} withArrow>
                        <ActionIcon
                            color="orange"
                            loading={isLoading}
                            onClick={handleClearFilters}
                            size="lg"
                            variant="light"
                        >
                            <TbFilterOff size="18px" />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label={t('action-group.feature.reset-table')} withArrow>
                        <ActionIcon
                            color="gray"
                            loading={isLoading}
                            onClick={handleResetTable}
                            size="lg"
                            variant="light"
                        >
                            <TbRestore size="18px" />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>

                <ActionIconGroup>
                    <Tooltip label={t('action-group.feature.bulk-actions')} withArrow>
                        <ActionIcon
                            color="red"
                            loading={isLoading}
                            onClick={bulkAllDrawerHandlers.open}
                            size="lg"
                            variant="light"
                        >
                            <TbSettings size="18px" />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label={t('action-group.feature.new-user')} withArrow>
                        <ActionIcon
                            color="teal"
                            onClick={handleOpenCreateUserModal}
                            size="lg"
                            variant="light"
                        >
                            <TbPlus size="18px" />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>

                <BulkAllUserActionsDrawerWidget
                    handlers={bulkAllDrawerHandlers}
                    isDrawerOpen={isBulkAllUserActionsDrawerOpen}
                />
            </Flex>

            <Drawer
                keepMounted={false}
                onClose={helpDrawerHandlers.close}
                opened={isHelpDrawerOpen}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="lg"
                position="left"
                size="500px"
                title={t('action-group.feature.table-controls-help')}
            >
                <Stack gap="md">
                    <Text c="dimmed" size="sm">
                        {t('action-group.feature.table-controler-description-line-1')}
                    </Text>

                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    {t('action-group.feature.table-controler-description-line-2')}
                                </Table.Th>
                                <Table.Th>
                                    {t('action-group.feature.table-controler-description-line-3')}
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>
                                    <Group gap="xs">
                                        <TbFilter size="24px" />
                                        <TbFilterOff size="24px" />
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    {t('action-group.feature.table-controler-description-line-4')}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>
                                    <TbColumns size="24px" />
                                </Table.Td>
                                <Table.Td>
                                    {t('action-group.feature.show-or-hide-specific-columns')}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>
                                    <Group gap="xs">
                                        <TbBaselineDensitySmall size="24px" />
                                        <TbBaselineDensityMedium size="24px" />
                                        <TbBaselineDensityLarge size="24px" />
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    {t('action-group.feature.adjust-row-spacing-density')}
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>
                                    <Group gap="xs">
                                        <TbMaximize size="24px" />
                                        <TbMinimize size="24px" />
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    {t('action-group.feature.toggle-fullscreen-table-view')}
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Stack>
            </Drawer>
        </>
    )
}
