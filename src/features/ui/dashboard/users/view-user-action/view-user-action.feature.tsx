import { Button, Group } from '@mantine/core'
import { PiEyeDuotone } from 'react-icons/pi'

import { useUserModalStoreActions } from '@/entitites/dashboard/user-modal-store/user-modal-store'

import { IProps } from './interfaces'

export function ViewUserActionFeature(props: IProps) {
    const { userUuid } = props

    const actions = useUserModalStoreActions()

    const handleOpenModal = async () => {
        await actions.setUserUuid(userUuid)
        actions.changeModalState(true)
    }

    return (
        <Group gap={'xs'} justify={'center'} wrap={'nowrap'}>
            <Button
                leftSection={<PiEyeDuotone size={'1.5rem'} />}
                onClick={handleOpenModal}
                radius="md"
                size="xs"
                type="button"
            >
                View
            </Button>
        </Group>
    )
}
