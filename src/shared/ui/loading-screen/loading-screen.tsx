import { Center, Progress, Stack, Text } from '@mantine/core'

export function LoadingScreen({
    height = '100%',
    text = undefined,
    value = 100
}: {
    height?: string
    text?: string
    value?: number
}) {
    return (
        <Center h={height}>
            <Stack align="center" gap="xs" w="100%">
                {text && <Text size="lg">{text}</Text>}
                <Progress
                    animated
                    color="cyan"
                    maw="32rem"
                    radius="xs"
                    striped
                    value={value}
                    w="80%"
                />
            </Stack>
        </Center>
    )
}
