import { Center, Stack, Text } from '@mantine/core'
import { PiEmpty } from 'react-icons/pi'

export const EmptyPageLayout = () => {
    return (
        <Center h="calc(90vh - 120px)" mt="-5vh">
            <Stack align="center" c="dimmed" gap="md">
                <PiEmpty size={48} />
                <Text>Nothing found</Text>
            </Stack>
        </Center>
    )
}
