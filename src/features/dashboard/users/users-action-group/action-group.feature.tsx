import { PiAnchorSimpleDuotone, PiArrowsClockwise, PiExcludeSquare, PiPlus } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group } from '@mantine/core'

import { BulkAllUserActionsDrawerWidget } from '@widgets/dashboard/users/bulk-all-user-actions-drawer/bulk-all-user-actions-drawer.widget'
import { useUserCreationModalStoreActions } from '@entities/dashboard/user-creation-modal-store'
import { useUsersTableStoreActions } from '@entities/dashboard/users/users-table-store'

import { IProps } from './interfaces'

export const UserActionGroupFeature = (props: IProps) => {
    const { t } = useTranslation()

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
        <Group grow preventGrowOverflow={false} wrap="wrap">
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
    )
}
