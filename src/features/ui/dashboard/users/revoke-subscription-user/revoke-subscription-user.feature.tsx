import { Menu, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { PiKeyDuotone } from 'react-icons/pi'
import { TbAlertTriangle, TbKey } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { useRevokeUserSubscription, usersQueryKeys } from '@shared/api/hooks'
import { ActionCardShared } from '@shared/ui/action-card'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

interface IProps {
    userId: number
}

export function RevokeSubscriptionUserFeature(props: IProps) {
    const { userId } = props
    const { t } = useTranslation()

    const RevokeModalContent = () => {
        const { mutate: revokeUserSubscription, isPending } = useRevokeUserSubscription({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        usersQueryKeys.getUserById({ userId: userId }).queryKey,
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
                    iconColor="red"
                    isLoading={isPending}
                    onClick={() => {
                        revokeUserSubscription({
                            variables: {
                                revokeOnlyPasswords: false
                            },
                            route: { userId: userId }
                        })
                    }}
                    title={t('revoke-subscription-user.feature.full-revoke')}
                    variant="soft"
                />

                <ActionCardShared
                    description={t('revoke-subscription-user.feature.passwords-only-description')}
                    icon={<TbKey size={22} />}
                    iconColor="yellow"
                    isLoading={isPending}
                    onClick={() => {
                        revokeUserSubscription({
                            variables: {
                                revokeOnlyPasswords: true
                            },
                            route: { userId: userId }
                        })
                    }}
                    title={t('revoke-subscription-user.feature.passwords-only')}
                    variant="soft"
                />
            </Stack>
        )
    }

    const openRevokeModal = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={PiKeyDuotone}
                    iconVariant="soft"
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
