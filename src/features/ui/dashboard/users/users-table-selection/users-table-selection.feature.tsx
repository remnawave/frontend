import { Button, Group, Text } from '@mantine/core'
import { PiClockClockwise } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'

import { IProps } from './interfaces/props.interface'

export const UsersTableSelectionFeature = (props: IProps) => {
    const { resetRowSelection, toggleAllPageRowsSelected } = props
    const { t } = useTranslation()

    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()

    const handleClearSelection = () => {
        resetRowSelection()
        bulkUsersActionsStoreActions.resetState()
    }

    const usersToUpdate = bulkUsersActionsStoreActions.getUuidLength()

    if (usersToUpdate === 0) {
        return null
    }

    return (
        <Group justify="apart" px="xs">
            <Text fw={600} size="sm">
                {usersToUpdate} {t('users-table-selection.feature.row-s-selected')}
            </Text>
            <Group gap="xs">
                <Button color="blue" onClick={handleClearSelection} size="xs" variant="subtle">
                    {t('users-table-selection.feature.clear-selection')}
                </Button>
                <Button color="blue" onClick={toggleAllPageRowsSelected} size="xs" variant="subtle">
                    {t('users-table-selection.feature.select-all')}
                </Button>
                <Button
                    color="green"
                    leftSection={<PiClockClockwise />}
                    onClick={() => bulkUsersActionsStoreActions.setIsDrawerOpen(true)}
                    size="sm"
                    variant="subtle"
                >
                    {t('users-table-selection.feature.bulk-actions')}
                </Button>
            </Group>
        </Group>
    )
}
