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
                type="button"
                size="xs"
                radius="md"
                leftSection={<PiEyeDuotone size={'1.5rem'} />}
                onClick={handleOpenModal}
            >
                View
            </Button>
        </Group>
    )
}
