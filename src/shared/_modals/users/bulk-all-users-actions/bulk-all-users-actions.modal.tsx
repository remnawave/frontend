import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { DeleteAllUsersByStatusFeature } from '@features/ui/dashboard/users/delete-all-users-by-status'
import { Button, Modal, NumberInput, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { TbBolt, TbCalendarUp, TbRefresh, TbTrash, TbUsersMinus } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    QueryKeys,
    useBulkAllExtendUsersExpirationDate,
    useBulkAllResetTrafficUsers
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { ActionCardShared } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

export const BulkAllUsersActionsModal = NiceModal.create(() => {
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        onClose: () => {
            queryClient.refetchQueries({ queryKey: QueryKeys.users.getAllUsers._def })
            queryClient.refetchQueries({ queryKey: QueryKeys.system.getSystemStats.queryKey })
        }
    })

    const { mutate: resetTraffic, isPending: isResetTrafficPending } = useBulkAllResetTrafficUsers({
        mutationFns: {}
    })

    const { mutate: extendExpirationDate, isPending: isExtendExpirationDatePending } =
        useBulkAllExtendUsersExpirationDate({
            mutationFns: {}
        })

    const handleExtendExpirationDate = () => {
        let userInput = 1

        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCalendarUp}
                    iconVariant="soft"
                    title={t('bulk-user-actions.actions.tab.feature.extend-expiration-date')}
                    titleOrder={5}
                />
            ),
            centered: true,
            children: (
                <>
                    <NumberInput
                        allowDecimal={false}
                        allowNegative={false}
                        data-autofocus
                        decimalScale={0}
                        defaultValue={1}
                        description={t(
                            'bulk-user-actions.actions.tab.feature.enter-the-number-of-days-to-extend-the-expiration-date'
                        )}
                        label={t('bulk-user-actions.actions.tab.feature.extend-days')}
                        max={9999}
                        min={1}
                        onChange={(value) => {
                            userInput = Number(value)
                        }}
                        required
                        step={1}
                    />
                    <Button
                        fullWidth
                        mt="md"
                        onClick={() => {
                            modals.closeAll()
                            extendExpirationDate({
                                variables: {
                                    extendDays: userInput
                                }
                            })
                        }}
                    >
                        {t('bulk-user-actions.actions.tab.feature.extend')}
                    </Button>
                </>
            )
        })
    }

    return (
        <Modal
            {...modalProps}
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbBolt}
                    iconVariant="soft"
                    subtitle={t('bulk-all-users-actions.modal.perform-actions-on-all-users')}
                    title={t('common.action.bulk-actions')}
                    titleOrder={5}
                />
            }
        >
            <Stack gap="xs">
                <ActionCardShared
                    description={t(
                        'bulk-user-actions.actions.tab.feature.extend-expiration-date-description'
                    )}
                    icon={<TbCalendarUp size={20} />}
                    iconColor="cyan"
                    isLoading={isExtendExpirationDatePending}
                    onClick={handleExtendExpirationDate}
                    title={t('bulk-user-actions.actions.tab.feature.extend-expiration-date')}
                    variant="soft"
                />
                <ActionCardShared
                    description={t(
                        'bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic-description'
                    )}
                    icon={<TbRefresh size={20} />}
                    iconColor="blue"
                    isLoading={isResetTrafficPending}
                    onClick={() => resetTraffic({})}
                    title={t('common.action.reset-traffic')}
                    variant="soft"
                    withConfirmation
                />
                <ActionCardShared
                    description={t(
                        'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status-description'
                    )}
                    icon={<TbUsersMinus size={20} />}
                    iconColor="red"
                    onClick={() => {
                        modals.open({
                            title: (
                                <BaseOverlayHeader
                                    iconColor="red"
                                    IconComponent={TbTrash}
                                    iconVariant="soft"
                                    title={t(
                                        'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status'
                                    )}
                                />
                            ),
                            centered: true,
                            children: <DeleteAllUsersByStatusFeature />
                        })
                    }}
                    title={t(
                        'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status'
                    )}
                    variant="soft"
                />
            </Stack>
        </Modal>
    )
})
