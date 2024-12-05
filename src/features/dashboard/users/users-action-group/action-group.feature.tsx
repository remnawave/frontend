/* eslint-disable camelcase */

import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { Button, Group } from '@mantine/core'

import { useUserCreationModalStoreActions } from '@entities/dashboard/user-creation-modal-store'

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
                New user
            </Button>
        </Group>
    )
}
