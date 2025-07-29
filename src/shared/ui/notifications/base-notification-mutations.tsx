import { notifications } from '@mantine/notifications'
import { TbCheck as IconCheck } from 'react-icons/tb'

export const baseNotificationsMutations = (id: string, refetch: () => void) => {
    return {
        onMutate: () => {
            notifications.show({
                id,
                loading: true,
                title: 'Processing',
                message: 'This operation may take some time...',
                autoClose: false,
                withCloseButton: false
            })

            return undefined
        },
        onSettled(error: unknown) {
            if (error) {
                notifications.update({
                    id,
                    color: 'red',
                    title: 'Error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                    loading: false,
                    autoClose: 5000
                })
            }
        },
        onSuccess: () => {
            notifications.update({
                icon: <IconCheck size={18} />,
                id,
                color: 'teal',
                title: 'Success',
                message: 'Task added to queue. Please wait for it to be processed.',
                loading: false,
                autoClose: 3000
            })

            refetch()
        }
    }
}
