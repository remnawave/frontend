import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'
import { PiPlus } from 'react-icons/pi'

import { useApiTokensStoreActions } from '@entities/dashboard/api-tokens/api-tokens-store'

export const ApiTokensHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const actions = useApiTokensStoreActions()

    const handleCreate = () => {
        actions.toggleCreateModal(true)
    }

    return (
        <Group>
            <Button
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
                size="xs"
                variant="default"
            >
                {t('api-tokens-header-action-buttons.feature.create-new-api-token')}
            </Button>
        </Group>
    )
}
