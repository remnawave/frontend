import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

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
                message: 'Operation completed successfully',
                loading: false,
                autoClose: 3000
            })

            refetch()
        }
    }
}
