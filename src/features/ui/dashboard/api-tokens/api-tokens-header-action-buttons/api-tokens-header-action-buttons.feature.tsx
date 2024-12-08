import { Button, Group } from '@mantine/core'
import { PiPlus } from 'react-icons/pi'

import { useApiTokensStoreActions } from '@entities/dashboard/api-tokens/api-tokens-store'

export const ApiTokensHeaderActionButtonsFeature = () => {
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
                Create new API token
            </Button>
        </Group>
    )
}
