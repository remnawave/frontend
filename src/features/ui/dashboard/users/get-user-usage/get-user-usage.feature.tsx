import { PiChartBarDuotone } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Button } from '@mantine/core'

import { UserUsageModalWidget } from '@widgets/dashboard/users/user-usage-modal/user-usage-modal.widget'

import { IProps } from './interfaces'

export function GetUserUsageFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    return (
        <>
            <Button
                color="grape"
                leftSection={<PiChartBarDuotone size="1rem" />}
                onClick={handlers.open}
                size="md"
                variant="outline"
            >
                {t('get-user-usage.feature.show-usage')}
            </Button>
            <UserUsageModalWidget onClose={handlers.close} opened={opened} userUuid={userUuid} />
        </>
    )
}
