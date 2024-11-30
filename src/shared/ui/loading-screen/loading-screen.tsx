import { Center, Progress, Stack, Text } from '@mantine/core'

export function LoadingScreen({
    height = '100%',
    value = 100,
    text = undefined
}: {
    height?: string

    value?: number
    text?: string
}) {
    return (
        <Center h={height}>
            <Stack w="100%" align="center" gap="xs">
                {text && <Text size="lg">{text}</Text>}
                <Progress
                    color="red"
                    radius="xs"
                    value={value}
                    striped
                    w="80%"
                    animated
                    maw="32rem"
                />
            </Stack>
        </Center>
    )
}
