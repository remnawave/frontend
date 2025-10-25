import { useTranslation } from 'react-i18next'
import { Stack, Text } from '@mantine/core'

import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { getExpirationTextUtil } from '@shared/utils/time-utils'

import { IProps } from './interface'

export function StatusColumnEntity(props: IProps) {
    const { t, i18n } = useTranslation()

    const { user, need } = props

    const expirationText = getExpirationTextUtil(user.expireAt, t, i18n)

    if (need === 'badge') {
        return <UserStatusBadge miw="13ch" status={user.status} />
    }

    if (need === 'date') {
        return (
            <Text c="dimmed" size="xs">
                {expirationText}
            </Text>
        )
    }

    return (
        <Stack gap="xs">
            <UserStatusBadge status={user.status} />
            <Text c="dimmed" size="xs">
                {expirationText}
            </Text>
        </Stack>
    )
}
