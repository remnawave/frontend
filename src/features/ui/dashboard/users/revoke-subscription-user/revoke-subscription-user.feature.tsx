import { TbAlertTriangle, TbKey } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { PiKeyDuotone } from 'react-icons/pi'
import { Menu, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'

import { useRevokeUserSubscription, usersQueryKeys } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { ActionCardShared } from '@shared/ui/action-card'
import { queryClient } from '@shared/api'

import { IProps } from './interfaces'

export function RevokeSubscriptionUserFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const RevokeModalContent = () => {
        const { mutate: revokeUserSubscription, isPending } = useRevokeUserSubscription({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        usersQueryKeys.getUserByUuid({ uuid: userUuid }).queryKey,
                        data
                    )

                    modals.closeAll()
                }
            }
        })

        return (
            <Stack gap="sm">
                <ActionCardShared
                    description={t('revoke-subscription-user.feature.full-revoke-description')}
                    icon={<TbAlertTriangle size={22} />}
                    isLoading={isPending}
                    onClick={() => {
                        revokeUserSubscription({
                            variables: {
                                revokeOnlyPasswords: false
                            },
                            route: { uuid: userUuid }
                        })
                    }}
                    title={t('revoke-subscription-user.feature.full-revoke')}
                    variant="gradient-red"
                />

                <ActionCardShared
                    description={t('revoke-subscription-user.feature.passwords-only-decription')}
                    icon={<TbKey size={22} />}
                    isLoading={isPending}
                    onClick={() => {
                        revokeUserSubscription({
                            variables: {
                                revokeOnlyPasswords: true
                            },
                            route: { uuid: userUuid }
                        })
                    }}
                    title={t('revoke-subscription-user.feature.passwords-only')}
                    variant="gradient-yellow"
                />
            </Stack>
        )
    }

    const openRevokeModal = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    IconComponent={PiKeyDuotone}
                    iconVariant="gradient-teal"
                    title={t('revoke-subscription-user.feature.revoke')}
                />
            ),
            centered: true,
            size: 'md',
            children: <RevokeModalContent />
        })
    }

    return (
        <Menu.Item leftSection={<PiKeyDuotone size="16px" />} onClick={openRevokeModal}>
            {t('revoke-subscription-user.feature.revoke')}
        </Menu.Item>
    )
}
