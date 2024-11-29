import { Center, Progress } from '@mantine/core'

export function LoadingScreen({ height = '100%' }: { height?: string }) {
    return (
        <Center h={height}>
            <Progress radius="xs" value={100} striped animated w="80%" maw="32rem" color="red" />
        </Center>
    )
}
