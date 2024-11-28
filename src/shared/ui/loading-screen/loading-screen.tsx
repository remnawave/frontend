import { Center, Progress } from '@mantine/core'

export function LoadingScreen() {
    return (
        <Center h="100%">
            <Progress radius="xl" value={100} striped animated w="80%" maw="32rem" />
        </Center>
    )
}
