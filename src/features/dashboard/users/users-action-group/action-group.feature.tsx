import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbFilterOff, TbPlus, TbRefresh, TbRestore } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'

import { useUsersTableStoreActions } from '@entities/dashboard/users/users-table-store'

import { UsersTableTemplatesFeature } from '../users-table-templates/users-table-templates.feature'
import { IProps } from './interfaces'

export const UserActionGroupFeature = (props: IProps) => {
    const { t } = useTranslation()

    const { isLoading, refetch, table } = props
    const actions = useUsersTableStoreActions()

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
            table.resetSorting(false)
            table.resetPagination(false)
            table.resetColumnFilters(true)
            table.resetGlobalFilter(true)
        }
    }

    const handleClearFilters = () => {
        if (table && refetch) {
            refetch()

            table.resetPageIndex(false)
            table.resetSorting(false)
            table.resetPagination(false)
            table.resetColumnFilters(true)
            table.resetGlobalFilter(true)
        }
    }

    if (!table || !refetch) {
        return null
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIconGroup>
                <UsersTableTemplatesFeature table={table} />

                <Tooltip label={t('action-group.feature.clear-filters')} withArrow>
                    <ActionIcon
                        color="gray"
                        loading={isLoading}
                        onClick={handleClearFilters}
                        size="input-md"
                        variant="soft"
                    >
                        <TbFilterOff size="24px" />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label={t('action-group.feature.reset-table')} withArrow>
                    <ActionIcon
                        color="gray"
                        loading={isLoading}
                        onClick={handleResetTable}
                        size="input-md"
                        variant="soft"
                    >
                        <TbRestore size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('common.action.refresh')} withArrow>
                    <ActionIcon
                        loading={isLoading}
                        onClick={handleRefetch}
                        size="input-md"
                        variant="soft"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label={t('common.action.create')} withArrow>
                    <ActionIcon
                        color="teal"
                        onClick={() => showModal('users_createUserModal')}
                        size="input-md"
                        variant="soft"
                    >
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
