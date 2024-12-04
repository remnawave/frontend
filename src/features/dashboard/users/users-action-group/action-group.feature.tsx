/* eslint-disable camelcase */
import { GetAllUsersV2Command } from '@remnawave/backend-contract'
import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { MRT_TableInstance } from 'mantine-react-table'
import { Button, Group } from '@mantine/core'

import {
    useUsersTableStoreLoading,
    useUsersTableStoreRefetch,
    useUsersTableStoreTable
} from '@entitites/dashboard/users-table-store'
import { useUserCreationModalStoreActions } from '@entitites/dashboard/user-creation-modal-store'

import { IProps } from './interfaces'

export const UserActionGroupFeature = (props: IProps) => {
    const { isLoading, refetch, table } = props
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

            table.resetPageIndex(false)
            table.resetSorting(true)
            table.resetPagination(false)
            table.resetColumnFilters(true)
            table.resetColumnPinning(true)
            table.resetGlobalFilter(true)
        }
    }

    if (!table || !refetch) {
        return null
    }

    return (
        <Group>
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isLoading}
                onClick={handleRefetch}
                size="xs"
                variant="default"
            >
                Update
            </Button>

            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isLoading}
                onClick={handleResetTable}
                size="xs"
                variant="outline"
            >
                Reset table
            </Button>

            <Button
                leftSection={<PiPlus size="1rem" />}
                onClick={handleOpenCreateUserModal}
                size="xs"
                variant="default"
            >
                Create new user
            </Button>
        </Group>
    )
}
