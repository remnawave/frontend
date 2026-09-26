import { ActionIcon, Badge, Button, CloseButton, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbBolt, TbEdit, TbSelectAll } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { QueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'

import { useUsersTableSelectionStoreActions } from '@entities/dashboard/users/users-table-selection'

import { IProps } from './interfaces/props.interface'

export const UsersTableSelectionFeature = (props: IProps) => {
    const { resetRowSelection, toggleAllPageRowsSelected } = props
    const { t } = useTranslation()

    const usersTableSelectionStoreActions = useUsersTableSelectionStoreActions()

    const handleClearSelection = () => {
        resetRowSelection()
        usersTableSelectionStoreActions.resetState()
    }

    const usersToUpdate = usersTableSelectionStoreActions.getIdsLength()

    if (usersToUpdate === 0) {
        return null
    }

    const handleCloseModal = async () => {
        resetRowSelection()
        usersTableSelectionStoreActions.resetState()
        await queryClient.refetchQueries({ queryKey: QueryKeys.users.getAllUsers._def })
        await queryClient.refetchQueries({ queryKey: QueryKeys.system._def })
    }

    return (
        <Group justify="apart" px="xs">
            <Group justify="space-between">
                <Badge color="gray" size="lg" variant="light">
                    {t('common.message.selected', { count: usersToUpdate })}
                </Badge>
                <Group gap={0} justify="flex-end">
                    <Tooltip label={t('common.action.select-all')} withArrow>
                        <ActionIcon
                            color="gray"
                            onClick={toggleAllPageRowsSelected}
                            size="lg"
                            variant="subtle"
                        >
                            <TbSelectAll size={20} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('common.action.clear-selection')} withArrow>
                        <CloseButton onClick={handleClearSelection} />
                    </Tooltip>
                </Group>
            </Group>

            <Group gap="xs">
                <Button
                    color="green"
                    leftSection={<TbBolt />}
                    onClick={() =>
                        showModal('users_bulkManyUsersActionsModal', {
                            usersCount: usersToUpdate,
                            onClose: handleCloseModal
                        })
                    }
                    size="sm"
                    variant="soft"
                >
                    {t('common.action.actions')}
                </Button>
                <Button
                    color="red"
                    leftSection={<TbEdit />}
                    onClick={() =>
                        showModal('users_bulkManyUsersUpdateModal', {
                            usersCount: usersToUpdate,
                            onClose: handleCloseModal
                        })
                    }
                    size="sm"
                    variant="soft"
                >
                    {t('common.action.update')}
                </Button>
            </Group>
        </Group>
    )
}
